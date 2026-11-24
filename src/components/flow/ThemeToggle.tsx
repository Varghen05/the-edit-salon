"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "../icons";

const subscribe = (cb: () => void) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};
const isDay = () => document.documentElement.dataset.theme === "day";

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

/**
 * Day / night switch. The new theme grows out from the button as a circle (where the browser
 * supports view transitions) and the choice is remembered. Without a saved choice, the site
 * opens in day mode between 6am and 6pm and in night mode otherwise.
 */
export default function ThemeToggle() {
  const day = useSyncExternalStore(subscribe, isDay, () => false);

  const toggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = day ? "night" : "day";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theedit-theme", next);
      } catch {}
      window.dispatchEvent(new Event("themechange"));
    };

    const doc = document as ViewTransitionDoc;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      document.documentElement.classList.add("theme-fade");
      apply();
      setTimeout(() => document.documentElement.classList.remove("theme-fade"), 700);
      return;
    }

    const box = e.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = doc.startViewTransition(apply);
    await t.ready;
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  };

  return (
    <button
      onClick={toggle}
      aria-label={day ? "Switch to night mode" : "Switch to day mode"}
      title={day ? "Night mode" : "Day mode"}
      className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-silver/8 transition-colors hover:bg-silver/14"
    >
      <Sun className={`absolute h-[18px] w-[18px] text-rose transition-all duration-500 ${day ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`} strokeWidth={1.6} />
      <Moon className={`absolute h-[18px] w-[18px] text-rose transition-all duration-500 ${day ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"}`} strokeWidth={1.6} />
    </button>
  );
}
