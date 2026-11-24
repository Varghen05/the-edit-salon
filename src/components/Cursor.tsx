"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Gold ring that trails the pointer and swells over links. Desktop pointers only. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = ring.current!;
    const d = dot.current!;
    r.style.display = d.style.display = "block";
    gsap.set([r, d], { opacity: 0 });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });
    const dx = gsap.quickTo(d, "x", { duration: 0.1 });
    const dy = gsap.quickTo(d, "y", { duration: 0.1 });

    const move = (e: PointerEvent) => {
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      const hot = (e.target as HTMLElement).closest("a, button, summary, select, input, textarea, [role=tab]");
      gsap.to(r, { scale: hot ? 1.8 : 1, opacity: hot ? 0.5 : 1, duration: 0.4 });
      gsap.to(d, { opacity: 1, duration: 0.4 });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] -mt-5 -ml-5 hidden h-10 w-10 rounded-full border border-gold/70 mix-blend-difference"
      />
      <div ref={dot} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[70] -mt-[3px] -ml-[3px] hidden h-1.5 w-1.5 rounded-full bg-gold-hi" />
    </>
  );
}
