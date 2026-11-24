"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#founders", label: "Founders" },
  { href: "#studio", label: "Studio" },
  { href: "#prices", label: "Prices" },
  { href: "#contact", label: "Visit" },
];

/** A floating liquid-glass pill: monogram, links, and the booking action. */
export default function FlowNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        className={`glass mx-auto flex h-16 max-w-[1080px] items-center justify-between rounded-full pr-2 pl-4 transition-all duration-700 ${
          scrolled ? "bg-[rgba(27,15,31,0.55)]" : ""
        }`}
      >
        <a href="#top" aria-label="THE EDIT home" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-monogram.svg" alt="THE EDIT Unisex Salon" width={30} height={38} className="h-9 w-auto" />
          <span className="hidden text-[0.68rem] font-medium tracking-[0.32em] text-silver/80 sm:inline">THE EDIT</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-4 py-2 text-[0.9rem] text-silver/75 transition-colors duration-300 hover:bg-white/8 hover:text-silver">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#book" className="btn btn-solid !px-5 !py-2.5 text-sm">
            Book now
          </a>
          <button
            className="grid h-11 w-11 place-items-center rounded-full bg-white/6 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-full bg-silver transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-silver transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`glass mx-auto mt-3 max-w-[1080px] overflow-hidden rounded-[28px] bg-[rgba(27,15,31,0.8)] transition-all duration-500 lg:hidden ${
          open ? "max-h-[420px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-4">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block px-4 py-3 font-serif text-3xl text-silver">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
