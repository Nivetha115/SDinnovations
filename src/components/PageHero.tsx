"use client";

import { useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import SplitHeading from "./motion/SplitHeading";
import Pill from "./Pill";

const SkyCanvas = dynamic(() => import("./SkyCanvas"), { ssr: false });

/** Inner-page hero: the same sky as the homepage hero, shorter, copy anchored bottom-left. */
export default function PageHero({
  title,
  body,
  kicker,
  children,
}: {
  title: string;
  body?: string;
  kicker?: ReactNode;
  children?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from("[data-load]", { autoAlpha: 0, y: 14, duration: 0.8, ease: "expo.out", stagger: 0.08, delay: 0.45 });
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-copy]", { yPercent: -12, autoAlpha: 0.2, ease: "none", scrollTrigger: st });
        gsap.to("[data-bg]", { scale: 1.08, ease: "none", scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="theme-fixed relative isolate flex min-h-[78svh] flex-col overflow-hidden bg-ink md:min-h-[82svh]"
    >
      <div data-bg className="absolute inset-0 -z-10" aria-hidden>
        <SkyCanvas />
      </div>

      <div
        data-copy
        className="mx-auto mt-auto w-full max-w-[1440px] px-5 pb-12 pt-[calc(var(--header-h)+4rem)] md:px-10 md:pb-16"
      >
        {kicker && (
          <div data-load className="mb-6">
            <Pill>{kicker}</Pill>
          </div>
        )}
        <SplitHeading
          as="h1"
          load
          delay={0.2}
          className="max-w-[18ch] text-balance text-[clamp(2.5rem,6vw,5.75rem)] font-medium leading-[0.98] tracking-[-0.035em]"
        >
          {title}
        </SplitHeading>
        {body && (
          <p data-load className="mt-6 max-w-[54ch] text-[16px] leading-relaxed text-[var(--body)] md:text-[18px]">
            {body}
          </p>
        )}
        {children && <div data-load className="mt-9">{children}</div>}
      </div>
    </section>
  );
}
