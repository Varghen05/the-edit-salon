"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Ornament, Sparkle } from "../icons";
import { ownerChapters, owners, values } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NUMERALS = ["I", "II", "III", "IV"];

/**
 * Meet the founders. A black-and-white portrait of Rekha and Saranya stands in a
 * gold-rimmed arch, like the salon's mirrors. While the section is held, four short
 * chapters tell their story and the arch's light warms with each one.
 */
export default function OwnersStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Entrance for every screen size: the arch draws, the portrait rises into it
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".founders-arch", start: "top 80%" } })
          .fromTo(".arch-rim path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" })
          .fromTo(".founders-photo", { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, ease: "expo.out" }, 0.4)
          .fromTo(".founder-name", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, 1.1);
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const chapters = gsap.utils.toArray<HTMLElement>(".chapter");
        gsap.set(chapters.slice(1), { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${chapters.length * 80}%`, scrub: 1, pin: true },
        });
        chapters.forEach((ch, i) => {
          if (i === 0) return;
          tl.to(chapters[i - 1], { autoAlpha: 0, y: -40, duration: 0.4 }, i)
            .to(ch, { autoAlpha: 1, y: 0, duration: 0.45 }, i + 0.2)
            .to(".rail-fill", { scaleY: (i + 1) / chapters.length, duration: 0.5 }, i)
            .to(".arch-glow", { opacity: 0.35 + i * 0.18, duration: 0.6 }, i);
        });
        tl.to({}, { duration: 0.4 });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".chapter").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 30, duration: 1, scrollTrigger: { trigger: el, start: "top 85%" } });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" className="light relative z-10 overflow-hidden lg:h-screen">
      <div className="wrap grid h-full items-center gap-14 py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:py-0">
        {/* Portrait in a gold-rimmed arch */}
        <div className="founders-arch relative mx-auto w-full max-w-[420px]">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[72vh]">
            <div className="arch-glow absolute inset-0 rounded-t-full bg-[radial-gradient(ellipse_at_50%_30%,rgba(217,191,140,0.4),rgba(30,30,28,0.95)_62%,#161615)] opacity-35" />
            <div className="absolute inset-0 overflow-hidden rounded-t-full">
              <div className="founders-photo absolute inset-x-0 bottom-0 h-[96%]">
                <Image
                  src="/images/owners.png"
                  alt="Rekha and Saranya, founders of THE EDIT"
                  fill
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-contain object-bottom [mask-image:linear-gradient(to_bottom,#000_78%,transparent)]"
                />
              </div>
            </div>
            {/* Hairline rim, drawn on entrance */}
            <svg className="arch-rim pointer-events-none absolute -inset-3" viewBox="0 0 100 133" preserveAspectRatio="none" aria-hidden>
              <path
                d="M2 131 V50 A48 48 0 0 1 98 50 V131"
                fill="none"
                stroke="url(#rimGold)"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
              />
              <defs>
                <linearGradient id="rimGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d9bf8c" />
                  <stop offset="1" stopColor="#8a6d3b" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
            <Sparkle className="absolute -top-5 left-1/2 h-3 w-3 -translate-x-1/2 text-gold-hi" />
          </div>

          {/* Name plate */}
          <div className="mt-8 flex items-center justify-center gap-5 text-center">
            <div className="founder-name">
              <p className="font-serif text-2xl tracking-[0.12em] text-silver">{owners[0].name}</p>
              <p className="mt-1 text-[0.6rem] tracking-[0.4em] text-gold uppercase">{owners[0].role}</p>
            </div>
            <Sparkle className="founder-name h-2.5 w-2.5 text-gold" />
            <div className="founder-name">
              <p className="font-serif text-2xl tracking-[0.12em] text-silver">{owners[1].name}</p>
              <p className="mt-1 text-[0.6rem] tracking-[0.4em] text-gold uppercase">{owners[1].role}</p>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="relative lg:h-[62vh]">
          <div className="absolute top-0 -left-10 hidden h-full w-px bg-[rgba(26,26,24,0.12)] lg:block">
            <div className="rail-fill h-full w-full origin-top scale-y-[0.25] bg-gradient-to-b from-gold-hi to-gold" />
          </div>
          <p className="eyebrow mb-10 lg:absolute lg:-top-14 lg:mb-0">Meet the founders</p>
          {ownerChapters.map((c, i) => (
            <article key={c.kicker} className="chapter mb-16 lg:absolute lg:inset-0 lg:mb-0 lg:flex lg:flex-col lg:justify-center">
              <p className="font-serif text-5xl text-gold/80">{NUMERALS[i]}</p>
              <p className="mt-4 text-[0.66rem] tracking-[0.4em] text-silver/60 uppercase">{c.kicker.split("·")[1]?.trim()}</p>
              <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3.4rem)] text-silver">{c.title}</h2>
              <Ornament className="mt-7 max-w-[200px]" />
              <p className="mt-7 max-w-[480px] text-[1.02rem] leading-[1.9] font-light text-silver/80">{c.body}</p>
              {i === ownerChapters.length - 1 && (
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {values.map((v) => (
                    <div key={v.title} className="border-t border-gold/40 pt-4">
                      <h3 className="font-serif text-sm tracking-[0.08em] text-gold-hi">{v.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-silver/70">{v.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
