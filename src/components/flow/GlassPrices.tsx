"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { priceMenu } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The price menu as four glass cards that float up in a staggered wave and drift at
 * slightly different speeds while scrolling, so the grid feels like it's flowing.
 */
export default function GlassPrices() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".gp-card", { y: 120, rotateX: 18, opacity: 0, duration: 1.5, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".gp-grid", start: "top 80%" } });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const amp = window.innerWidth < 768 ? 0.45 : 1; // gentler drift on a single phone column
        gsap.utils.toArray<HTMLElement>(".gp-card").forEach((el, i) => {
          gsap.to(el, { yPercent: (i % 2 ? -10 : 6) * amp, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="prices" className="relative z-10 overflow-hidden bg-ink-2 py-28 lg:py-40">
      <div className="blob top-[5%] right-[5%] h-[34vw] w-[34vw] bg-[var(--blob-b)]" />
      <div className="blob bottom-[5%] left-[0%] h-[30vw] w-[30vw] bg-[var(--blob-c)] opacity-30 [animation-delay:-5s]" />

      <div className="wrap relative">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Price menu</p>
            <h2 className="display mt-5 text-[clamp(2.8rem,5.6vw,5.4rem)]">
              Good care, <em>clear prices.</em>
            </h2>
          </div>
          <p className="max-w-[360px] text-silver/65">Starting prices. Colour, keratin and bridal depend on your hair and the look, so we quote before we begin.</p>
        </div>

        <div className="gp-grid mt-16 grid gap-6 md:grid-cols-2" style={{ perspective: "1400px" }}>
          {priceMenu.map((g) => (
            <article key={g.group} className="gp-card glass overflow-hidden rounded-[32px] transition-transform duration-500 hover:-translate-y-2">
              <div className="relative h-44 overflow-hidden">
                <Image src={g.img} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--scrim))] via-[rgb(var(--scrim)/0.4)] to-transparent" />
                <h3 className="absolute bottom-4 left-7 font-serif text-3xl">{g.group}</h3>
              </div>
              <ul className="px-7 pt-3 pb-7">
                {g.items.map((it) => (
                  <li key={it.name} className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 last:border-0">
                    <span className="text-silver/85">{it.name}</span>
                    <span className="shrink-0 font-medium text-gold-hi">{it.price}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-silver/45">Indicative prices, to be confirmed by the salon.</p>
      </div>
    </section>
  );
}
