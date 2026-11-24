"use client";

import { useEffect, useRef } from "react";

/**
 * Fine strands of gold light that drift and curl like hair, drawn on a transparent
 * canvas. Each strand follows a slowly changing flow field and keeps a short tail.
 */
export default function HairStrands({ className, count = 70 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const n = window.innerWidth < 768 ? Math.round(count * 0.5) : count;
    const TAIL = 26;
    const strands = Array.from({ length: n }, () => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      return { pts: Array.from({ length: TAIL }, () => ({ x, y })), speed: 0.6 + Math.random() * 0.9, hue: Math.random() };
    });

    // Smooth pseudo-noise flow field: layered sines read as soft, combed curls
    const field = (x: number, y: number, t: number) =>
      Math.sin(x * 0.0021 + t * 0.00011) * 1.4 + Math.cos(y * 0.0027 - t * 0.00009) * 1.2 + Math.sin((x + y) * 0.0011 + t * 0.00007);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const s of strands) {
        const head = s.pts[0];
        const a = field(head.x, head.y, t);
        const nx = head.x + Math.cos(a) * s.speed;
        const ny = head.y + Math.sin(a) * s.speed * 0.6 - 0.15;
        s.pts.pop();
        s.pts.unshift({ x: nx, y: ny });
        if (nx < -40 || nx > w + 40 || ny < -40 || ny > h + 40) {
          const rx = Math.random() * w;
          const ry = h + 20;
          s.pts = s.pts.map(() => ({ x: rx, y: ry }));
        }
        const grad = ctx.createLinearGradient(s.pts[0].x, s.pts[0].y, s.pts[TAIL - 1].x, s.pts[TAIL - 1].y);
        grad.addColorStop(0, `rgba(240, 214, 160, ${0.55 + s.hue * 0.3})`);
        grad.addColorStop(1, "rgba(240, 214, 160, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.6 + s.hue * 0.7;
        ctx.beginPath();
        ctx.moveTo(s.pts[0].x, s.pts[0].y);
        for (let i = 1; i < TAIL; i++) ctx.lineTo(s.pts[i].x, s.pts[i].y);
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className ?? ""}`} />;
}
