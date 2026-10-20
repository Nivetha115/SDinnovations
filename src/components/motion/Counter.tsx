"use client";

import { useRef } from "react";
import { gsap, MOTION, REVEAL_START, useGSAP } from "@/lib/gsap";

/** A figure that counts up once when it scrolls into view. Renders the final value without JS. */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const state = { n: 0 };
        el.textContent = `${prefix}0${suffix}`;
        gsap.to(state, {
          n: value,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(state.n)}${suffix}`;
          },
        });
        return () => {
          el.textContent = `${prefix}${value}${suffix}`;
        };
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
