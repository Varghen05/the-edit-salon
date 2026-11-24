"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Endless, slow drift of review cards. Pauses while hovered. */
export default function ReviewMarquee({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = track.current!;
    const tween = gsap.to(el, { xPercent: -50, ease: "none", duration: 60, repeat: -1 });
    el.addEventListener("mouseenter", () => tween.pause());
    el.addEventListener("mouseleave", () => tween.resume());
  });

  return (
    <div className="mt-16 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div ref={track} className="flex w-max gap-5">
        {children}
        {/* Duplicate for a seamless loop */}
        <div className="flex gap-5" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
