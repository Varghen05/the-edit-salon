"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ribbon from "../three/Ribbon";
import Logo3D from "../three/Logo3D";
import OpeningCountdown from "./OpeningCountdown";
import { ArrowUpRight } from "../icons";
import { site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Full-screen opener. The original logo is shown plainly, in its own silver and gold, at a
 * confident size. Behind it, 3D iridescent silk and drifting gold dust flow around the
 * content (shaded only where the words sit). The camera drifts with the pointer and flies
 * forward through the silk as you scroll; logo and headline sit at different depths.
 */
export default function FlowHero({ logoSvg }: { logoSvg: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".fh-silk", { opacity: 0, duration: 2.4 }, 0)
          .from(".fh-logo-wrap", { opacity: 0, y: 18, duration: 1.4 }, 0.15)
          .from(".fh-word", { yPercent: 100, duration: 1.1, stagger: 0.07 }, 0.7)
          .from(".fh-in", { opacity: 0, y: 16, duration: 1, stagger: 0.08 }, 1.2)
          ;

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } })
          .to(".fh-copy", { yPercent: -14, opacity: 0, ease: "none" }, 0)
          .to(".fh-logo-wrap", { scale: 0.92, ease: "none" }, 0);
      });
      // Depth: logo, headline and silk move by different amounts with the pointer
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const lx = gsap.quickTo(".fh-logo-wrap", "x", { duration: 1.4, ease: "power3" });
        const ly = gsap.quickTo(".fh-logo-wrap", "y", { duration: 1.4, ease: "power3" });
        const hx = gsap.quickTo(".fh-head", "x", { duration: 1.6, ease: "power3" });
        const hy = gsap.quickTo(".fh-head", "y", { duration: 1.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          lx(nx * -16);
          ly(ny * -10);
          hx(nx * -7);
          hy(ny * -4);
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
      // Touch screens have no pointer, so the same depth layers drift gently on their own
      mm.add("(pointer: coarse) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(".fh-logo-wrap", { x: 9, y: -6, duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(".fh-head", { x: -5, y: 3, duration: 5.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const lines = [["Style,", "care", "&"], ["confidence,"], ["beautifully", "edited."]];

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      <h1 className="sr-only">THE EDIT Unisex Salon, Pukkattupady, Kochi</h1>

      {/* dimmed silk, shaded out around the content so nothing competes with it */}
      <div className="blob top-[-10%] left-[-10%] h-[55vw] w-[55vw] bg-[var(--blob-a)]" />
      <div className="blob right-[-12%] bottom-[-18%] h-[48vw] w-[48vw] bg-[var(--blob-b)] [animation-delay:-6s]" />
      <Ribbon className="fh-silk absolute inset-0" count={3} lift={-2.2} dust />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_52%_46%_at_50%_44%,rgb(var(--scrim)/0.82),rgb(var(--scrim)/0.45)_60%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="fh-copy relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-32 pb-12 text-center md:pt-36 md:pb-8">
        <div className="fh-logo-wrap relative h-[clamp(210px,33svh,330px)] w-[min(90vw,560px)] shrink-0">
          <Logo3D className="absolute inset-0" fallbackSvg={logoSvg} />
        </div>

        <p className="fh-head display mt-8 text-[clamp(2.1rem,3.9vw,3.8rem)] text-silver">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.1em]">
              {line.map((w) => (
                <span key={w} className="fh-word mr-[0.24em] inline-block last:mr-0">
                  {i === 1 ? <em>{w}</em> : w}
                </span>
              ))}
            </span>
          ))}
        </p>

        <p className="fh-in mt-8 text-[0.7rem] font-medium tracking-[0.5em] text-silver/70">{site.tagline}</p>

        <div className="fh-in mt-9 flex flex-wrap justify-center gap-3">
          <a href="#book" className="btn btn-solid">
            Book an appointment <ArrowUpRight className="h-4 w-4" />
          </a>
          <a href="#services" className="btn">
            Explore services
          </a>
        </div>

        <div className="fh-in mt-10 md:hidden">
          <OpeningCountdown target={site.grandOpening} compact />
        </div>
      </div>

      {/* info strip with the live opening countdown */}
      <div className="fh-in relative z-10 mx-4 mt-2 mb-5 hidden w-[calc(100%-2rem)] max-w-[1080px] items-center justify-between self-center rounded-[30px] py-3 pr-20 pl-8 text-sm text-silver/75 glass md:flex">
        <div className="space-y-1.5">
          <p className="text-silver">Providence Square · Pukkattupady, Kochi</p>
          <p>Unisex · Hair · Skin · Beauty · Nails · Grooming</p>
        </div>
        <OpeningCountdown target={site.grandOpening} />
      </div>
    </section>
  );
}
