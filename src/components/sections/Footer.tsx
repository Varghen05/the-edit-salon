import { site, fullAddress } from "@/lib/site";
import { ArrowUpRight } from "../icons";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-ink/80 pt-16 pb-10 backdrop-blur-sm">
      <div className="wrap">
        <div className="grid gap-10 text-sm text-silver/70 md:grid-cols-3">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="THE EDIT Unisex Salon" width={120} height={132} className="h-32 w-auto" />
            <p className="mt-5 text-[0.68rem] tracking-[0.35em] text-gold-hi">{site.tagline}</p>
          </div>
          <div>
            <p className="label">Visit</p>
            <p className="mt-3 leading-relaxed">{fullAddress}</p>
          </div>
          <div>
            <p className="label">Explore</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {[
                ["Our story", "#story"],
                ["Services", "#services"],
                ["Prices", "#prices"],
                ["Gallery", "#gallery"],
                ["Reviews", "#reviews"],
                ["Contact", "#contact"],
              ].map(([l, h]) => (
                <li key={h}>
                  <a href={h} className="transition-colors hover:text-gold-hi">
                    {l}
                  </a>
                </li>
              ))}
              {site.instagram && (
                <li>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold-hi">
                    Instagram <ArrowUpRight className="inline h-3.5 w-3.5" strokeWidth={1.25} />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 text-[0.68rem] tracking-[0.15em] text-silver/55 sm:flex-row">
          <p>© 2026 THE EDIT · Unisex Salon · Pukkattupady, Kochi</p>
          <p>Founded by Rekha &amp; Saranya</p>
        </div>
      </div>
    </footer>
  );
}
