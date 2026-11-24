"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ritualSteps } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The Ritual: a signature visit told in four steps. The section holds while you scroll;
 * each step's photo rises in black and white, then warms into colour as it becomes active.
 */
export default function Ritual({ videos = [] }: { videos?: (string | null)[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const n = ritualSteps.length;
        const frames = gsap.utils.toArray<HTMLElement>(".rt-frame");
        const texts = gsap.utils.toArray<HTMLElement>(".rt-text");
        const dots = gsap.utils.toArray<HTMLElement>(".rt-dot");
        gsap.set(frames.slice(1), { clipPath: "inset(100% 0 0 0)" });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 50 });
        gsap.set(frames[0].querySelector("img, video"), { filter: "grayscale(1) brightness(0.75)" });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${n * 80}%`, scrub: 1, pin: true },
        });

        // First photo warms from monochrome into the house colour
        tl.to(frames[0].querySelector("img, video"), { filter: "grayscale(0) brightness(1)", duration: 0.6 }, 0.1);
        for (let i = 1; i < n; i++) {
          const at = i;
          const img = frames[i].querySelector("img, video");
          tl.to(texts[i - 1], { autoAlpha: 0, y: -50, duration: 0.35 }, at)
            .fromTo(frames[i], { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.5, ease: "power2.inOut" }, at)
            .fromTo(img, { scale: 1.25, filter: "grayscale(1) brightness(0.75)" }, { scale: 1, duration: 0.8 }, at)
            .to(img, { filter: "grayscale(0) brightness(1)", duration: 0.45 }, at + 0.45)
            .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.25)
            .to(".rt-progress", { scaleY: (i + 1) / n, duration: 0.5 }, at)
            .to(dots[i], { backgroundColor: "#f0d59c", borderColor: "#f0d59c", duration: 0.2 }, at + 0.3)
            .to(".rt-num", { yPercent: (-100 / n) * i, duration: 0.5, ease: "power2.inOut" }, at);
        }
        tl.to({}, { duration: 0.4 });
      });

      // Phones / reduced motion: a simple stack, each photo warming into colour as it scrolls in
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(".rt-card img").forEach((img) => {
          gsap.fromTo(
            img,
            { filter: "grayscale(1) brightness(0.75)" },
            { filter: "grayscale(0) brightness(1)", ease: "none", scrollTrigger: { trigger: img, start: "top 85%", end: "center 50%", scrub: true } },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="ritual" className="relative z-10 bg-black lg:h-screen">
      {/* Desktop: pinned stage */}
      <div className="wrap hidden h-full items-center gap-16 lg:grid lg:grid-cols-[1fr_1.05fr]">
        <div className="relative">
          <p className="eyebrow">The Edit ritual</p>
          <div className="mt-6 flex items-end gap-6">
            {/* Rolling step number */}
            <div className="h-[9rem] overflow-hidden font-serif text-[9rem] leading-none font-light text-transparent [-webkit-text-stroke:1px_rgba(240,213,156,0.6)]">
              <div className="rt-num">
                {ritualSteps.map((s) => (
                  <div key={s.no} className="h-[9rem]">
                    {s.no}
                  </div>
                ))}
              </div>
            </div>
            <p className="mb-4 text-[0.68rem] tracking-[0.35em] text-silver/60 uppercase">of 04</p>
          </div>

          <div className="relative mt-6 h-[280px]">
            {ritualSteps.map((s) => (
              <div key={s.no} className="rt-text absolute inset-0">
                <h2 className="display text-[clamp(3rem,5vw,4.8rem)] text-silver">{s.title}</h2>
                <p className="mt-3 font-serif text-2xl text-gold-hi ">{s.line}</p>
                <p className="mt-5 max-w-[440px] leading-[1.8] font-light text-silver/80">{s.body}</p>
              </div>
            ))}
          </div>

          <ol className="mt-4 flex gap-3" aria-hidden>
            {ritualSteps.map((s, i) => (
              <li key={s.no} className={`rt-dot h-2 w-2 rounded-full border border-gold/60 ${i === 0 ? "bg-gold-hi" : ""}`} />
            ))}
          </ol>
        </div>

        <div className="relative flex h-full items-center justify-center">
          <div className="absolute top-1/2 -left-10 h-[70vh] w-px -translate-y-1/2 bg-white/10">
            <div className="rt-progress h-full w-full origin-top scale-y-[0.25] bg-gold" />
          </div>
          <div className="relative h-[80vh] w-full max-w-[560px] overflow-hidden rounded-t-full border border-gold/30">
            {ritualSteps.map((s, i) => (
              <div key={s.no} className="rt-frame absolute inset-0" style={{ zIndex: i }}>
                {videos[i] ? (
                  // Flow clip when available; the filter animation targets it like the photo
                  <video className="h-full w-full object-cover" src={videos[i]!} poster={s.img} autoPlay muted loop playsInline aria-label={`${s.title}: ${s.line}`} />
                ) : (
                  <Image src={s.img} alt={`${s.title}: ${s.line}`} fill sizes="560px" className="object-cover" />
                )}
              </div>
            ))}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Phones: stacked cards */}
      <div className="wrap py-24 lg:hidden">
        <p className="eyebrow">The Edit ritual</p>
        <h2 className="display mt-6 text-[clamp(2.6rem,10vw,3.6rem)] text-silver">Four steps to your best edit.</h2>
        <div className="mt-12 space-y-14">
          {ritualSteps.map((s) => (
            <article key={s.no} className="rt-card">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold/30">
                <Image src={s.img} alt={`${s.title}: ${s.line}`} fill sizes="90vw" className="object-cover" />
              </div>
              <p className="mt-6 font-serif text-5xl text-transparent [-webkit-text-stroke:1px_rgba(240,213,156,0.6)]">{s.no}</p>
              <h3 className="mt-2 font-serif text-4xl text-silver">{s.title}</h3>
              <p className="mt-1 font-serif text-xl text-gold-hi ">{s.line}</p>
              <p className="mt-3 leading-relaxed font-light text-silver/80">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
