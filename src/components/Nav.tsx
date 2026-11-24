"use client";

import { useEffect, useState } from "react";

const left = [
  { href: "#story", label: "Our story" },
  { href: "#services", label: "Services" },
  { href: "#ritual", label: "Ritual" },
];
const right = [
  { href: "#prices", label: "Prices" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];
const links = [...left, ...right];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="group relative text-[0.64rem] font-medium tracking-[0.3em] uppercase text-silver/80 transition-colors duration-500 hover:text-silver">
      {label}
      <span className="absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-silver/70 transition-all duration-500 group-hover:w-full" />
    </a>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={`mx-auto grid h-20 grid-cols-[1fr_auto_1fr] items-center px-5 transition-all duration-700 sm:px-10 ${
          scrolled ? "bg-ink/85 shadow-[0_1px_0_rgba(238,235,230,0.1)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <ul className="hidden items-center gap-10 lg:flex">
          {left.map((l) => (
            <li key={l.href}>
              <NavLink {...l} />
            </li>
          ))}
        </ul>
        <span className="lg:hidden" />

        <a href="#top" aria-label="THE EDIT home" className="justify-self-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-monogram.svg" alt="THE EDIT Unisex Salon" width={44} height={56} className="h-12 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]" />
        </a>

        <div className="flex items-center justify-end gap-10">
          <ul className="hidden items-center gap-10 lg:flex">
            {right.map((l) => (
              <li key={l.href}>
                <NavLink {...l} />
              </li>
            ))}
          </ul>
          <a href="#book" className="btn btn-solid hidden !px-5 !py-2.5 sm:inline-flex">
            Book now
          </a>
          <button
            className="grid h-11 w-11 place-items-center border border-line lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-full bg-gold-hi transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-gold-hi transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 -z-10 flex flex-col items-center justify-center gap-7 bg-ink/95 backdrop-blur-xl transition-all duration-700 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {[...links, { href: "#book", label: "Book now" }].map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-serif text-3xl tracking-[0.12em] text-silver transition-all duration-700 hover:text-gold-hi"
            style={{ transitionDelay: open ? `${i * 60}ms` : "0ms", transform: open ? "none" : "translateY(20px)" }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </header>
  );
}
