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
    <section ref={root} id="cta" data-flow-state="4" className="grain relative z-[3] isolate overflow-hidden py-28 md:py-44">
      {/* The banner fades in from transparent at the top, so the light behind it melts into it
          instead of being cut off by a hard edge. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[var(--banner)] [mask-image:linear-gradient(to_bottom,transparent,#000_14rem)]">
        <div
          data-glow
          className="absolute -inset-[20%] bg-[radial-gradient(60%_70%_at_80%_85%,var(--banner-glow),transparent_60%),radial-gradient(50%_60%_at_0%_0%,var(--banner-corner),transparent_70%)]"
        />
        {/* fade the bottom into the page */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[var(--page)]" />
      </div>
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
            <span className="transition-colors duration-200 group-hover:text-on-accent">{cta.button}</span>
            <Arrow className="transition-colors duration-200 group-hover:text-on-accent transition-transform duration-300 ease-out group-hover:rotate-45" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
