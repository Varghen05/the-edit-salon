import Ribbon from "../three/Ribbon";
import Logo3D from "../three/Logo3D";
import { site, fullAddress, whatsappLink } from "@/lib/site";

const links = [
  { href: "#services", label: "Services" },
  { href: "#founders", label: "Founders" },
  { href: "#studio", label: "Studio" },
  { href: "#prices", label: "Prices" },
  { href: "#book", label: "Book" },
  { href: "#faq", label: "FAQ" },
];

/** The closing scene: silk flowing behind a last invitation, with the footer inside it. */
export default function CtaFooter({ logoSvg }: { logoSvg: string }) {
  const wa = whatsappLink("Hello THE EDIT, I'd like to book an appointment.");

  return (
    <footer className="relative z-10 overflow-hidden bg-ink pt-24">
      <Ribbon className="absolute inset-0 opacity-55" count={2} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink via-ink/80 to-transparent" />

      <div className="wrap relative text-center">
        <div className="glass grid gap-10 rounded-[36px] p-8 text-left md:grid-cols-[1.2fr_1fr_0.8fr] md:p-12">
          <div>
            <div className="relative h-[190px] w-[min(100%,300px)]">
              <Logo3D className="absolute inset-0" fallbackSvg={logoSvg} />
            </div>
            <p className="mt-4 text-[0.66rem] tracking-[0.45em] text-rose">{site.tagline}</p>
          </div>
          <div>
            <p className="label">Visit</p>
            <p className="mt-3 leading-relaxed text-silver/75">{fullAddress}</p>
            {site.hours.map((h) => (
              <p key={h.days} className="mt-3 text-silver/75">
                {h.days} · {h.time}
              </p>
            ))}
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="mt-3 inline-block text-gold-hi">
                WhatsApp us
              </a>
            )}
          </div>
          <div>
            <p className="label">Explore</p>
            <ul className="mt-3 grid grid-cols-2 gap-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-silver/75 transition-colors hover:text-silver">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-8 text-xs text-silver/40 md:flex-row">
          <p>© 2026 THE EDIT Unisex Salon · Pukkattupady, Kochi</p>
          <p>Photography: Unsplash (free licence)</p>
        </div>
      </div>
    </footer>
  );
}
