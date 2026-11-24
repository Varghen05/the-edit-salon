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
 * A slow walk through the studio, the same on every screen. Photographs hang at different
 * depths inside a dark glass tunnel and glide past the camera as you scroll; each softly
 * fades in from the distance and out as it passes. The camera leans with the pointer, or
 * drifts on its own on touch screens. Photo sizes and offsets scale down to fit phones.
 */
export default function DepthGallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const travel = 6000;
        const items = gsap.utils.toArray<HTMLElement>(".dg-item");
        const cam = { z: 0 };
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        let scale = 1; // photo size, relative to a 1440px-wide screen
        let spread = 1; // how far photos sit from the centre

        const measure = () => {
          scale = gsap.utils.clamp(0.5, 1, innerWidth / 1440);
          spread = innerWidth < 768 ? 0.5 : 1;
          items.forEach((el, i) => {
            const g = gallery[i % gallery.length];
            gsap.set(el, { width: (g.w > g.h ? 440 : 310) * scale });
          });
        };

        const layout = () => {
          items.forEach((el, i) => {
            const s = spots[i % spots.length];
            const z = s.z + cam.z;
            const o = gsap.utils.clamp(0, 1, (z + 4800) / 1500) * gsap.utils.clamp(0, 1, (650 - z) / 450);
            gsap.set(el, { x: s.x * 0.01 * innerWidth * spread, y: `${s.y}vh`, z, opacity: o, xPercent: -50, yPercent: -50 });
          });
          gsap.set(".dg-title", { opacity: gsap.utils.clamp(0, 1, 1 - cam.z / 700), scale: 1 + cam.z / 2600 });
          gsap.set(".dg-bar", { scaleX: cam.z / travel });
        };
        measure();
        layout();

        gsap.to(cam, {
          z: travel,
          ease: "none",
          onUpdate: layout,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=400%",
            scrub: 1.2,
            pin: true,
            onRefresh: () => {
              measure();
              layout();
            },
          },
        });

        // the camera leans toward the pointer; on touch screens it drifts slowly by itself
        const rx = gsap.quickTo(".dg-stage", "rotateX", { duration: 1.4, ease: "power3" });
        const ry = gsap.quickTo(".dg-stage", "rotateY", { duration: 1.4, ease: "power3" });
        if (coarse) {
          gsap.to(".dg-stage", { rotateY: 3.5, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.to(".dg-stage", { rotateX: -2.5, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
          return;
        }
        const move = (e: PointerEvent) => {
          ry((e.clientX / innerWidth - 0.5) * 6);
          rx(-(e.clientY / innerHeight - 0.5) * 4);
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="studio" className="relative z-10 h-[100svh] min-h-[560px] overflow-hidden bg-ink">
      <div className="blob top-[30%] left-[35%] h-[36vw] w-[36vw] bg-[var(--blob-a)]" />

      <div className="absolute inset-0" style={{ perspective: "950px" }}>
        <div className="dg-stage absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute top-1/2 left-1/2" style={{ transformStyle: "preserve-3d" }}>
            {gallery.map((g) => (
              <figure key={g.src} className="dg-item glass absolute top-0 left-0 rounded-[20px] p-1.5 sm:rounded-[26px] sm:p-2" style={{ width: g.w > g.h ? 440 : 310 }}>
                <div className="relative overflow-hidden rounded-[15px] sm:rounded-[20px]" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
                  <Image src={g.src} alt={g.alt} fill sizes="(max-width: 768px) 230px, 440px" loading="eager" className="object-cover" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="dg-title pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow">Step inside</p>
        <h2 className="display mt-5 text-[clamp(2.8rem,7vw,6.8rem)]">
          Inside <em>the studio</em>
        </h2>
        <p className="mt-5 max-w-[420px] text-silver/65">Scroll to walk through the looks, the chairs and the light.</p>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 mx-auto h-px w-[min(420px,80%)] bg-silver/15">
        <span className="dg-bar block h-full origin-left scale-x-0 bg-rose" />
      </div>

      <p className="absolute right-5 bottom-4 z-10 text-[0.65rem] text-silver/35">Photos: Unsplash</p>
    </section>
  );
}
