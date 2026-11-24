// One icon language across the site: Lucide's thin-line icons at a light stroke,
// plus the four-point star that appears in the logo's ornament.
import type { SVGProps } from "react";

export { ArrowRight, ArrowUpRight, Clock, MapPin, Navigation, Phone, Plus, Search, Star } from "lucide-react";

/** The four-point star from the logo ornament, for dividers and list markers. */
export function Sparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" />
    </svg>
  );
}

/** Thin rule, star, thin rule: the divider used on the invitation and the logo. */
export function Ornament({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 text-gold ${className ?? ""}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
      <Sparkle className="h-2.5 w-2.5" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
    </span>
  );
}
