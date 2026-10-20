"use client";

import { useRef, type ElementType } from "react";
import { gsap, MOTION, REDUCED, SplitText, useGSAP } from "@/lib/gsap";

// The "Humanising technology!" motion: words rise out of a soft blur, in reading order.
const HIDDEN = { yPercent: 60, autoAlpha: 0, filter: "blur(8px)" };
const SHOWN = { yPercent: 0, autoAlpha: 1, filter: "blur(0px)" };

/**
 * Heading whose words rise out of a soft blur (GSAP SplitText).
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
          type: "words",
          autoSplit: true,
          wordsClass: "split-word",
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            if (load) {
              return gsap.fromTo(self.words, HIDDEN, { ...SHOWN, duration: 1.1, ease: "power2.out", stagger: 0.08, delay });
            }
            // Scroll-linked, smoothed by scrub: 1 — words rise as the heading travels up the screen.
            return gsap.fromTo(self.words, HIDDEN, {
              ...SHOWN,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 95%", end: "clamp(top 62%)", scrub: 1 },
            });
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
