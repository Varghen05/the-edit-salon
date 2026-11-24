"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "../icons";
import { site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINE = "Your chair is waiting.";

/**
 * The empty wash lounge, as a closing invitation. The video starts inside a rounded frame
 * and opens out to fill the screen as you scroll in, a curve of rose-gold light draws itself
 * across the ceiling, and the headline types itself out letter by letter before the booking
 * buttons arrive. Works the same on phones.
 */
export default function ChairScene() {
  const root = useRef<HTMLElement>(null);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const chars = gsap.utils.toArray<HTMLElement>(".cw-char");
      const path = root.current!.querySelector<SVGPathElement>(".cw-light")!;
      const len = path.getTotalLength();

      if (reduce) {
        gsap.set(chars, { opacity: 1 });
        gsap.set(".cw-after", { opacity: 1, y: 0 });
        return;
      }

      gsap.set([path, ".cw-glow"], { strokeDasharray: len, strokeDashoffset: len });

      // The frame opens out to full screen as the section arrives
      gsap.fromTo(
        ".cw-frame",
        { clipPath: "inset(9% 6% 9% 6% round 44px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root.current, start: "top 88%", end: "top 12%", scrub: 0.8 } },
      );
      // Slow push-in on the room, and the light strip draws itself
      gsap.fromTo(".cw-photo", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.to([path, ".cw-glow"], { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 80%", end: "center 55%", scrub: 1 } });

      // Typewriter, then the call to action
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 45%" } })
        .to(chars, { opacity: 1, duration: 0.01, stagger: 0.06, ease: "none" })
        .to(".cw-caret", { opacity: 0, repeat: 5, yoyo: true, duration: 0.35 }, "<")
        .to(".cw-after", { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: "power3.out" }, "-=0.2");
    },
    { scope: root },
  );

  return (
    <section ref={root} id="chair" className="relative z-10 bg-ink px-0 py-0 md:py-10">
      <div className="cw-frame relative flex h-[92svh] min-h-[600px] items-center justify-center overflow-hidden">
        <div className="cw-photo absolute inset-0">
          <video className="h-full w-full object-cover" src="/video/chair-waiting.mp4" poster="/images/editorial/chair-waiting.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-[#1b0f1f]/50 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(27,15,31,0.55),transparent_70%)]" />

        {/* a curve of rose-gold light across the ceiling */}
        <svg className="pointer-events-none absolute inset-x-0 top-0 h-[45%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="cwRose" x1="0" x2="1">
              <stop offset="0" stopColor="#d9a27e" stopOpacity="0" />
              <stop offset="0.2" stopColor="#f6d3c0" />
              <stop offset="0.8" stopColor="#f1c9a9" />
              <stop offset="1" stopColor="#d9a27e" stopOpacity="0" />
            </linearGradient>
            <filter id="cwBlur">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <path className="cw-glow" d="M-20 120 C 320 120, 420 300, 720 300 S 1120 120, 1460 120" fill="none" stroke="#f1c9a9" strokeOpacity="0.5" strokeWidth="14" filter="url(#cwBlur)" />
          <path className="cw-light" d="M-20 120 C 320 120, 420 300, 720 300 S 1120 120, 1460 120" fill="none" stroke="url(#cwRose)" strokeWidth="2.2" />
        </svg>

        <div className="relative z-10 px-5 text-center">
          <h2 className="display text-[clamp(2.8rem,8vw,7rem)] leading-none text-silver" aria-label={LINE}>
            {LINE.split(" ").map((word, w, words) => (
              <span key={w} aria-hidden className="inline-block whitespace-nowrap">
                {word.split("").map((c, i) => (
                  <span key={i} className={`cw-char opacity-0 ${w === words.length - 1 ? "text-rose italic" : ""}`}>
                    {c}
                  </span>
                ))}
                {w === words.length - 1 ? (
                  <span className="cw-caret ml-1 inline-block h-[0.8em] w-[2px] translate-y-[0.08em] bg-rose" />
                ) : (
                  <span className="cw-char opacity-0">{"\u00A0"}</span>
                )}
              </span>
            ))}
          </h2>
          <p className="cw-after mt-8 translate-y-5 text-[0.72rem] tracking-[0.45em] text-rose uppercase opacity-0">Book your self-care now</p>
          <div className="cw-after mt-10 flex translate-y-5 flex-wrap justify-center gap-3 opacity-0">
            <a href="#book" className="btn btn-solid">
              Book an appointment <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={maps} target="_blank" rel="noreferrer" className="btn">
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
