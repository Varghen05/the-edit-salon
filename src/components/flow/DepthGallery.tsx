"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { gallery } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Where each photo floats in the tunnel: offset from the centre (vw / vh) and starting depth
const spots = [
  { x: -27, y: -12, z: -500 },
  { x: 25, y: 14, z: -1200 },
  { x: -20, y: 16, z: -1900 },
  { x: 27, y: -14, z: -2600 },
  { x: -28, y: 4, z: -3300 },
  { x: 19, y: -4, z: -4000 },
  { x: -9, y: -17, z: -4700 },
  { x: 26, y: 17, z: -5400 },
];

/**
 * A slow walk through the studio. Photographs hang at different depths inside a dark glass
 * tunnel and glide past the camera as you scroll; each softly fades in from the distance and
 * out as it passes. The camera also leans with the pointer. Phones get a two-column grid.
 */
export default function DepthGallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const travel = 6000;
        const items = gsap.utils.toArray<HTMLElement>(".dg-item");
        const cam = { z: 0 };
        const layout = () => {
          items.forEach((el, i) => {
            const s = spots[i % spots.length];
            const z = s.z + cam.z;
            const o = gsap.utils.clamp(0, 1, (z + 4800) / 1500) * gsap.utils.clamp(0, 1, (650 - z) / 450);
            gsap.set(el, { x: `${s.x}vw`, y: `${s.y}vh`, z, opacity: o, xPercent: -50, yPercent: -50 });
          });
          gsap.set(".dg-title", { opacity: gsap.utils.clamp(0, 1, 1 - cam.z / 700), scale: 1 + cam.z / 2600 });
          gsap.set(".dg-bar", { scaleX: cam.z / travel });
        };
        layout();
        gsap.to(cam, { z: travel, ease: "none", onUpdate: layout, scrollTrigger: { trigger: root.current, start: "top top", end: "+=400%", scrub: 1.2, pin: true } });

        // the camera leans toward the pointer
        const rx = gsap.quickTo(".dg-stage", "rotateX", { duration: 1.4, ease: "power3" });
        const ry = gsap.quickTo(".dg-stage", "rotateY", { duration: 1.4, ease: "power3" });
        const move = (e: PointerEvent) => {
          ry((e.clientX / innerWidth - 0.5) * 6);
          rx(-(e.clientY / innerHeight - 0.5) * 4);
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
      // Phones: each photo tips up out of depth as it arrives, and the two columns drift at different speeds
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".dg-m").forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 70, rotateX: 22, scale: 0.9, opacity: 0, transformPerspective: 700, transformOrigin: "50% 100%" },
            { y: 0, rotateX: 0, scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 98%", end: "top 62%", scrub: 0.6 } },
          );
          gsap.to(el, { yPercent: i % 2 ? -7 : 5, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
        gsap.from(".dg-title > *", { y: 30, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".dg-title", start: "top 85%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="studio" className="relative z-10 overflow-hidden bg-ink md:h-screen">
      <div className="blob top-[30%] left-[35%] h-[36vw] w-[36vw] bg-[#6b3358]" />

      {/* desktop tunnel */}
      <div className="absolute inset-0 hidden md:block" style={{ perspective: "950px" }}>
        <div className="dg-stage absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute top-1/2 left-1/2" style={{ transformStyle: "preserve-3d" }}>
            {gallery.map((g) => (
              <figure key={g.src} className="dg-item glass absolute top-0 left-0 rounded-[26px] p-2" style={{ width: g.w > g.h ? 440 : 310 }}>
                <div className="relative overflow-hidden rounded-[20px]" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
                  <Image src={g.src} alt={g.alt} fill sizes="440px" className="object-cover" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="dg-title relative z-10 flex flex-col items-center justify-center px-5 pt-28 text-center md:pointer-events-none md:absolute md:inset-0 md:pt-0">
        <p className="eyebrow">Step inside</p>
        <h2 className="display mt-5 text-[clamp(2.8rem,7vw,6.8rem)]">
          Inside <em>the studio</em>
        </h2>
        <p className="mt-5 hidden max-w-[420px] text-silver/65 md:block">Scroll to walk through the looks, the chairs and the light.</p>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 mx-auto hidden h-px w-[min(420px,80%)] bg-white/15 md:block">
        <span className="dg-bar block h-full origin-left scale-x-0 bg-rose" />
      </div>

      {/* phones */}
      <div className="relative z-10 columns-2 gap-3 px-4 pt-12 pb-24 md:hidden">
        {gallery.map((g) => (
          <div key={g.src} className="dg-m relative mb-3 break-inside-avoid overflow-hidden rounded-2xl" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
            <Image src={g.src} alt={g.alt} fill sizes="50vw" className="object-cover" />
          </div>
        ))}
      </div>

      <p className="absolute right-5 bottom-4 z-10 text-[0.65rem] text-silver/35">Photos: Unsplash</p>
    </section>
  );
}
