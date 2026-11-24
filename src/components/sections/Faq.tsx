import SplitReveal from "../motion/SplitReveal";
import { faqs } from "@/lib/site";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Faq() {
  return (
    <section id="faq" className="light relative z-10 py-24 md:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="eyebrow">Good to know</p>
          <SplitReveal text="Questions, answered." className="display mt-6 text-[clamp(2.4rem,5vw,4.2rem)] text-silver" />
        </div>
        <div className="border-t border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 font-serif text-2xl text-silver transition-colors hover:text-gold-hi [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="relative h-4 w-4 shrink-0">
                  <span className="absolute top-1/2 left-0 h-px w-full bg-gold" />
                  <span className="absolute top-1/2 left-0 h-px w-full rotate-90 bg-gold transition-transform duration-500 group-open:rotate-0" />
                </span>
              </summary>
              <p className="max-w-[560px] pb-7 leading-relaxed font-light text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
