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
 * The services on a 3D carousel, the same on every screen. Five glass cards stand on a ring
 * in deep perspective; as you scroll the ring turns and the card at the front lifts forward
 * while the others fall back and dim. The service name and a progress line follow the turn,
 * and silk flows behind. The ring is sized from the card width, so it scales to phones.
 */
export default function ServiceRing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ring-card");
        const n = cards.length;
        const step = 360 / n;
        const ring = { a: 0 };
        const title = root.current!.querySelector<HTMLElement>(".ring-title")!;
        const count = root.current!.querySelector<HTMLElement>(".ring-count")!;
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        let radius = 0;
        let shown = -1;

        const measure = () => {
          radius = cards[0].offsetWidth * 1.66; // ring radius follows the card width
        };
        measure();

        const layout = () => {
          cards.forEach((c, i) => {
            const a = i * step - ring.a;
            const front = (Math.cos((a * Math.PI) / 180) + 1) / 2; // 1 at the front, 0 at the back
            const lift = Math.pow(front, 3);
            gsap.set(c, {
              transform: `translate(-50%,-50%) rotateY(${a}deg) translateZ(${radius + lift * radius * 0.145}px) scale(${0.9 + lift * 0.14})`,
              opacity: 0.18 + front * 0.82,
              // blur is skipped on touch screens to keep scrolling smooth
              filter: coarse ? `brightness(${0.45 + front * 0.55})` : `brightness(${0.45 + front * 0.55}) blur(${(1 - front) * 1.6}px)`,
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
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${n * 75}%`,
            scrub: 1,
            pin: true,
            onRefresh: () => {
              measure();
              layout();
            },
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="relative z-10 h-[100svh] min-h-[560px] overflow-hidden bg-ink-2">
      <Ribbon className="absolute inset-0 opacity-70" count={2} lift={-1.2} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_30%,rgba(34,18,42,0.85)_100%)]" />

      <div className="wrap absolute inset-x-0 top-0 z-20 pt-24 sm:pt-28 lg:pt-32">
        <p className="eyebrow">The services</p>
        <h2 className="display mt-4 max-w-[760px] text-[clamp(2rem,4.6vw,4.2rem)] sm:mt-5">
          Five rituals, <em>one standard</em> of care.
        </h2>
      </div>

      <div className="absolute inset-0" style={{ perspective: "clamp(1300px, 250vw, 1700px)" }}>
        <div aria-hidden className="ring-title pointer-events-none absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[22vw] leading-none whitespace-nowrap text-white/[0.05] lg:text-[15vw]" />
        <div className="absolute top-[63%] left-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {services.map((s) => (
            <a key={s.key} href="#prices" className="ring-card glass group absolute top-0 left-0 block w-[min(200px,54vw)] overflow-hidden rounded-[26px] p-2.5 lg:w-[290px] lg:rounded-[30px] lg:p-3" style={{ backfaceVisibility: "hidden" }}>
              <div className="relative h-[clamp(110px,20svh,230px)] overflow-hidden rounded-[18px] lg:rounded-[22px]">
                <Image src={s.img} alt={`${s.title} at THE EDIT`} fill sizes="(max-width: 1024px) 200px, 290px" loading="eager" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b0f1f]/70 to-transparent" />
              </div>
              <div className="px-2 pt-3.5 pb-2 lg:px-2.5 lg:pt-4 lg:pb-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl lg:text-3xl">{s.title}</h3>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/8 transition-transform duration-500 group-hover:rotate-45 lg:h-9 lg:w-9">
                    <ArrowUpRight className="h-4 w-4 text-rose" />
                  </span>
                </div>
                <p className="mt-1 text-[0.8rem] text-silver/60 lg:mt-1.5 lg:text-sm">{s.line}</p>
                <p className="mt-2.5 text-[0.8rem] text-gold-hi lg:mt-3 lg:text-sm">from {fromPrice[s.key]}</p>
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
    </section>
  );
}
