"use client";

import Link from "next/link";
import { caseStudies, services, why } from "@/lib/content";
import SplitHeading from "./motion/SplitHeading";
import Reveal from "./motion/Reveal";
import SectionLabel from "./SectionLabel";
import { Arrow } from "./Nav";
import WhyIcon from "./WhyIcon";

import { bodyText, wrap } from "@/lib/ui";
export { wrap };

export function Services() {
  return (
    <section id="services" className="relative bg-ink py-24 md:py-36">
      <div className={wrap}>
        <SectionLabel>Capabilities</SectionLabel>
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.4fr_1fr] md:items-end">
          <SplitHeading className="max-w-[16ch] text-[clamp(2.25rem,5.2vw,5rem)] font-medium leading-[1] tracking-[-0.03em]">
            Comprehensive solutions for your business
          </SplitHeading>
          <Reveal delay={0.2}>
            <p className="max-w-[42ch] text-[16px] leading-relaxed text-white/65 md:justify-self-end">
              Seven practices, one partner — from engineering and data to AI, security and the
              ServiceNow Platform.
            </p>
          </Reveal>
        </div>

        <Reveal as="ul" items=":scope > li" stagger={0.06} y={20} className="mt-16 border-t border-white/12 md:mt-24">
          {services.map((s, i) => (
            <li key={s.slug} className="group relative border-b border-white/12">
              <Link
                href={`/services#${s.slug}`}
                className="relative grid grid-cols-[3rem_1fr_auto] items-center gap-4 overflow-hidden px-4 py-7 md:px-8 md:grid-cols-[6rem_1.1fr_1fr_auto] md:gap-8 md:py-9"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-r from-navy via-royal/70 to-transparent transition-transform duration-700 ease-[var(--ease-in-out)] group-hover:scale-y-100"
                />
                <span className="relative text-[13px] tabular-nums text-white/60 transition-colors duration-200 group-hover:text-electric">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative text-[clamp(1.25rem,2.4vw,2.1rem)] font-medium tracking-[-0.02em] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2">
                  {s.title}
                </span>
                <span className="relative hidden max-w-[44ch] text-[15px] leading-relaxed text-white/60 md:block">
                  {s.short}
                </span>
                <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/20 transition-[transform,background-color,border-color] duration-300 ease-[var(--ease-out)] group-hover:rotate-45 group-hover:border-electric group-hover:bg-electric group-hover:text-on-accent">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section id="why" className="theme-fixed relative bg-white py-24 text-ink md:py-36">
      <div className={wrap}>
        <SectionLabel tone="light">{why.label}</SectionLabel>
        <SplitHeading className="mt-10 max-w-[22ch] text-[clamp(2rem,4.4vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.03em] md:mt-14">
          {why.title}
        </SplitHeading>
        <Reveal
          stagger={0.09}
          y={28}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4 md:mt-24"
        >
          {why.items.map((it) => (
            <div
              key={it.title}
              className="group relative flex h-full min-h-[300px] flex-col bg-white p-7 transition-colors duration-500 ease-[var(--ease-out)] hover:bg-navy hover:text-white md:p-8"
            >
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-ink/[0.05] text-royal transition-[background-color,color] duration-500 ease-[var(--ease-out)] group-hover:bg-electric group-hover:text-on-accent">
                <WhyIcon name={it.icon} className="h-7 w-7" />
              </span>
              <div className="mt-auto">
                <SplitHeading as="h3" className="text-[24px] font-medium tracking-[-0.02em]">{it.title}</SplitHeading>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/65 transition-colors duration-300 group-hover:text-white/75">
                  {it.body}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** Case study rows — used on the home teaser and the case studies index. */
export function CaseRows({ limit }: { limit?: number }) {
  const list = limit ? caseStudies.slice(0, limit) : caseStudies;
  return (
    <Reveal as="ul" items=":scope > li" stagger={0.08} y={24} className="border-t border-white/12">
      {list.map((c) => (
        <li key={c.slug} className="group border-b border-white/12">
          <Link
            href={`/case-studies/${c.slug}`}
            className="relative grid gap-4 overflow-hidden px-4 py-9 md:px-8 md:grid-cols-[1fr_1.1fr_auto] md:items-center md:gap-10 md:py-12"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,var(--row-hover),transparent)] transition-transform duration-700 ease-[var(--ease-in-out)] group-hover:scale-x-100"
            />
            <div className="relative">
              <p className="text-[14px] text-electric">{c.tag}</p>
              <SplitHeading as="h3" className="mt-2 text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.025em]">
                {c.title}
              </SplitHeading>
            </div>
            <p className={`relative max-w-[52ch] ${bodyText}`}>{c.summary}</p>
            <span className="relative flex items-center gap-4 md:justify-end">
              <span className="text-[15px] font-medium text-white/85 md:hidden">Read case study</span>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-[transform,background-color,border-color] duration-300 ease-[var(--ease-out)] group-hover:rotate-45 group-hover:border-electric group-hover:bg-electric group-hover:text-on-accent">
                <Arrow />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" data-flow-state="3" data-chapter="Work" className="relative py-24 md:py-36">
      <div className={`${wrap} relative z-[2]`}>
        <SectionLabel>Selected work</SectionLabel>
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <SplitHeading className="max-w-[15ch] text-[clamp(2.3rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em]">
            Results our clients can measure
          </SplitHeading>
          <Reveal delay={0.2}>
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-2 text-[16px] font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-electric"
            >
              All case studies
              <Arrow className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-14 md:mt-20">
          <CaseRows limit={3} />
        </div>
      </div>
    </section>
  );
}
