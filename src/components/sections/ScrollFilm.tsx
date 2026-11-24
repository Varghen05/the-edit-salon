"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAMES = 60;
const frameSrc = (i: number) => `/film/f${String(i).padStart(3, "0")}.jpg`;

const WORDS = [
  { word: "Cut", line: "Precision, one strand at a time" },
  { word: "Colour", line: "Tones chosen for your skin and light" },
  { word: "Care", line: "Rituals that leave hair healthier" },
  { word: "Glow", line: "The finish you walk out with" },
];

/**
 * A scroll-driven film, in the spirit of product-story sites: the shears close frame by
 * frame as you scroll while oversized words change behind the caption.
 */
export default function ScrollFilm() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const cv = canvas.current!;
      const ctx = cv.getContext("2d")!;
      const mobile = window.innerWidth < 768;
      const step = mobile ? 2 : 1; // lighter sequence on phones
      const images: HTMLImageElement[] = [];
      const state = { frame: 0 };

      const draw = () => {
        // Nearest frame that has finished loading, so fast scrolling never shows a blank
        let img: HTMLImageElement | undefined;
        for (let k = Math.round(state.frame / step); k >= 0; k--) {
          if (images[k]?.complete && images[k].naturalWidth) {
            img = images[k];
            break;
          }
        }
        if (!img) return;
        const w = cv.clientWidth;
        const h = cv.clientHeight;
        const dpr = Math.min(window.devicePixelRatio, 2);
        if (cv.width !== w * dpr) {
          cv.width = w * dpr;
          cv.height = h * dpr;
        }
        // cover-fit
        const s = Math.max((w * dpr) / img.naturalWidth, (h * dpr) / img.naturalHeight);
        const dw = img.naturalWidth * s;
        const dh = img.naturalHeight * s;
        ctx.drawImage(img, (w * dpr - dw) / 2, (h * dpr - dh) / 2, dw, dh);
      };

      // Load the sequence only when the section approaches
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 250%",
        once: true,
        onEnter: () => {
          for (let i = 0; i < FRAMES; i += step) {
            const im = new Image();
            im.decoding = "async";
            im.src = frameSrc(i);
            if (i === 0) im.onload = draw;
            images.push(im);
          }
        },
      });

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = gsap.utils.toArray<HTMLElement>(".sf-word");
      gsap.set(words.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=320%", scrub: reduce ? true : 0.6, pin: true },
      });
      tl.to(state, { frame: FRAMES - 1, ease: "none", duration: WORDS.length, onUpdate: draw }, 0);
      words.forEach((w, i) => {
        const big = w.querySelector(".sf-big");
        const small = w.querySelector(".sf-small");
        if (i > 0) {
          tl.fromTo(w, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, i)
            .fromTo(big, { yPercent: 40, filter: "blur(16px)", letterSpacing: "0.4em" }, { yPercent: 0, filter: "blur(0px)", letterSpacing: "0.06em", duration: 0.5, ease: "power3.out" }, i)
            .fromTo(small, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, i + 0.2);
        }
        if (i < words.length - 1) tl.to(w, { autoAlpha: 0, duration: 0.2 }, i + 0.82).to(big, { yPercent: -30, filter: "blur(12px)", duration: 0.25 }, i + 0.8);
      });
      tl.to(".sf-progress", { scaleX: 1, ease: "none", duration: WORDS.length }, 0);

      window.addEventListener("resize", draw);
      return () => window.removeEventListener("resize", draw);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="The craft, frame by frame" className="relative z-10 h-[100svh] overflow-hidden bg-ink">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,14,13,0.85)_0%,rgba(14,14,13,0.35)_45%,rgba(14,14,13,0)_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

      <p className="eyebrow absolute top-28 left-5 z-10 sm:left-12">The craft, frame by frame</p>

      {WORDS.map((w) => (
        <div key={w.word} className="sf-word absolute inset-x-5 bottom-[18%] z-10 sm:inset-x-12">
          <p className="sf-big font-serif text-[clamp(4.2rem,15vw,15rem)] leading-[0.9] tracking-[0.06em] text-silver drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            {w.word}
          </p>
          <p className="sf-small mt-5 max-w-[420px] text-sm tracking-[0.3em] text-gold-hi uppercase">{w.line}</p>
        </div>
      ))}

      <div className="absolute inset-x-5 bottom-10 z-10 flex items-center gap-4 sm:inset-x-12">
        {WORDS.map((w) => (
          <span key={w.word} className="font-serif text-[0.7rem] tracking-[0.25em] text-silver/60">
            {w.word}
          </span>
        ))}
        <span className="relative ml-4 h-px flex-1 bg-white/15">
          <span className="sf-progress absolute inset-0 origin-left scale-x-0 bg-gold" />
        </span>
      </div>
    </section>
  );
}
