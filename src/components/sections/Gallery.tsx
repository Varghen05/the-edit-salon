"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { gallery } from "@/lib/site";
import { ArrowRight } from "../icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Pinned section: vertical scroll drives a horizontal filmstrip of the salon. */
export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".gal-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="gallery" className="relative z-10 bg-black overflow-hidden py-24 md:flex md:h-screen md:items-center md:py-0">
      <div ref={track} className="flex gap-6 px-5 max-md:snap-x max-md:snap-mandatory max-md:scroll-px-5 max-md:overflow-x-auto md:gap-10 md:pl-[8vw]">
        <div className="flex w-[78vw] shrink-0 snap-start flex-col justify-center md:w-[30vw]">
          <p className="eyebrow">The space</p>
          <h2 className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)] text-silver">
            Step into <em className="gold-text">the edit.</em>
          </h2>
          <p className="mt-6 max-w-[340px] font-light text-silver/75">
            Warm light, considered detail and skilled hands. A look at the craft we bring to every chair.
          </p>
          <p className="mt-10 hidden text-[0.6rem] tracking-[0.35em] text-gold uppercase md:block">Keep scrolling <ArrowRight className="ml-2 inline h-3.5 w-3.5" strokeWidth={1.25} /></p>
        </div>

        {gallery.map((g, i) => (
          <figure
            key={g.src}
            className={`relative shrink-0 snap-center overflow-hidden border border-line ${
              i % 2 ? "arch h-[58vh] md:h-[68vh]" : "h-[46vh] md:h-[56vh] md:self-end"
            }`}
            style={{ aspectRatio: `${g.w} / ${g.h}` }}
          >
            <Image src={g.src} alt={g.alt} fill sizes="60vw" className="gal-img scale-[1.25] object-cover" />
          </figure>
        ))}
        <div className="w-[8vw] shrink-0" />
      </div>
    </section>
  );
}
