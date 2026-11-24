"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Play on mount instead of when scrolled into view */
  immediate?: boolean;
  /** Classes for each word, e.g. a gradient that must sit on the moving element itself */
  wordClassName?: string;
  children?: ReactNode;
};

/** Headline whose words rise out of a mask, one after another. */
export default function SplitReveal({ text, as: Tag = "h2", className, delay = 0, stagger = 0.06, immediate, wordClassName }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = ref.current!.querySelectorAll(".w > span");
      gsap.to(words, {
        y: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 88%" },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-split aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="w" aria-hidden>
          <span className={wordClassName}>{word}</span>
          {" "}
        </span>
      ))}
    </Tag>
  );
}
