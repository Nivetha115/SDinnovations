"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { hero } from "@/lib/content";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { Arrow } from "./Nav";

const SkyCanvas = dynamic(() => import("./SkyCanvas"), { ssr: false });
import Pill from "./Pill";


// Both hero buttons share one box so they always render the same size.
export const heroBtn =
  "wipe group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-xl px-5 text-[15px] font-medium transition-transform duration-150 ease-out active:scale-[0.97] sm:text-[16px]";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-word]");
        gsap.set("h1", { visibility: "visible" });
        // Load sequence, finished by ~1.2s: lines draw, words rise out of their masks, copy follows.
        // Same motion as "Humanising technology!": words rise out of a soft blur, in reading order.
        gsap.from(words, { yPercent: 60, autoAlpha: 0, filter: "blur(8px)", duration: 1.1, ease: "power2.out", stagger: 0.08, delay: 0.25 });
        gsap.from("[data-load]", { autoAlpha: 0, y: 14, duration: 0.8, ease: "expo.out", stagger: 0.08, delay: 0.6 });

        // Scroll: the reverse of "Humanising technology!" — words lift out in reading order into a soft blur.
        gsap.to("[data-drift]", {
          yPercent: -60,
          autoAlpha: 0,
          filter: "blur(8px)",
          ease: "power1.in",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top top", end: "65% top", scrub: 1 },
        });
        gsap.to("[data-copy]", {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "30% top", end: "85% top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      id="top"
      data-flow-hero
      data-chapter="Overview"
      ref={root}
      className="theme-fixed relative isolate flex min-h-svh flex-col overflow-hidden bg-ink"
    >
      {/* sky gradient matched to the Sterling reference */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <SkyCanvas />
      </div>


      {/* Mobile: vertically centred below the header. md+: anchored to the bottom-left. */}
      <div
        data-copy
        className="relative z-[2] mx-auto my-auto flex w-full max-w-[1440px] flex-col items-start px-5 pb-8 pt-[calc(var(--header-h)+1.5rem)] md:mb-0 md:mt-auto md:px-10 md:pb-16 md:pt-[calc(var(--header-h)+4rem)]"
      >
        <p data-load className="mb-6">
          <Pill live>{hero.eyebrow}</Pill>
        </p>

        <h1
          data-split
          aria-label={hero.title}
          className="max-w-[15ch] text-balance text-[clamp(2.3rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white"
        >
          {hero.title.split(" ").map((w, i, all) => (
            <span key={i} aria-hidden data-drift className="inline-block will-change-transform">
              <span data-word className="inline-block">
                {w}
              </span>
              {i < all.length - 1 && " "}
            </span>
          ))}
        </h1>

        <p
          data-load
          className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[var(--body)] md:text-[18px]"
        >
          {hero.body}
        </p>

        <div data-load className="mt-9 grid w-full grid-cols-2 gap-3 sm:w-[26rem]">
          <Link href="/services" className={`${heroBtn} bg-white text-ink`}>
            <span className="sweep bg-electric" />
            <span className="transition-colors duration-200 group-hover:text-on-accent">{hero.cta}</span>
            <Arrow className="transition-[transform,color] duration-300 ease-out group-hover:rotate-45 group-hover:text-on-accent" />
          </Link>
          <Link
            href="/contact"
            className={`${heroBtn} border border-white/25 bg-white/[0.06] text-white backdrop-blur-md`}
          >
            <span className="sweep bg-white" />
            <span className="transition-colors duration-200 group-hover:text-ink">Contact us</span>
            <Arrow className="transition-[transform,color] duration-300 ease-out group-hover:rotate-45 group-hover:text-ink" />
          </Link>
        </div>
      </div>
    </section>
  );
}
