"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Tools in light": shears caught in a diagonal beam. Scrolling tilts the frame and
 * drags a band of gold light across it, like the sun moving through a window.
 */
export default function ShearsBeam({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 };
      gsap.fromTo(".sb-photo", { rotate: -5, scale: 1.15, yPercent: -6 }, { rotate: 4, scale: 1.02, yPercent: 6, ease: "none", scrollTrigger: st });
      gsap.fromTo(".sb-beam", { xPercent: -120 }, { xPercent: 120, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`dark relative overflow-hidden rounded-[24px] border border-gold/25 ${className ?? ""}`}>
      <div className="sb-photo absolute inset-[-8%]">
        <video
          className="h-full w-full object-cover"
          src="/video/shears-light.mp4"
          poster="/images/editorial/shears-beam.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Salon shears and comb resting on marble in a beam of light"
        />
      </div>
      <div className="sb-beam pointer-events-none absolute inset-y-[-20%] left-1/4 w-1/2 rotate-[24deg] bg-[linear-gradient(90deg,transparent,rgba(255,226,170,0.32),transparent)] mix-blend-screen blur-md" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <p className="absolute bottom-5 left-6 text-[0.62rem] tracking-[0.35em] text-gold-hi uppercase">Tools of the craft</p>
    </div>
  );
}
