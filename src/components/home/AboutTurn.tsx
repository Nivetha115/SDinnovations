"use client";

import { useRef } from "react";
import { about } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { bodyText, wrap } from "@/lib/ui";
import Pill from "../Pill";

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

/**
 * About, as a held scene (desktop):
 *  1. "Humanising technology!" rises word by word out of a soft blur.
 *  2. The story then fills in word by word — faint to full — paced by the scroll.
 * Phones scroll freely: the words fill in as they pass, no hold.
 */
export default function AboutTurn() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const ink = gsap.utils.toArray<HTMLElement>("[data-ink]");

      mm.add(DESKTOP, () => {
        const section = root.current!;
        gsap.set(ink, { opacity: 0.16 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 1,
          },
        });

        // heading: words rise out of a soft blur, in reading order (the original motion)
        tl.from(
          "[data-w]",
          { yPercent: 60, autoAlpha: 0, filter: "blur(8px)", duration: 0.3, ease: "power2.out", stagger: 0.06 },
          0
        )
          .fromTo("[data-pill]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.3)
          .fromTo("[data-story]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.3)
          // the story fills in, word by word, in reading order
          .to(ink, { opacity: 1, duration: 0.04, stagger: { each: 0.55 / ink.length } }, 0.38)
          .to({}, { duration: 0.06 }); // a short rest before the section releases
      });

      mm.add(MOBILE, () => {
        gsap.from("[data-w]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
        gsap.fromTo(
          ink,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: { each: 0.5 / Math.max(ink.length, 1) },
            scrollTrigger: { trigger: "[data-story]", start: "top 85%", end: "bottom 55%", scrub: 1 },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="about"
      data-flow-state="0"
      data-chapter="About"
      className="relative flex min-h-svh items-center overflow-hidden py-24 lg:h-svh lg:py-0"
    >
      {/* black overlay at the seam with the hero, easing into the aurora */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ink to-transparent" />

      <div className={`${wrap} relative z-[2]`}>
        <p data-pill className="mb-8">
          <Pill>About SD Innovations</Pill>
        </p>
        <h2
          aria-label={about.title}
          className="max-w-[15ch] text-[clamp(2.3rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em]"
        >
          {about.title.split(" ").map((w, wi, all) => (
            <span key={wi} aria-hidden data-w className="inline-block will-change-transform">
              {w}
              {wi < all.length - 1 && " "}
            </span>
          ))}
        </h2>
        <div data-story data-flow-calm-target className="mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2 md:gap-10">
          {about.paragraphs.map((p, i) => (
            <p key={i} className={bodyText}>
              {p.split(" ").map((w, wi, all) => (
                <span key={wi} data-ink>
                  {w}
                  {wi < all.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
