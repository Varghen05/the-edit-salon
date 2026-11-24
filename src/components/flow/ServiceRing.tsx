"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "../icons";
import Ribbon from "../three/Ribbon";
import { services, priceMenu } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fromPrice: Record<string, string> = {
  hair: priceMenu[0].items[0].price,
  skin: priceMenu[1].items[0].price,
  beauty: priceMenu[1].items[2].price,
  nails: priceMenu[2].items[0].price,
  grooming: priceMenu[3].items[0].price,
};

/**
 * The services on a 3D carousel. Five glass cards stand on a ring in deep perspective; as
 * you scroll the ring turns and the card at the front lifts forward while the others fall
 * back and dim. The service name and a progress line follow the turn. Silk flows behind.
 * Phones get a swipeable row of the same cards.
 */
export default function ServiceRing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ring-card");
        const n = cards.length;
        const step = 360 / n;
        const ring = { a: 0 };
        const title = root.current!.querySelector<HTMLElement>(".ring-title")!;
        const count = root.current!.querySelector<HTMLElement>(".ring-count")!;
        let shown = -1;

        const layout = () => {
          cards.forEach((c, i) => {
            const a = i * step - ring.a;
            const front = (Math.cos((a * Math.PI) / 180) + 1) / 2; // 1 at the front, 0 at the back
            const lift = Math.pow(front, 3);
            gsap.set(c, {
              transform: `translate(-50%,-50%) rotateY(${a}deg) translateZ(${480 + lift * 70}px) scale(${0.9 + lift * 0.14})`,
              opacity: 0.18 + front * 0.82,
              filter: `brightness(${0.45 + front * 0.55}) blur(${(1 - front) * 1.6}px)`,
              zIndex: Math.round(front * 100),
            });
          });
          const idx = ((Math.round(ring.a / step) % n) + n) % n;
          if (idx !== shown) {
            shown = idx;
            gsap.fromTo(title, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
            title.textContent = services[idx].title;
            count.textContent = `0${idx + 1} / 0${n}`;
          }
          gsap.set(".ring-bar", { scaleX: (idx + 1) / n });
        };
        layout();

        gsap.to(ring, {
          a: (n - 1) * step,
          ease: "none",
          onUpdate: layout,
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${n * 75}%`, scrub: 1, pin: true },
        });
      });
      // Phones and tablets: as the row is swiped, each card swings in 3D around the centre one
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const sc = root.current!.querySelector<HTMLElement>(".svc-scroller")!;
        const items = gsap.utils.toArray<HTMLElement>(".svc-m");
        const update = () => {
          const cr = sc.getBoundingClientRect();
          const mid = cr.left + cr.width / 2;
          items.forEach((c) => {
            const r = c.getBoundingClientRect();
            const off = gsap.utils.clamp(-1.3, 1.3, (r.left + r.width / 2 - mid) / (cr.width / 1.6));
            gsap.set(c, { rotateY: -off * 38, scale: 1 - Math.abs(off) * 0.12, opacity: 1 - Math.abs(off) * 0.42, transformPerspective: 900 });
          });
        };
        update();
        sc.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        gsap.from(sc, { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: sc, start: "top 88%" } });
        gsap.from(".svc-hint", { opacity: 0, x: -20, duration: 1, delay: 0.6, scrollTrigger: { trigger: sc, start: "top 88%" } });
        return () => {
          sc.removeEventListener("scroll", update);
          window.removeEventListener("resize", update);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="relative z-10 overflow-hidden bg-ink-2 lg:h-screen">
      <Ribbon className="absolute inset-0 opacity-70" count={2} lift={-1.2} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_30%,rgba(34,18,42,0.85)_100%)]" />

      <div className="wrap relative z-20 pt-28 lg:absolute lg:inset-x-0 lg:top-0 lg:pt-32">
        <p className="eyebrow">The services</p>
        <h2 className="display mt-5 max-w-[760px] text-[clamp(2.4rem,4.6vw,4.2rem)]">
          Five rituals, <em>one standard</em> of care.
        </h2>
      </div>

      {/* desktop: the ring */}
      <div className="relative hidden h-full lg:block" style={{ perspective: "1700px" }}>
        <div aria-hidden className="ring-title pointer-events-none absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[15vw] leading-none whitespace-nowrap text-white/[0.05]" />
        <div className="absolute top-[60%] left-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {services.map((s) => (
            <a key={s.key} href="#prices" className="ring-card glass group absolute top-0 left-0 block w-[290px] overflow-hidden rounded-[30px] p-3" style={{ backfaceVisibility: "hidden" }}>
              <div className="relative h-[clamp(140px,27vh,230px)] overflow-hidden rounded-[22px]">
                <Image src={s.img} alt={`${s.title} at THE EDIT`} fill sizes="290px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b0f1f]/70 to-transparent" />
              </div>
              <div className="px-2.5 pt-4 pb-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-3xl">{s.title}</h3>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/8 transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4 text-rose" />
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-silver/60">{s.line}</p>
                <p className="mt-3 text-sm text-gold-hi">from {fromPrice[s.key]}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-8 mx-auto flex w-[min(420px,80%)] items-center gap-4 text-xs tracking-[0.25em] text-silver/60">
          <span className="ring-count tabular-nums">01 / 05</span>
          <span className="h-px flex-1 bg-white/15">
            <span className="ring-bar block h-full origin-left scale-x-[0.2] bg-rose" />
          </span>
          <span>SCROLL</span>
        </div>
      </div>

      {/* phones and tablets */}
      <div className="svc-scroller relative mt-12 flex snap-x snap-mandatory scroll-px-[calc(50%-125px)] gap-3 overflow-x-auto px-[calc(50%-125px)] pb-6 lg:hidden">
        {services.map((s) => (
          <a key={s.key} href="#prices" className="svc-m glass block w-[250px] shrink-0 snap-center rounded-[28px] p-2.5">
            <div className="relative h-[240px] overflow-hidden rounded-[20px]">
              <Image src={s.img} alt={`${s.title} at THE EDIT`} fill sizes="250px" loading="eager" className="object-cover" />
            </div>
            <div className="px-2 pt-4 pb-2">
              <h3 className="font-serif text-3xl">{s.title}</h3>
              <p className="mt-1 text-sm text-silver/60">{s.line}</p>
              <p className="mt-3 text-sm text-gold-hi">from {fromPrice[s.key]}</p>
            </div>
          </a>
        ))}
      </div>
      <p className="svc-hint relative px-5 pb-20 text-center text-[0.65rem] tracking-[0.3em] text-silver/50 lg:hidden">SWIPE TO EXPLORE →</p>
    </section>
  );
}
