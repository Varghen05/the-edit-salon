"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "./scrollState";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    scrollState.lenis = lenis;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
      scrollState.velocity = lenis?.velocity ?? 0;
      ScrollTrigger.update();
    };

    lenis?.on("scroll", update);
    window.addEventListener("scroll", update, { passive: true });
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page anchor links scroll smoothly through Lenis, offset for the floating nav
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href")!);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.6 });
      else target.scrollIntoView();
    };
    document.addEventListener("click", onClick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", update);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      scrollState.lenis = null;
    };
  }, []);

  return null;
}
