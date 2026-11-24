"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitReveal from "../motion/SplitReveal";
import { MapPin, Search } from "../icons";
import { site, fullAddress, whatsappLink } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Location reveal: a radar sweeps the dark, the pin drops, then the live Google map
 * opens outward from the pin as an expanding circle while the address card slides in.
 */
export default function MapReveal() {
  const root = useRef<HTMLElement>(null);
  const QUERY = "best unisex salon near Pukkattupady";
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapsQuery)}`;
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&z=16&output=embed`;
  const wa = whatsappLink("Hello THE EDIT ✦");

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".map-window", { clipPath: "circle(150% at 50% 50%)" });
        gsap.set(".radar-layer, .search-card", { autoAlpha: 0 });
        return;
      }
      gsap.to(".sweep", { rotate: 360, duration: 4, ease: "none", repeat: -1 });

      // 1. A search is typed  2. THE EDIT is the top result  3. the map opens on it
      const typed = root.current!.querySelector<HTMLElement>(".search-typed")!;
      const typing = { n: 0 };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".map-stage", start: "top 80%", end: "bottom 70%", scrub: 1 },
      });
      tl.from(".search-card", { y: 30, opacity: 0, duration: 0.15 })
        .to(typing, { n: QUERY.length, duration: 0.4, ease: "none", onUpdate: () => (typed.textContent = QUERY.slice(0, Math.round(typing.n))) }, 0.1)
        .from(".search-row", { opacity: 0, y: 12, duration: 0.15, stagger: 0.06 }, 0.5)
        .to(".search-row-hit", { backgroundColor: "rgba(184,151,90,0.18)", duration: 0.1 }, 0.72)
        .to(".search-card", { scale: 0.92, opacity: 0, duration: 0.15 }, 0.85)
        .from(".pin", { y: -160, opacity: 0, duration: 0.3, ease: "bounce.out" }, 0.95)
        .from(".landmark", { opacity: 0, scale: 0.6, duration: 0.2 }, 1.2)
        .fromTo(".map-window", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.6, ease: "power2.inOut" }, 1.4)
        .to(".radar-layer", { autoAlpha: 0, duration: 0.25 }, 1.65)
        .from(".addr-card", { x: -60, opacity: 0, duration: 0.35 }, 1.55);
    },
    { scope: root },
  );

  const actions = [
    { label: "Get directions", href: directions },
    site.phone && { label: "Call", href: `tel:${site.phone.replace(/\s/g, "")}` },
    wa && { label: "WhatsApp", href: wa },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section ref={root} id="contact" className="light relative z-10 py-28 md:py-36">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Find us</p>
            <SplitReveal text="Your next favourite place." className="display mt-6 max-w-[720px] text-[clamp(2.6rem,5.6vw,4.8rem)] text-silver" />
          </div>
          <p className="max-w-[340px] font-light text-silver/75">First floor of Providence Square, opposite Bank of Maharashtra, Pukkattupady.</p>
        </div>

        <div className="relative mt-14">
        <div className="map-stage dark relative h-[62vh] min-h-[420px] overflow-hidden sm:h-[78vh] sm:min-h-[520px] rounded-[28px] border border-gold/30 bg-[#050504]">
          {/* Radar layer shown before the map opens */}
          <div className="radar-layer absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(214,173,101,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(214,173,101,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
            {[1, 2, 3, 4].map((r) => (
              <span
                key={r}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25"
                style={{ width: `${r * 22}vmin`, height: `${r * 22}vmin` }}
              />
            ))}
            <div className="sweep absolute top-1/2 left-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgba(240,213,156,0.35),transparent_22%)]" />
          </div>

          {/* Search card: the query types itself and THE EDIT comes up first */}
          <div className="search-card absolute top-[14%] left-1/2 z-20 w-[min(92%,520px)] -translate-x-1/2 overflow-hidden rounded-2xl bg-[#fbf7f1] text-[#2a1e17] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 border-b border-black/10 px-5 py-4">
              <Search className="h-4 w-4 text-[#946d2e]" strokeWidth={1.6} />
              <span className="text-sm">
                <span className="search-typed" />
                <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-[#2a1e17]" />
              </span>
            </div>
            <ul className="py-2 text-left text-sm">
              <li className="search-row search-row-hit flex items-start gap-3 px-5 py-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#946d2e]" strokeWidth={1.6} />
                <span>
                  <span className="block font-medium">THE EDIT Unisex Salon</span>
                  <span className="block text-xs text-black/55">1st Floor, Providence Square · opp. Bank of Maharashtra</span>
                </span>
              </li>
              <li className="search-row flex items-center gap-3 px-5 py-3 text-black/50">
                <Search className="h-4 w-4 shrink-0" strokeWidth={1.4} />
                hair and beauty salon Pukkattupady
              </li>
              <li className="search-row flex items-center gap-3 px-5 py-3 text-black/50">
                <Search className="h-4 w-4 shrink-0" strokeWidth={1.4} />
                unisex salon Kochi
              </li>
            </ul>
          </div>

          {/* Live map, opened through an expanding circle */}
          <div className="map-window absolute inset-0" style={{ clipPath: "circle(0% at 50% 50%)" }}>
            <iframe
              title="Map to THE EDIT Unisex Salon"
              src={embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.4)_sepia(0.35)_brightness(0.95)]"
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_#000]" />
          </div>

          {/* Pin with pulse rings, sitting where the embed centres the address */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-full">
            <div className="pin relative flex flex-col items-center">
              <span className="absolute top-[46px] left-1/2 h-3 w-3 -translate-x-1/2 animate-ping rounded-full bg-gold/70" />
              <span className="absolute top-[40px] left-1/2 h-6 w-6 -translate-x-1/2 animate-ping rounded-full border border-gold/60 [animation-duration:2s]" />
              <svg viewBox="0 0 40 52" className="h-12 w-10 drop-shadow-[0_6px_14px_#000]" aria-hidden>
                <path d="M20 0C9 0 0 9 0 20c0 15 20 32 20 32s20-17 20-32C40 9 31 0 20 0z" fill="url(#pinGold)" />
                <circle cx="20" cy="19" r="7" fill="#0e0e0d" />
                <defs>
                  <linearGradient id="pinGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FFE39C" />
                    <stop offset=".5" stopColor="#D98C12" />
                    <stop offset="1" stopColor="#F3BE52" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span className="landmark absolute top-[calc(50%+18px)] left-1/2 z-10 -translate-x-1/2 rounded-full border border-gold/50 bg-black/80 px-4 py-1.5 text-[0.62rem] tracking-[0.25em] whitespace-nowrap text-gold-hi uppercase backdrop-blur">
            THE EDIT · 1st floor
          </span>

        </div>

          {/* Address card: below the map on phones, floating over it on larger screens */}
          <div className="addr-card dark relative z-10 mt-4 w-full rounded-2xl border border-gold/30 bg-black/80 p-6 backdrop-blur-xl sm:absolute sm:bottom-8 sm:left-8 sm:mt-0 sm:max-w-[380px]">
            <p className="label">Visit</p>
            <address className="mt-2 font-serif text-xl leading-snug text-silver not-italic">{fullAddress}</address>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="label">Hours</p>
              {site.hours.map((h) => (
                <p key={h.days} className="mt-1 flex justify-between text-sm text-silver/85">
                  <span>{h.days}</span>
                  <span className="text-gold-hi">{h.time}</span>
                </p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {actions.map((a, i) => (
                <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className={`btn !px-4 !py-2.5 ${i === 0 ? "btn-solid" : ""}`}>
                  {a.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
