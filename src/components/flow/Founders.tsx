"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ownerChapters, owners, values } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Meet the founders on blush pearl. Their portrait sits in a glass card that tilts in 3D
 * toward the pointer; the story chapters flow in one after another as you scroll.
 */
export default function Founders() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (window.innerWidth >= 1024) gsap.from(".fd-card", { rotateY: -22, rotateX: 6, opacity: 0, y: 50, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
        gsap.utils.toArray<HTMLElement>(".fd-chapter").forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });
      });
      // Phones and tablets: the portrait card sweeps through a 3D turn as it crosses the screen
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".fd-card",
          { rotateY: -16, rotateX: 5, y: 40, opacity: 0.4, transformPerspective: 900 },
          { rotateY: 14, rotateX: -4, y: -20, opacity: 1, ease: "none", scrollTrigger: { trigger: ".fd-card", start: "top 95%", end: "bottom 10%", scrub: 0.8 } },
        );
      });
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const el = card.current!;
        const rx = gsap.quickTo(el, "rotateX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(el, "rotateY", { duration: 0.8, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 14);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="founders" className="light relative z-10 overflow-hidden py-28 lg:py-40">
      <div className="blob top-[10%] right-[-10%] h-[38vw] w-[38vw] bg-[#f3c6c9] opacity-70" />
      <div className="blob bottom-[0%] left-[-12%] h-[32vw] w-[32vw] bg-[#f6d6bf] opacity-70 [animation-delay:-8s]" />

      <div className="wrap relative grid items-start gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28" style={{ perspective: "1200px" }}>
          <div ref={card} className="fd-card glass relative mx-auto max-w-[420px] rounded-[36px] p-3" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#f3c6c9,#d9a27e_55%,#5a2a52)]">
              <Image src="/images/owners.png" alt="Rekha and Saranya, founders of THE EDIT" fill sizes="(max-width: 1024px) 90vw, 420px" className="object-contain object-bottom" />
            </div>
            <div className="glass absolute -right-6 -bottom-6 rounded-3xl px-6 py-4 text-left" style={{ transform: "translateZ(60px)" }}>
              <p className="font-serif text-2xl">
                {owners[0].name} &amp; {owners[1].name}
              </p>
              <p className="mt-1 text-[0.66rem] tracking-[0.3em] text-muted uppercase">Co-founders</p>
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Meet the founders</p>
          <h2 className="display mt-5 text-[clamp(2.6rem,5vw,4.8rem)]">
            Two friends, <em>one chair</em> at a time.
          </h2>
          <div className="mt-14 space-y-12">
            {ownerChapters.map((c, i) => (
              <article key={c.kicker} className="fd-chapter grid grid-cols-[56px_1fr] gap-5">
                <span className="font-serif text-3xl text-gold">0{i + 1}</span>
                <div className="border-t border-line pt-4">
                  <h3 className="font-serif text-3xl leading-tight">{c.title}</h3>
                  <p className="mt-3 max-w-[520px] leading-relaxed text-muted">{c.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="glass rounded-3xl p-5">
                <h4 className="font-serif text-xl">{v.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
