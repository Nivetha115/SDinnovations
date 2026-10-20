"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION, REDUCED, useGSAP } from "@/lib/gsap";

/**
 * Children arrive in reading order, linked to the scroll and smoothed (scrub: 1):
 * rise + fade as the block travels up the screen. Reduced motion keeps only a short fade.
 * Set `items` to a selector to stagger nested rows (e.g. "li") instead of direct children.
 */
export default function Reveal({
  as: Tag = "div",
  children,
  className = "",
  items,
  y = 24,
  stagger = 0.07,
  delay = 0,
  load = false,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  items?: string;
  y?: number;
  stagger?: number;
  delay?: number;
  load?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const targets = items
        ? gsap.utils.toArray<HTMLElement>(items, root)
        : (Array.from(root.children) as HTMLElement[]);
      if (!targets.length) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        if (load) {
          gsap.from(targets, { autoAlpha: 0, y, duration: 0.9, ease: "expo.out", stagger, delay });
          return;
        }
        if (items) {
          // Rows: each one eases in as it crosses the lower part of the screen.
          targets.forEach((t) =>
            gsap.fromTo(
              t,
              { autoAlpha: 0, y },
              {
                autoAlpha: 1,
                y: 0,
                ease: "power2.out",
                scrollTrigger: { trigger: t, start: "top 98%", end: "clamp(top 72%)", scrub: 1 },
              }
            )
          );
          return;
        }
        // Blocks: children follow the scroll in reading order, smoothed (scrub: 1).
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            stagger,
            scrollTrigger: { trigger: root, start: `top ${95 - delay * 20}%`, end: "clamp(top 60%)", scrub: 1 },
          }
        );
      });

      mm.add(REDUCED, () => {
        gsap.from(targets, { autoAlpha: 0, duration: 0.4, ease: "none", delay });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
