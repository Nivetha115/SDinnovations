"use client";

import { useRef } from "react";
import { about } from "@/lib/content";
import { gsap, REVEAL_START, useGSAP } from "@/lib/gsap";
import { bodyText, wrap } from "@/lib/ui";
import Pill from "../Pill";

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

/**
 * Philos' "turn": the section holds while the statement's words rise out of a soft blur.
 * Held for ~1.3 screens on desktop only; phones get a simple reveal and scroll freely.
 */
export default function AboutTurn() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const words = gsap.utils.toArray<HTMLElement>("[data-w]");

      mm.add(DESKTOP, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=130%", pin: true, scrub: 1 },
        });
        // Words rise and come into focus in reading order, locked (smoothed) to the scrollbar.
        tl.from(
          words,
          {
            yPercent: 60,
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.08,
          },
          0
        )
          .from("[data-para]", { autoAlpha: 0, y: 30, duration: 0.25, stagger: 0.08, ease: "power2.out" }, 0.55)
          .to({}, { duration: 0.15 }); // brief rest before release
      });

      mm.add(MOBILE, () => {
        gsap.from(words, {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: REVEAL_START, once: true },
        });
        gsap.from("[data-para]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.3,
          scrollTrigger: { trigger: root.current, start: REVEAL_START, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="about"
      data-chapter="About"
      className="relative flex min-h-svh items-center overflow-hidden py-24 lg:h-svh lg:py-0"
    >
      {/* soft, dim glow behind the orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 -z-10 h-[80vh] w-[80vh] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(13,64,155,0.32),transparent_65%)]"
      />

      {/* black overlay at the seam with the hero, easing into the aurora */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ink to-transparent" />

      <div className={`${wrap} relative z-[2]`}>
        <p data-para className="mb-8">
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
        <div className="mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2 md:gap-10">
          {about.paragraphs.map((p, i) => (
            <p key={i} data-para className={bodyText}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
