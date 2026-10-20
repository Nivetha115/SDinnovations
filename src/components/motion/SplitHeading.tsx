"use client";

import { useRef, type ElementType } from "react";
import { gsap, MOTION, REDUCED, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Heading whose lines rise out of a mask (GSAP SplitText).
 * `load` plays on mount (hero); otherwise it follows the scroll, smoothed (scrub: 1).
 * Without JS, or with reduced motion, the heading is simply shown.
 */
export default function SplitHeading({
  as: Tag = "h2",
  children,
  className = "",
  load = false,
  delay = 0,
}: {
  as?: ElementType;
  children: string;
  className?: string;
  load?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            if (load) {
              return gsap.from(self.lines, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.09, delay });
            }
            // Scroll-linked, smoothed by scrub: 1 — lines rise as the heading travels up the screen.
            return gsap.fromTo(
              self.lines,
              { yPercent: 110, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                ease: "power2.out",
                stagger: 0.12,
                scrollTrigger: { trigger: el, start: "top 95%", end: "clamp(top 62%)", scrub: 1 },
              }
            );
          },
        });
      });

      mm.add(REDUCED, () => {
        gsap.set(el, { visibility: "visible" });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} data-split className={className}>
      {children}
    </Tag>
  );
}
