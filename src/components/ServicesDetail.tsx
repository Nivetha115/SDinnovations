"use client";

import { useRef } from "react";
import Link from "next/link";
import { services, techStack } from "@/lib/content";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import SplitHeading from "./motion/SplitHeading";
import Reveal from "./motion/Reveal";
import SectionLabel from "./SectionLabel";
import { wrap } from "@/lib/ui";
import { Arrow } from "./Nav";

export function ServiceList() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        // Progress rail fills as the list is read, locked to the scrollbar.
        gsap.fromTo(
          "[data-rail]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-list]", start: "top 70%", end: "bottom 70%", scrub: true },
          }
        );
        // Each service lights its marker as it reaches the reading line.
        gsap.utils.toArray<HTMLElement>("[data-service]").forEach((el) => {
          // Colour comes from a class (so it follows the live palette); GSAP only scales.
          const dot = el.querySelector("[data-dot]");
          gsap.to(dot, {
            scale: 1.6,
            duration: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              toggleActions: "play none none reverse",
              toggleClass: { targets: dot, className: "is-lit" },
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-ink py-24 md:py-36">
      <div className={wrap}>
        <SectionLabel>What we do</SectionLabel>
        <SplitHeading className="mt-10 max-w-[18ch] text-[clamp(2.25rem,5vw,4.75rem)] font-medium leading-[1] tracking-[-0.03em] md:mt-14">
          Seven practices, one accountable partner
        </SplitHeading>

        <div data-list className="relative mt-16 md:mt-24 md:pl-14">
          {/* rail */}
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 hidden w-px bg-white/12 md:block" />
          <span
            data-rail
            aria-hidden
            className="absolute bottom-0 left-[7px] top-0 hidden w-px origin-top bg-electric md:block"
          />

          {services.map((s) => (
            <article
              key={s.slug}
              id={s.slug}
              data-service
              className="relative scroll-mt-28 border-t border-white/12 py-12 first:border-t-0 first:pt-0 md:py-16"
            >
              <Reveal className="grid gap-6 md:grid-cols-[1fr_1.15fr] md:gap-16">
                <div className="relative">
                  <span
                    data-dot
                    aria-hidden
                    className="absolute -left-14 top-[0.55em] hidden h-[15px] w-[15px] rounded-full border-[3px] border-ink bg-white/30 text-[clamp(1.75rem,3.4vw,3rem)] transition-colors duration-300 md:block [&.is-lit]:bg-electric"
                  />
                  <SplitHeading as="h3" className="text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.025em]">
                    {s.title}
                  </SplitHeading>
                </div>
                <div>
                  <p className="text-[clamp(1.1rem,1.6vw,1.375rem)] leading-snug text-white">{s.tagline}</p>
                  <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-white/65">{s.body}</p>
                  <Link
                    href="/contact"
                    className="group mt-7 inline-flex items-center gap-2 text-[15px] font-medium text-electric"
                  >
                    Start a project
                    <Arrow className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45" />
                  </Link>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechStack() {
  const row = [...techStack, ...techStack];
  return (
    <section className="theme-fixed relative overflow-hidden bg-white py-24 text-ink md:py-32">
      <div className={wrap}>
        <SectionLabel tone="light">Our technology stack</SectionLabel>
        <SplitHeading className="mt-10 max-w-[22ch] text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em] md:mt-14">
          Cutting-edge technologies, chosen for robust, scalable solutions.
        </SplitHeading>
      </div>
      <div className="marquee-wrap mt-14 md:mt-20" aria-label="Technologies we use">
        <ul className="marquee">
          {row.map((t, i) => (
            <li
              key={i}
              aria-hidden={i >= techStack.length}
              className="mx-3 whitespace-nowrap rounded-full border border-ink/12 bg-white px-8 py-5 text-[clamp(1.5rem,3vw,2.75rem)] font-medium tracking-[-0.02em] text-ink transition-colors duration-200 hover:border-navy hover:bg-navy hover:text-white md:mx-4"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
