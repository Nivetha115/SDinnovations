"use client";

import { useRef } from "react";
import Link from "next/link";
import { services } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { Arrow } from "../Nav";
import { bodyText } from "@/lib/ui";
import Pill from "../Pill";

const DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/**
 * Philos' "ascent": the section holds while the services travel sideways, with a progress bar.
 * Desktop only — on phones it is a native swipe row, so vertical scrolling stays free.
 */
export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const distance = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0);
        const move = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: {
          trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 1, invalidateOnRefresh: true,
        } });
        // Each panel's text eases in as the panel crosses into view.
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-pin]"), {
            y: 30,
            autoAlpha: 0,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: { trigger: panel, containerAnimation: move, start: "left 95%", end: "left 60%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="capabilities"
      data-chapter="Capabilities"
      className="relative overflow-hidden py-20 md:motion-safe:flex md:motion-safe:h-svh md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:py-0"
    >
      <div
        ref={track}
        className="relative z-[2] flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:px-10 md:motion-safe:gap-6 md:motion-safe:overflow-visible md:motion-safe:pb-0 md:motion-safe:will-change-transform"
      >
        {/* intro */}
        <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-end pr-6 sm:w-[26rem] md:motion-safe:h-[64svh] lg:w-[34rem] lg:pr-12">
          <Pill>Capabilities</Pill>
          <h2 className="mt-5 text-[clamp(2.3rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em]">
            Comprehensive solutions for your business
          </h2>
          <p className={`mt-6 max-w-[36ch] ${bodyText}`}>
            Seven practices, one partner — from engineering and data to AI, security and the ServiceNow Platform.
          </p>
          <p className="mt-8 hidden items-center gap-3 text-[14px] text-white/50 md:motion-safe:flex">
            Keep scrolling <span aria-hidden className="h-px w-10 bg-white/30" />
          </p>
        </div>

        {services.map((s, i) => (
          <Link
            key={s.slug}
            href={`/services#${s.slug}`}
            data-panel
            className="group relative flex h-[26rem] w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-[var(--card)] p-7 transition-colors duration-500 ease-[var(--ease-out)] hover:bg-[var(--card-hover)] sm:w-[24rem] md:motion-safe:h-[64svh] lg:w-[26rem] lg:p-9"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,153,255,0.18),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div data-pin className="flex items-baseline justify-between text-white/45">
              <span className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-white/90 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[14px] tabular-nums">/ {String(services.length).padStart(2, "0")}</span>
            </div>
            {/* title + text start at the same height in every card; "Learn more" sits at the bottom */}
            <h3 data-pin className="mt-10 text-[clamp(1.6rem,2.2vw,2.1rem)] font-medium leading-[1.05] tracking-[-0.025em] md:motion-safe:mt-[clamp(2.5rem,9svh,6rem)]">
              {s.title}
            </h3>
            <p data-pin className={`mt-4 ${bodyText}`}>
              {s.short}
            </p>
            <span data-pin className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-medium text-electric">
              Learn more
              <Arrow className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45" />
            </span>
          </Link>
        ))}

        {/* closing panel */}
        <Link
          href="/services"
          className="group flex h-[26rem] w-[70vw] shrink-0 snap-start flex-col items-start justify-end rounded-2xl bg-white p-7 text-ink transition-colors duration-500 hover:bg-electric hover:text-[#fff] sm:w-[20rem] lg:mr-[10vw] md:motion-safe:h-[64svh] lg:w-[22rem] lg:p-9"
        >
          <span className="text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
            Explore all services
          </span>
          <span className="mt-6 grid h-12 w-12 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-45">
            <Arrow />
          </span>
        </Link>
      </div>

      {/* progress */}
      <div className="relative z-[2] mx-auto mt-10 hidden w-full max-w-[1440px] px-10 md:motion-safe:block">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div data-bar className="h-full origin-left bg-electric" />
        </div>
      </div>
    </section>
  );
}
