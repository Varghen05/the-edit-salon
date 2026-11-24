"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ownerChapters, owners, values } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Words wrapped so each one can rise out of its own mask (the `fd-w` spans are animated). */
function Words({ words }: { words: [string, boolean?][] }) {
  return (
    <>
      {words.map(([w, em], i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
          <span className={`fd-w inline-block ${em ? "text-rose italic" : ""}`}>{w}</span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
const plain = (t: string): [string][] => t.split(" ").map((w) => [w]);

// Gold specks that float around the portrait
const specks = [
  "top-[6%] -left-4 h-2 w-2",
  "top-[22%] -right-5 h-1.5 w-1.5",
  "top-[48%] -left-7 h-1.5 w-1.5",
  "top-[66%] -right-8 h-2.5 w-2.5",
  "bottom-[10%] -left-5 h-2 w-2",
  "-top-4 left-[38%] h-1.5 w-1.5",
  "-bottom-5 right-[30%] h-2 w-2",
];

/**
 * Meet the founders on blush pearl. The portrait sits in a glass card that tilts in 3D, with a
 * slow zoom, a passing shine, floating gold specks and a turning name badge. The story is a
 * timeline: a rose-gold line fills as you scroll, the chapter in view lights up while the
 * others dim, and each chapter draws its rule and lifts its words into place.
 */
export default function Founders() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ---- portrait
        gsap.from(".fd-card", { rotateY: -22, rotateX: 6, opacity: 0, y: 50, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
        gsap.fromTo(".fd-photo", { scale: 1 }, { scale: 1.09, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.fromTo(".fd-shine", { xPercent: -50 }, { xPercent: 450, duration: 1.8, ease: "power2.inOut", repeat: -1, repeatDelay: 4.5, delay: 2 });
        gsap.to(".fd-tag", { y: -7, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.from(".fd-badge", { scale: 0, rotate: -120, opacity: 0, duration: 1.4, ease: "back.out(1.6)", delay: 0.4, scrollTrigger: { trigger: root.current, start: "top 70%" } });
        gsap.utils.toArray<HTMLElement>(".fd-speck").forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0 }, { opacity: 0.9, duration: 1, delay: 0.6 + i * 0.15, scrollTrigger: { trigger: root.current, start: "top 70%" } });
          gsap.to(el, { y: gsap.utils.random(-30, -16), x: gsap.utils.random(-10, 10), duration: gsap.utils.random(3, 5), ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 });
        });

        // ---- headline: words rise out of their masks
        gsap.from(".fd-head .fd-w", { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".fd-head", start: "top 85%" } });

        // ---- timeline: the line fills with scroll and a glowing dot rides its tip
        const dot = root.current!.querySelector<HTMLElement>(".fd-dot")!;
        gsap.to(".fd-rail-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".fd-chapters",
            start: "top 65%",
            end: "bottom 55%",
            scrub: true,
            onUpdate: (self) => {
              dot.style.top = `${self.progress * 100}%`;
            },
          },
        });

        // ---- each chapter: rule draws, number and words rise, body fades up; the one in view lights up
        const chapters = gsap.utils.toArray<HTMLElement>(".fd-chapter");
        gsap.set(chapters, { opacity: 0.38 });
        chapters.forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%" } });
          tl.from(el.querySelector(".fd-line"), { scaleX: 0, duration: 1.1, ease: "expo.out" })
            .from(el.querySelector(".fd-num"), { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.1)
            .from(el.querySelectorAll(".fd-w"), { yPercent: 115, duration: 0.9, ease: "expo.out", stagger: 0.05 }, 0.2)
            .from(el.querySelector(".fd-body"), { y: 20, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.55);
          ScrollTrigger.create({
            trigger: el,
            start: "top 62%",
            end: "bottom 42%",
            onToggle: (self) => {
              gsap.to(el, { opacity: self.isActive ? 1 : 0.38, duration: 0.5, ease: "power2.out" });
              gsap.to(el.querySelector(".fd-num"), { scale: self.isActive ? 1.18 : 1, transformOrigin: "left center", duration: 0.5, ease: "back.out(2)" });
            },
          });
        });

        // ---- value cards flip up in a stagger
        gsap.from(".fd-value", {
          rotateX: 45,
          y: 50,
          opacity: 0,
          transformPerspective: 800,
          transformOrigin: "50% 100%",
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.14,
          scrollTrigger: { trigger: ".fd-values", start: "top 88%" },
        });
      });

      // Touch screens have no pointer to follow, so the card sways gently on its own
      mm.add("(pointer: coarse) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(".fd-card", { rotateY: 9, rotateX: -4, duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 });
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
        <div className="relative lg:sticky lg:top-28" style={{ perspective: "1200px" }}>
          {/* floating gold specks */}
          <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-[420px]">
            {specks.map((c) => (
              <span key={c} className={`fd-speck absolute rounded-full bg-gold opacity-0 shadow-[0_0_10px_2px_rgba(217,162,126,0.6)] ${c}`} />
            ))}
          </div>

          <div ref={card} className="fd-card glass relative mx-auto max-w-[420px] rounded-[36px] p-3" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#f3c6c9,#d9a27e_55%,#5a2a52)]">
              <div className="fd-photo absolute inset-0">
                <Image src="/images/owners.png" alt="Rekha and Saranya, founders of THE EDIT" fill sizes="(max-width: 1024px) 90vw, 420px" className="object-contain object-bottom" />
              </div>
              <span aria-hidden className="fd-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>

            {/* a name badge that turns slowly */}
            <div className="fd-badge glass absolute -top-6 -left-5 grid h-[100px] w-[100px] place-items-center rounded-full sm:-left-8 sm:h-[116px] sm:w-[116px]" style={{ transform: "translateZ(80px)" }}>
              <svg viewBox="0 0 120 120" className="absolute inset-1 animate-[spin_24s_linear_infinite] text-gold" aria-hidden>
                <defs>
                  <path id="fd-circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text fill="currentColor" fontSize="9.4" letterSpacing="2.4" fontWeight="500">
                  <textPath href="#fd-circ">REKHA · SARANYA · CO-FOUNDERS · </textPath>
                </text>
              </svg>
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" aria-hidden>
                <path fill="currentColor" d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z" />
              </svg>
            </div>

            <div className="fd-tag glass absolute -right-6 -bottom-6 rounded-3xl px-6 py-4 text-left" style={{ transform: "translateZ(60px)" }}>
              <p className="font-serif text-2xl">
                {owners[0].name} &amp; {owners[1].name}
              </p>
              <p className="mt-1 text-[0.66rem] tracking-[0.3em] text-muted uppercase">Co-founders</p>
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Meet the founders</p>
          <h2 className="fd-head display mt-5 text-[clamp(2.6rem,5vw,4.8rem)]">
            <Words words={[["Two"], ["friends,"], ["one", true], ["chair", true], ["at"], ["a"], ["time."]]} />
          </h2>

          <div className="fd-chapters relative mt-14 space-y-12 pl-7 sm:pl-9">
            {/* timeline rail */}
            <span aria-hidden className="absolute top-0 left-0 h-full w-px bg-line">
              <span className="fd-rail-fill block h-full origin-top scale-y-0 bg-gradient-to-b from-rose via-gold-hi to-gold" />
            </span>
            <span aria-hidden className="fd-dot absolute -left-[5px] top-0 h-[11px] w-[11px] rounded-full bg-gold shadow-[0_0_14px_4px_rgba(217,162,126,0.65)]" />

            {ownerChapters.map((c, i) => (
              <article key={c.kicker} className="fd-chapter grid grid-cols-[56px_1fr] gap-5">
                <span className="fd-num font-serif text-3xl text-gold">0{i + 1}</span>
                <div>
                  <span className="fd-line mb-4 block h-px w-full origin-left bg-line" />
                  <h3 className="font-serif text-3xl leading-tight">
                    <Words words={plain(c.title)} />
                  </h3>
                  <p className="fd-body mt-3 max-w-[520px] leading-relaxed text-muted">{c.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="fd-values mt-14 grid gap-4 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="fd-value glass rounded-3xl p-5 transition-transform duration-500 hover:-translate-y-1.5">
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
