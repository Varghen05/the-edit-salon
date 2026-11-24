"use client";

import { useEffect, useRef, useState } from "react";
import { scrollState } from "../motion/scrollState";
import { ArrowUpRight } from "../icons";
import { site, whatsappLink } from "@/lib/site";

const links = [
  { href: "#services", id: "services", label: "Services" },
  { href: "#founders", id: "founders", label: "Founders" },
  { href: "#studio", id: "studio", label: "Studio" },
  { href: "#prices", id: "prices", label: "Prices" },
  { href: "#contact", id: "contact", label: "Visit" },
];

/**
 * Floating glass navigation. It hides as you scroll down and returns as you scroll up, shows
 * a thin reading-progress line, and highlights the section you are in. On phones the menu
 * opens as a full-screen glass sheet with large links, opening hours and quick actions.
 */
export default function FlowNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const bar = useRef<HTMLSpanElement>(null);

  // Hide on scroll down, show on scroll up, and drive the progress line
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 240);
        last = y;
      }
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current)
        bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which section is on screen
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Lock the page behind the open phone menu, and close it with Escape
  useEffect(() => {
    if (!open) return;
    scrollState.lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      scrollState.lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const wa = whatsappLink("Hello THE EDIT, I'd like to book an appointment.");
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-out sm:px-5 sm:pt-4 ${hidden && !open ? "-translate-y-[130%]" : "translate-y-0"}`}
      >
        <nav
          aria-label="Main"
          className={`glass relative mx-auto flex h-[60px] max-w-[1180px] items-center justify-between gap-3 rounded-full pr-1.5 pl-3 transition-colors duration-500 sm:h-[68px] sm:pl-5 ${
            scrolled || open ? "bg-[rgba(27,15,31,0.72)]" : ""
          }`}
        >
          <a
            href="#top"
            aria-label="THE EDIT, back to top"
            onClick={() => setOpen(false)}
            className="flex shrink-0 items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-monogram.svg"
              alt=""
              width={32}
              height={40}
              className="h-8 w-auto sm:h-9"
            />
            <span className="leading-none">
              <span className="block text-[0.74rem] font-medium tracking-[0.34em] text-silver">
                THE EDIT
              </span>
              <span className="mt-1 hidden text-[0.5rem] tracking-[0.4em] text-silver/50 sm:block">
                UNISEX SALON
              </span>
            </span>
          </a>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={l.href}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`relative block rounded-full px-4 py-2.5 text-[0.9rem] transition-colors duration-300 hover:text-silver ${
                    active === l.id
                      ? "bg-white/10 text-silver"
                      : "text-silver/65"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href="#book"
              className="btn btn-solid !px-4 !py-2.5 text-[0.85rem] sm:!px-5"
            >
              Book now <ArrowUpRight className="hidden h-4 w-4 sm:block" />
            </a>
            <button
              className="grid h-11 w-11 place-items-center rounded-full bg-white/8 transition-colors hover:bg-white/14 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-px w-full bg-silver transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-silver transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                />
              </span>
            </button>
          </div>

          {/* reading progress */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 bottom-0 h-px overflow-hidden"
          >
            <span
              ref={bar}
              className="block h-full origin-left scale-x-0 bg-gradient-to-r from-rose via-gold-hi to-gold"
            />
          </span>
        </nav>
      </header>

      {/* phone menu: a full-screen glass sheet */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-[rgba(20,10,24,0.88)] px-6 pt-28 pb-24 backdrop-blur-2xl transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-1 flex-col justify-center gap-1">
          {links.map((l, i) => (
            <li key={l.id} className="overflow-hidden">
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-white/8 py-3.5 font-serif text-[2.4rem] leading-none text-silver transition-all duration-700 ease-out"
                style={{
                  transform: open ? "none" : "translateY(110%)",
                  transitionDelay: open ? `${120 + i * 70}ms` : "0ms",
                }}
              >
                <span className="font-sans text-[0.7rem] tracking-[0.2em] text-rose">
                  0{i + 1}
                </span>
                <span className={active === l.id ? "italic text-rose" : ""}>
                  {l.label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div
          className="mt-6 space-y-5 transition-all duration-700 ease-out"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "none" : "translateY(20px)",
            transitionDelay: open ? "520ms" : "0ms",
          }}
        >
          <div className="text-sm leading-relaxed text-silver/65">
            <p className="text-silver">
              Providence Square, Pukkattupady, Kochi
            </p>
            <p>
              {site.hours[0].days} · {site.hours[0].time}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="#book"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="btn btn-solid flex-1"
            >
              Book now
            </a>
            <a
              href={maps}
              tabIndex={open ? 0 : -1}
              target="_blank"
              rel="noreferrer"
              className="btn flex-1"
            >
              Directions
            </a>
            {wa && (
              <a
                href={wa}
                tabIndex={open ? 0 : -1}
                target="_blank"
                rel="noreferrer"
                className="btn flex-1"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
