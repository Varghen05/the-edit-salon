"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINE_1 = "Your chair is waiting.";

/**
 * Closing call to action: an empty wash lounge, a line of gold light drawing itself
 * across the ceiling, and the invitation typed out letter by letter.
 */
export default function ChairWaiting({ video }: { video: string | null }) {
  const root = useRef<HTMLElement>(null);

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

      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(".cw-glow", { strokeDasharray: len, strokeDashoffset: len });

      // The light strip draws itself as the section scrolls in
      gsap.to([path, ".cw-glow"], {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 1 },
      });
      // Slow push-in on the room
      gsap.fromTo(".cw-photo", { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });

      // Typewriter, then the call to action
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 45%" } })
        .to(chars, { opacity: 1, duration: 0.01, stagger: 0.065, ease: "none" })
        .to(".cw-caret", { opacity: 0, repeat: 5, yoyo: true, duration: 0.35 }, "<")
        .to(".cw-after", { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.2");
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative z-10 flex h-[92svh] min-h-[560px] items-center justify-center overflow-hidden bg-black">
      <div className="cw-photo absolute inset-0">
        {video ? (
          <video className="h-full w-full object-cover" src={video} poster="/images/editorial/chair-waiting.jpg" autoPlay muted loop playsInline aria-hidden />
        ) : (
          <Image src="/images/editorial/chair-waiting.jpg" alt="Empty wash lounge chairs at THE EDIT, waiting for the next guest" fill sizes="100vw" className="object-cover" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/45 to-black" />

      {/* Curved strip of gold light across the ceiling */}
      <svg className="pointer-events-none absolute inset-x-0 top-0 h-[45%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="cwGold" x1="0" x2="1">
            <stop offset="0" stopColor="#8a6a35" stopOpacity="0" />
            <stop offset="0.2" stopColor="#f0d59c" />
            <stop offset="0.8" stopColor="#f0d59c" />
            <stop offset="1" stopColor="#8a6a35" stopOpacity="0" />
          </linearGradient>
          <filter id="cwBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <path className="cw-glow" d="M-20 120 C 320 120, 420 300, 720 300 S 1120 120, 1460 120" fill="none" stroke="#f0d59c" strokeOpacity="0.55" strokeWidth="14" filter="url(#cwBlur)" />
        <path className="cw-light" d="M-20 120 C 320 120, 420 300, 720 300 S 1120 120, 1460 120" fill="none" stroke="url(#cwGold)" strokeWidth="2.2" />
      </svg>

      <div className="relative z-10 px-5 text-center">
        <h2 className="font-serif text-[clamp(2.6rem,8vw,7rem)] leading-none font-light text-silver" aria-label={LINE_1}>
          {/* Words stay whole when the line wraps; the caret rides on the last word */}
          {LINE_1.split(" ").map((word, w, words) => (
            <span key={w} aria-hidden className="inline-block whitespace-nowrap">
              {word.split("").map((c, i) => (
                <span key={i} className={`cw-char opacity-0 ${w === words.length - 1 ? "gold-text " : ""}`}>
                  {c}
                </span>
              ))}
              {w === words.length - 1 ? (
                <span className="cw-caret ml-1 inline-block h-[0.8em] w-[2px] translate-y-[0.08em] bg-gold-hi" />
              ) : (
                <span className="cw-char opacity-0">{" "}</span>
              )}
            </span>
          ))}
        </h2>
        <p className="cw-after mt-8 translate-y-5 text-[0.72rem] tracking-[0.5em] text-gold-hi uppercase opacity-0">Book your self-care now</p>
        <div className="cw-after mt-10 flex translate-y-5 justify-center opacity-0">
          <a href="#book" className="btn btn-solid">
            Book an appointment
          </a>
        </div>
      </div>
    </section>
  );
}
