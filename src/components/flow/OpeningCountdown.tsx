"use client";

import { useEffect, useState } from "react";

function useTimeLeft(target: string) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

/** One digit that rolls down into place whenever its value changes. */
function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden text-center align-top leading-none">
      <span key={value} className="absolute inset-0 animate-[digit-in_0.55s_cubic-bezier(0.2,0.9,0.2,1)_both]">
        {value}
      </span>
    </span>
  );
}

function Unit({ value, label, compact }: { value: number; label: string; compact?: boolean }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className={`glass flex flex-col items-center rounded-2xl ${compact ? "min-w-[58px] px-2 py-2" : "min-w-[66px] px-3 py-2"}`}>
      <span className={`font-serif tabular-nums text-silver ${compact ? "text-[1.7rem]" : "text-[1.9rem]"}`}>
        {text.split("").map((c, i) => (
          <Digit key={i} value={c} />
        ))}
      </span>
      <span className="mt-1 text-[0.55rem] font-medium tracking-[0.25em] text-rose uppercase">{label}</span>
    </div>
  );
}

/**
 * Live countdown to the grand opening: days, hours, minutes and seconds in glass tiles,
 * each digit rolling in as it changes. Once the time arrives it says the salon is open.
 */
export default function OpeningCountdown({ target, compact }: { target: string; compact?: boolean }) {
  const left = useTimeLeft(target);
  if (left === null) return null;

  if (left === 0) {
    return (
      <p className="flex items-center gap-2 text-silver">
        <span className="h-2 w-2 animate-pulse rounded-full bg-rose" /> Now open · Book your visit
      </p>
    );
  }

  const s = Math.floor(left / 1000);
  const units = [
    { v: Math.floor(s / 86400), l: "Days" },
    { v: Math.floor((s % 86400) / 3600), l: "Hours" },
    { v: Math.floor((s % 3600) / 60), l: "Mins" },
    { v: s % 60, l: "Secs" },
  ];

  return (
    <div className={`flex items-center ${compact ? "flex-col gap-3" : "gap-4"}`}>
      <div className={compact ? "text-center" : "text-right"}>
        <p className="text-[0.6rem] font-medium tracking-[0.32em] text-rose uppercase">Grand opening</p>
        <p className="mt-0.5 font-serif text-lg text-silver">Sat, 12 December</p>
      </div>
      <div className="flex gap-2" role="timer" aria-label={`${units[0].v} days, ${units[1].v} hours and ${units[2].v} minutes until the grand opening`}>
        {units.map((u) => (
          <Unit key={u.l} value={u.v} label={u.l} compact={compact} />
        ))}
      </div>
    </div>
  );
}
