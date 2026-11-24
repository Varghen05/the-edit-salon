"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "../icons";
import { services, priceMenu } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Lowest starting price per service, shown on each card
const fromPrice: Record<string, string> = {
  hair: priceMenu[0].items[0].price,
  skin: priceMenu[1].items[0].price,
  beauty: priceMenu[1].items[2].price,
  nails: priceMenu[2].items[0].price,
  grooming: priceMenu[3].items[0].price,
};

/**
 * The edit menu as a row of arched mirrors, one per discipline. Each arch rises into
 * place as the row enters; hovering an arch brings its photograph forward.
 * Phones get a swipeable row of the same arches.
 */
export default function ServiceFan() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".svc-arch", {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.4,
          ease: "expo.inOut",
          stagger: 0.09,
          scrollTrigger: { trigger: ".svc-row", start: "top 80%" },
        });
        gsap.from(".svc-meta", {
          opacity: 0,
          y: 16,
          duration: 1,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.6,
          scrollTrigger: { trigger: ".svc-row", start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="relative z-10 bg-ink-2 py-28 lg:py-36">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Our services</p>
            <h2 className="display mt-5 max-w-[760px] text-[clamp(2.6rem,5vw,4.4rem)] text-silver">
              Luxury services, <em className="whitespace-nowrap">curated for you</em>
            </h2>
          </div>
          <p className="max-w-[360px] leading-relaxed text-silver/70">
            Five disciplines, one standard of care. Every visit begins with a conversation at the mirror.
          </p>
        </div>

        <div className="svc-row -mx-5 mt-16 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0">
          {services.map((s) => (
            <a key={s.key} href="#prices" className="group block w-[240px] shrink-0 snap-start lg:w-auto">
              <div className="svc-arch relative aspect-[3/4.4] overflow-hidden rounded-t-full bg-panel">
                <Image
                  src={s.img}
                  alt={`${s.title} at THE EDIT`}
                  fill
                  sizes="(max-width: 1024px) 240px, 20vw"
                  className="object-cover grayscale-[35%] transition-all duration-[900ms] ease-out group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
              </div>
              <div className="svc-meta mt-6 border-t border-line pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-[1.9rem] leading-none text-silver">{s.title}</h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-gold transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.2} />
                </div>
                <p className="mt-3 text-[0.6rem] tracking-[0.3em] text-muted uppercase">{s.line}</p>
                <p className="mt-3 text-sm text-silver/70">from {fromPrice[s.key]}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
