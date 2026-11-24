"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { INTRO_EVENT } from "../Preloader";
import { Sparkle } from "../icons";
import { site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const POSTER = "/images/editorial/ritual-mirrors.jpg"; // shown until the video plays

function useCountdown(target: string) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return { done: left === 0, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60) };
}

/**
 * The opening scene, laid out like a magazine cover: the original logo is traced in light
 * and filled with its metal beside an editorial headline, while the salon plays inside an
 * arched mirror on the right. Scrolling drifts the arch and lifts the words away.
 */
export default function Hero({ logoSvg, video, videoMobile }: { logoSvg: string; video: string | null; videoMobile: string | null }) {
  const root = useRef<HTMLElement>(null);
  const cd = useCountdown(site.grandOpening);

  useGSAP(
    (_ctx, contextSafe) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const paths = gsap.utils.toArray<SVGPathElement>(".hero-logo path");

      if (!reduce) {
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0, stroke: "#d9bf8c", strokeWidth: 2 });
        });
        gsap.set(".hero-in", { opacity: 0, y: 24 });
        gsap.set(".hero-arch", { clipPath: "inset(100% 0 0 0)" });
        gsap.set(".hero-bg", { scale: 1.18 });
        gsap.set(".hero-rule", { scaleX: 0 });
      }

      let played = false;
      const play = contextSafe!(() => {
        if (played || reduce) return;
        played = true;
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(".hero-arch", { clipPath: "inset(0% 0 0 0)", duration: 1.8, ease: "expo.inOut" }, 0)
          .to(".hero-bg", { scale: 1, duration: 3, ease: "power2.out" }, 0.2)
          .to(paths, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", stagger: 0.012 }, 0.3)
          .to(paths, { fillOpacity: 1, duration: 1.1, stagger: 0.006 }, 1.8)
          .to(paths, { strokeWidth: 0, duration: 0.8 }, 2.3)
          .to(".hero-rule", { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 1)
          .to(".hero-in", { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 1.4);
      });

      const w = window as unknown as { __introStarted?: boolean };
      if (w.__introStarted) play();
      window.addEventListener(INTRO_EVENT + ":early", play);
      window.addEventListener(INTRO_EVENT, play);
      const unlisten = () => {
        window.removeEventListener(INTRO_EVENT + ":early", play);
        window.removeEventListener(INTRO_EVENT, play);
      };
      if (reduce) return unlisten;

      // Scroll: words lift away, the arch drifts slower than the page
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } })
        .fromTo(".hero-copy", { yPercent: 0, opacity: 1 }, { yPercent: -18, opacity: 0, ease: "none", immediateRender: false }, 0)
        .fromTo(".hero-arch-wrap", { yPercent: 0 }, { yPercent: 12, ease: "none", immediateRender: false }, 0)
        .fromTo(".hero-bg", { yPercent: 0 }, { yPercent: -8, ease: "none", immediateRender: false }, 0);

      return unlisten;
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative overflow-hidden bg-ink lg:h-[100svh] lg:min-h-[720px]">
      <h1 className="sr-only">THE EDIT Unisex Salon, Pukkattupady, Kochi</h1>

      <div className="wrap grid h-full items-center gap-14 pt-28 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pt-20 lg:pb-0">
        {/* Words */}
        <div className="hero-copy order-2 lg:order-1">
          <div className="relative h-[104px] sm:h-[160px]" style={{ aspectRatio: "1092 / 1202" }}>
            <div className="hero-logo h-full w-full" dangerouslySetInnerHTML={{ __html: logoSvg }} />
          </div>

          <p className="hero-in eyebrow mt-10">Unisex salon · Pukkattupady</p>
          <p className="hero-in display mt-6 max-w-[620px] text-[clamp(2.6rem,5.2vw,4.9rem)] text-silver">
            A thoughtful edit of <em>style, care &amp; confidence.</em>
          </p>

          <span className="hero-rule mt-9 block h-px w-full max-w-[520px] origin-left bg-line" />
          <p className="hero-in mt-6 text-[0.68rem] font-medium tracking-[0.5em] text-silver/80">{site.tagline}</p>

          <div className="hero-in mt-10 flex flex-wrap gap-3">
            <a href="#book" className="btn btn-solid">
              Book an appointment
            </a>
            <a href="#services" className="btn">
              View services
            </a>
          </div>
        </div>

        {/* The salon inside an arched mirror */}
        <div className="hero-arch-wrap relative order-1 mx-auto w-[min(72vw,300px)] sm:w-full sm:max-w-[420px] lg:order-2 lg:max-w-none">
          <div className="hero-arch relative aspect-[4/5] overflow-hidden rounded-t-full lg:aspect-auto lg:h-[74vh] lg:max-h-[720px]">
            <div className="hero-bg absolute inset-0">
              {video ? (
                <video className="h-full w-full object-cover object-[55%_30%]" autoPlay muted loop playsInline poster={POSTER} aria-hidden>
                  {videoMobile && <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />}
                  <source src={video} type="video/mp4" />
                </video>
              ) : (
                <Image src={POSTER} alt="" fill priority sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
          {/* hairline rim, offset like a mirror frame */}
          <div aria-hidden className="pointer-events-none absolute -inset-3 rounded-t-full border border-gold/35 border-b-0" />
          <Sparkle className="absolute -top-6 left-1/2 h-3 w-3 -translate-x-1/2 text-gold" />

          {cd && !cd.done && (
            <div className="hero-in absolute -bottom-6 left-1/2 -translate-x-1/2 border border-line bg-ink px-6 py-3 text-center whitespace-nowrap lg:left-auto lg:-left-10 lg:translate-x-0">
              <p className="text-[0.58rem] tracking-[0.35em] text-muted uppercase">Grand opening</p>
              <p className="mt-1 font-serif text-xl text-silver tabular-nums">
                {cd.d}d · {cd.h}h · {cd.m}m
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="hero-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex" aria-hidden>
        <span className="text-[0.58rem] tracking-[0.4em] text-silver/50 uppercase">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-silver/60 to-transparent" />
      </div>
    </section>
  );
}
