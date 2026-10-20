"use client";

import { useRef } from "react";
import Link from "next/link";
import { cta } from "@/lib/content";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import SplitHeading from "./motion/SplitHeading";
import Reveal from "./motion/Reveal";
import { Arrow } from "./Nav";
import { bodyText } from "@/lib/ui";

export default function CTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // The glow drifts with the scroll, locked to the scrollbar.
      mm.add(MOTION, () => {
        gsap.fromTo(
          "[data-glow]",
          { xPercent: 12, yPercent: 14 },
          {
            xPercent: -6,
            yPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="cta" className="grain relative z-[3] isolate overflow-hidden bg-[var(--banner)] py-28 md:py-44">
      <div
        data-glow
        aria-hidden
        className="absolute -inset-[20%] -z-10 bg-[radial-gradient(60%_70%_at_80%_85%,var(--banner-glow),transparent_60%),radial-gradient(50%_60%_at_0%_0%,var(--banner-corner),transparent_70%)]"
      />
      {/* fade the banner's top and bottom into the page so it isn't a hard block */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-[5] h-48 bg-gradient-to-b from-[var(--page)] to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-48 bg-gradient-to-b from-transparent to-[var(--page)]" />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-8 px-5 md:px-10">
        <SplitHeading className="max-w-[15ch] text-[clamp(2.3rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em]">
          {cta.title}
        </SplitHeading>
        <Reveal delay={0.25} className="flex max-w-[46ch] flex-col items-start gap-8">
          <p className={bodyText}>{cta.body}</p>
          <Link
            href="/contact"
            className="wipe group inline-flex h-14 items-center gap-3 rounded-xl bg-white px-6 text-[16px] font-medium text-ink transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            <span className="sweep bg-electric" />
            <span className="transition-colors duration-200 group-hover:text-white">{cta.button}</span>
            <Arrow className="transition-colors duration-200 group-hover:text-[#fff] transition-transform duration-300 ease-out group-hover:rotate-45" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
