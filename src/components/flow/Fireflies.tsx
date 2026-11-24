"use client";

import { useEffect, useRef } from "react";

type Fly = { x: number; y: number; z: number; ph: number; sp: number };

/**
 * Night-only fireflies. Soft warm lights drift lazily across the whole page, each blinking
 * on its own rhythm; nearer ones are bigger and move more, and everything drifts a little
 * with the scroll for depth. Hidden in day mode and paused when the tab is in the background.
 */
export default function Fireflies() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // One pre-rendered glow, stamped for every firefly
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,246,200,1)");
    g.addColorStop(0.18, "rgba(255,226,140,0.85)");
    g.addColorStop(0.5, "rgba(255,196,90,0.22)");
    g.addColorStop(1, "rgba(255,190,80,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 64, 64);

    let w = 0;
    let h = 0;
    let dpr = 1;
    const count = innerWidth < 768 ? 26 : 46;
    const flies: Fly[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + Math.random() * 0.95,
      ph: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 0.9,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (document.documentElement.dataset.theme === "day") return;
      const t = reduce ? 4000 : time;
      const scroll = scrollY;
      ctx.globalCompositeOperation = "lighter";
      for (const f of flies) {
        // lazy wandering path, deeper ones move less
        const px = f.x * w + Math.sin(t * 0.00028 * f.sp + f.ph) * 70 * f.z + Math.sin(t * 0.0007 * f.sp + f.ph * 2) * 14;
        const rawY = f.y * h + Math.cos(t * 0.00022 * f.sp + f.ph) * 50 * f.z - scroll * 0.18 * f.z;
        const py = ((rawY % h) + h) % h;
        // each one blinks on its own rhythm; sometimes fully dark
        const pulse = Math.max(0, Math.sin(t * 0.0016 * f.sp + f.ph * 3));
        const alpha = Math.pow(pulse, 2.2) * 0.95;
        if (alpha < 0.02) continue;
        const size = (22 + f.z * 34) * dpr;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, px * dpr - size / 2, py * dpr - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="fireflies pointer-events-none fixed inset-0 z-[45] h-full w-full" />;
}
