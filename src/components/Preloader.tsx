"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { scrollState } from "./motion/scrollState";

gsap.registerPlugin(useGSAP);

/** Fired on window when the curtain has lifted, so the hero can begin its entrance. */
export const INTRO_EVENT = "edit:intro";

/**
 * Opening curtain: the SR monogram is traced in gold light while a counter runs to 100,
 * then the two halves of the curtain part. Shorter on repeat visits in the same session.
 */
export default function Preloader({ monogramSvg }: { monogramSvg: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const w = window as unknown as { __introStarted?: boolean };
      // Announce from a fresh task so listeners' animations aren't adopted by this
      // component's GSAP context (which is reverted when the preloader unmounts)
      const start = () => {
        if (w.__introStarted) return;
        w.__introStarted = true;
        setTimeout(() => window.dispatchEvent(new Event(INTRO_EVENT + ":early")));
      };
      const finish = () => {
        try {
          sessionStorage.setItem("edit-intro", "1");
        } catch {}
        start();
        setTimeout(() => window.dispatchEvent(new Event(INTRO_EVENT)));
        scrollState.lenis?.start();
        setGone(true);
      };
      // Safety net: never leave a visitor behind the curtain if frames are throttled
      const fallback = window.setTimeout(() => {
        gsap.set(".pl-top, .pl-bottom, .pl-mark, .pl-meta", { autoAlpha: 0 });
        finish();
      }, 7000);
      let seen = false;
      try {
        seen = sessionStorage.getItem("edit-intro") === "1";
      } catch {}
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        clearTimeout(fallback);
        return finish();
      }

      // Hold the page still while the curtain is down (Lenis may mount a moment later)
      gsap.delayedCall(0.05, () => scrollState.lenis?.stop());
      const speed = seen ? 2.4 : 1;
      const paths = gsap.utils.toArray<SVGPathElement>(".pl-mark path");
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0, stroke: "#f0d59c", strokeWidth: 1.6 });
      });
      const counter = { v: 0 };

      gsap
        .timeline({
          onComplete: () => {
            clearTimeout(fallback);
            finish();
          },
        })
        .timeScale(speed)
        .to(paths, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.04 }, 0.1)
        .to(counter, {
          v: 100,
          duration: 2,
          ease: "power1.inOut",
          onUpdate: () => {
            const el = root.current?.querySelector(".pl-count");
            if (el) el.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        }, 0)
        .to(".pl-bar", { scaleX: 1, duration: 2, ease: "power1.inOut" }, 0)
        .to(paths, { fillOpacity: 1, strokeWidth: 0, duration: 0.7 }, 1.5)
        .to(".pl-mark", { scale: 1.08, filter: "drop-shadow(0 0 28px rgba(240,213,156,0.55))", duration: 0.6 }, 1.7)
        .to(".pl-meta", { opacity: 0, duration: 0.3 }, 2.1)
        .to(".pl-mark", { opacity: 0, scale: 0.9, duration: 0.45, ease: "power2.in" }, 2.2)
        .to(".pl-top", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.45)
        .to(".pl-bottom", { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, 2.45)
        // Let the hero start while the curtain is still opening
        .call(start, [], 2.55);
      return () => clearTimeout(fallback);
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90]" aria-hidden>
      <div className="pl-top absolute inset-x-0 top-0 h-1/2 bg-[#0e0e0d]" />
      <div className="pl-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#0e0e0d]" />
      <div className="pl-mark absolute top-1/2 left-1/2 h-[150px] w-[130px] -translate-x-1/2 -translate-y-1/2" dangerouslySetInnerHTML={{ __html: monogramSvg }} />
      <div className="pl-meta absolute inset-x-8 bottom-8 flex items-end justify-between text-silver/70">
        <span className="text-[0.62rem] tracking-[0.4em] uppercase">The Edit · Unisex Salon</span>
        <span className="pl-count font-serif text-5xl font-light text-gold-hi tabular-nums">000</span>
      </div>
      <div className="pl-meta absolute inset-x-0 bottom-0 h-px bg-white/10">
        <div className="pl-bar h-full origin-left scale-x-0 bg-gradient-to-r from-gold-lo via-gold-hi to-gold" />
      </div>
    </div>
  );
}
