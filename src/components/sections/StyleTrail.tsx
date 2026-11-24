"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { trailImages } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Small optimised versions via the Next.js image endpoint
const thumb = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=384&q=75`;

/**
 * "We edit your style": photos of the work bloom along the cursor's path.
 * On touch screens the trail draws itself along a slow figure-of-eight.
 */
export default function StyleTrail() {
  const root = useRef<HTMLElement>(null);
  const pool = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const tiles = gsap.utils.toArray<HTMLElement>(".trail-tile");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.from(".trail-line", {
        yPercent: 110,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 70%" },
      });
      if (reduce) return;

      let i = 0;
      let last = { x: -999, y: -999 };
      const spawn = (x: number, y: number) => {
        const el = tiles[i++ % tiles.length];
        gsap.killTweensOf(el);
        gsap.set(el, { x, y, xPercent: -50, yPercent: -50, rotate: gsap.utils.random(-12, 12), zIndex: i });
        gsap
          .timeline()
          .fromTo(el, { scale: 0.4, opacity: 0, filter: "brightness(1.8)" }, { scale: 1, opacity: 1, filter: "brightness(1)", duration: 0.5, ease: "expo.out" })
          .to(el, { scale: 0.85, opacity: 0, y: y + 40, duration: 0.9, ease: "power2.in" }, 0.7);
      };

      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine) {
        const onMove = (e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          if (Math.hypot(x - last.x, y - last.y) > 110) {
            last = { x, y };
            spawn(x, y);
          }
        };
        section.addEventListener("pointermove", onMove);
        return () => section.removeEventListener("pointermove", onMove);
      }

      // Touch: an automatic trail while the section is on screen
      let t = 0;
      const auto = gsap.to({}, {
        duration: 0.45,
        repeat: -1,
        paused: true,
        onRepeat: () => {
          t += 0.55;
          const r = section.getBoundingClientRect();
          spawn(r.width / 2 + Math.sin(t) * r.width * 0.32, r.height / 2 + Math.sin(t * 2) * r.height * 0.22);
        },
      });
      ScrollTrigger.create({ trigger: section, start: "top 80%", end: "bottom 20%", onToggle: (s) => (s.isActive ? auto.play() : auto.pause()) });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative z-10 flex min-h-[90svh] items-center justify-center overflow-hidden bg-black">
      <div ref={pool} aria-hidden className="pointer-events-none absolute inset-0">
        {[...trailImages, ...trailImages.slice(0, 4)].map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={thumb(src)}
            alt=""
            loading="lazy"
            className="trail-tile absolute top-0 left-0 h-[200px] w-[150px] rounded-sm object-cover opacity-0 shadow-[0_20px_50px_#000] sm:h-[260px] sm:w-[200px]"
          />
        ))}
      </div>

      <div className="relative z-[100] px-5 text-center mix-blend-difference">
        <p className="eyebrow mb-8 justify-center text-gold">Move to explore</p>
        <h2 className="display text-[clamp(3rem,10vw,9rem)] text-white">
          <span className="block overflow-hidden">
            <span className="trail-line block">We edit your style</span>
          </span>
          <span className="block overflow-hidden">
            <span className="trail-line block ">just for you.</span>
          </span>
        </h2>
      </div>
    </section>
  );
}
