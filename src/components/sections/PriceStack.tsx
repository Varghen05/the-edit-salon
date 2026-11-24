"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitReveal from "../motion/SplitReveal";
import { priceMenu } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Price menu as a deck of cards that stack on top of each other while scrolling. */
export default function PriceStack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".price-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        // Each card sinks back as the next one slides over it
        gsap.to(card.querySelector(".card-inner"), {
          scale: 0.9,
          filter: "brightness(0.45)",
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 15%", scrub: true },
        });
      });
      cards.forEach((card) => {
        gsap.from(card.querySelectorAll(".p-row"), {
          opacity: 0,
          x: 30,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 60%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="prices" className="light relative z-10 pt-24 pb-32">
      <div className="wrap">
        <div className="mb-16 text-center">
          <p className="eyebrow justify-center">Price menu</p>
          <SplitReveal text="Good care. Clear choices." className="display mt-6 text-[clamp(2.6rem,5.6vw,4.8rem)] text-silver" />
          <p className="mx-auto mt-5 max-w-[460px] font-light text-silver/75">
            Starting prices. Final cost depends on hair length, products and the look you&rsquo;re after. We always confirm before
            we begin.
          </p>
        </div>

        {priceMenu.map((g, i) => (
          <div key={g.group} className="price-card sticky mb-[8vh]" style={{ top: `calc(11vh + ${i * 18}px)` }}>
            <div className="card-inner dark grid origin-top overflow-hidden rounded-[28px] border border-gold/30 bg-[#0d0c0a] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[220px] md:min-h-[480px]">
                <Image src={g.img} alt={`${g.group} at THE EDIT`} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0d0c0a]" />
                <span className="absolute top-6 left-6 font-serif text-6xl text-white/90">0{i + 1}</span>
              </div>
              <div className="p-7 sm:p-12">
                <h3 className="font-serif text-4xl text-gold-hi sm:text-5xl">{g.group}</h3>
                <ul className="mt-6">
                  {g.items.map((item) => (
                    <li key={item.name} className="p-row flex items-baseline gap-4 border-b border-white/10 py-4">
                      <span className="font-serif text-xl text-silver sm:text-2xl">{item.name}</span>
                      <span className="mb-1.5 flex-1 border-b border-dotted border-gold/25" />
                      <span className="text-right whitespace-nowrap">
                        {item.price.startsWith("₹") && <span className="mr-1.5 text-[0.62rem] tracking-[0.2em] text-silver/60 uppercase">from</span>}
                        <span className="font-serif text-xl text-gold-hi sm:text-2xl">{item.price}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <a href="#book" className="btn mt-8 !px-5 !py-3">
                  Book {g.group.split(" ")[0].toLowerCase()}
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* TODO: remove once the owners approve final pricing */}
        <p className="mt-6 text-center text-[0.7rem] tracking-[0.12em] text-silver/55">Indicative prices · final menu to be confirmed before opening</p>
      </div>
    </section>
  );
}
