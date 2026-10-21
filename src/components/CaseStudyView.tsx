"use client";

import { useRef } from "react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/content";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import PageHero from "./PageHero";
import CTA from "./CTA";
import SplitHeading from "./motion/SplitHeading";
import Reveal from "./motion/Reveal";
import Counter from "./motion/Counter";
import SectionLabel from "./SectionLabel";
import { wrap } from "@/lib/ui";
import { Arrow } from "./Nav";

export default function CaseStudyView({ study, next }: { study: CaseStudy; next: CaseStudy }) {
  const meta = [
    { k: "Client", v: study.client },
    { k: "Industry", v: study.industry },
    { k: "Duration", v: study.duration },
    ...(study.team ? [{ k: "Team", v: study.team }] : []),
  ];

  return (
    <main>
      <PageHero
        title={study.title}
        body={study.summary}
        kicker={
          <Link href="/case-studies" className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-white">
            Case studies · {study.tag}
          </Link>
        }
      >
        <dl className="grid max-w-4xl grid-cols-2 gap-x-10 gap-y-5 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.k}>
              <dt className="text-[13px] text-white/60">{m.k}</dt>
              <dd className="mt-1 text-[15px] leading-snug text-white">{m.v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Figures */}
      <section className="theme-fixed bg-white py-20 text-ink md:py-28">
        <div className={wrap}>
          <SectionLabel tone="light">Impact</SectionLabel>
          <Reveal
            stagger={0.1}
            className={`mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 ${study.metrics.length > 2 ? "lg:grid-cols-4" : ""}`}
          >
            {study.metrics.map((m) => (
              <div key={m.label}>
                <Counter
                  value={m.value}
                  prefix={m.prefix}
                  suffix={m.suffix}
                  className="block text-[clamp(3.5rem,7vw,6rem)] font-medium leading-none tracking-[-0.04em] text-royal"
                />
                <p className="mt-4 max-w-[24ch] text-[16px] leading-snug text-ink/70">{m.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Challenge & solution */}
      <section className="bg-ink py-24 md:py-36">
        <div className={`${wrap} grid gap-16 md:grid-cols-2 md:gap-20`}>
          <div>
            <SectionLabel>The challenge</SectionLabel>
            <Reveal className="mt-8">
              <p className="text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.45] text-white">{study.challenge}</p>
            </Reveal>
          </div>
          <div>
            <SectionLabel>Our solution</SectionLabel>
            <Reveal className="mt-8" delay={0.1}>
              <p className="text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.45] text-white">{study.solution}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <Approach study={study} />

      {/* Tech + results */}
      <section className="bg-ink pb-24 md:pb-36">
        <div className={`${wrap} grid gap-16 md:grid-cols-2 md:gap-20`}>
          <div>
            <SectionLabel>Technology</SectionLabel>
            <Reveal as="ul" items=":scope > li" stagger={0.04} y={12} className="mt-8 flex flex-wrap gap-2.5">
              {study.tech.map((t) => (
                <li key={t} className="rounded-full bg-white/[0.07] px-4 py-2 text-[15px] text-white/85">
                  {t}
                </li>
              ))}
            </Reveal>
          </div>
          <div>
            <SectionLabel>Results</SectionLabel>
            <Reveal as="ul" items=":scope > li" stagger={0.07} className="mt-8 space-y-4">
              {study.results.map((r) => (
                <li key={r} className="flex gap-4 text-[17px] leading-relaxed text-white/85">
                  <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                  {r}
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Next study */}
      <section className="bg-ink">
        <Link
          href={`/case-studies/${next.slug}`}
          className="group relative block overflow-hidden border-t border-white/12"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-navy transition-transform duration-700 ease-[var(--ease-in-out)] group-hover:scale-y-100"
          />
          <div className={`${wrap} relative flex items-end justify-between gap-6 py-16 md:py-24`}>
            <div>
              <p className="text-[14px] text-white/60">Next case study</p>
              <p className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-medium leading-[1] tracking-[-0.035em]">
                {next.title}
              </p>
            </div>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45">
              <Arrow />
            </span>
          </div>
        </Link>
      </section>
      <CTA />
    </main>
  );
}

function Approach({ study }: { study: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // A line traces the steps as they're read, locked to the scrollbar.
      mm.add(MOTION, () => {
        gsap.fromTo(
          "[data-trace]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-steps]", start: "top 75%", end: "bottom 60%", scrub: true },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-ink pb-24 md:pb-36">
      <div className={wrap}>
        <SectionLabel>Approach</SectionLabel>
        <SplitHeading className="mt-10 max-w-[18ch] text-[clamp(2rem,4.4vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
          How we delivered it
        </SplitHeading>
        <div data-steps className="relative mt-14 md:mt-20">
          <span aria-hidden className="absolute left-0 right-0 top-[11px] hidden h-px bg-white/12 lg:block" />
          <span aria-hidden data-trace className="absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-electric lg:block" />
          <Reveal
            as="ol"
            items=":scope > li"
            stagger={0.09}
            className={`grid gap-10 sm:grid-cols-2 ${study.approach.length > 3 ? "lg:grid-cols-5" : "lg:grid-cols-3"}`}
          >
            {study.approach.map((a, i) => (
              <li key={a.title} className="relative">
                <span className="relative z-10 grid h-6 w-6 place-items-center rounded-full bg-electric text-[12px] font-medium tabular-nums text-on-accent">
                  {i + 1}
                </span>
                <SplitHeading as="h3" className="mt-6 text-[22px] font-medium tracking-[-0.02em]">{a.title}</SplitHeading>
                <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-white/65">{a.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
