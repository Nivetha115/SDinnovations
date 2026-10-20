"use client";

import { useRef } from "react";
import { why } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Reveal from "../motion/Reveal";
import SplitHeading from "../motion/SplitHeading";
import { bodyText, wrap } from "@/lib/ui";
import Pill from "../Pill";

const MOTION_DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

// One word per reason, shown huge behind the copy.
const WORDS = ["Expertise", "Agility", "Quality", "Partnership"];

/**
 * Philos' "wall": the section holds while a large word (the heading) changes, its description below,
 * with a 01/04 counter. ~2 screens on desktop; phones get a plain stacked list.
 */
export default function WhyWall() {
  const root = useRef<HTMLElement>(null);
  const n = why.items.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_DESKTOP, () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-ghost]");
        const details = gsap.utils.toArray<HTMLElement>("[data-detail]");
        const counter = root.current?.querySelector<HTMLElement>("[data-count]");
        gsap.set([...words.slice(1), ...details.slice(1)], { autoAlpha: 0, yPercent: 30 });
        let current = 0;

        const show = (next: number) => {
          if (next === current) return;
          const dir = next > current ? 1 : -1;
          const out = [words[current], details[current]];
          const into = [words[next], details[next]];
          gsap.to(out, { autoAlpha: 0, yPercent: -30 * dir, duration: 0.6, ease: "power3.out", overwrite: true });
          gsap.fromTo(
            into,
            { autoAlpha: 0, yPercent: 30 * dir },
            { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "expo.out", overwrite: true }
          );
          if (counter) counter.textContent = String(next + 1).padStart(2, "0");
          current = next;
        };

        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          onUpdate: (self) => show(Math.min(n - 1, Math.floor(self.progress * n * 0.999))),
        });
        gsap.fromTo(
          "[data-meter]",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", scrub: true } }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="why" data-flow-state="2" data-chapter="Why us" className="relative overflow-hidden">
      {/* Desktop: held stage — the big word is the heading; its description sits right below it */}
      <div className="relative z-[2] hidden h-svh lg:motion-safe:block">
        <div className={`${wrap} relative flex h-full flex-col pb-12 pt-[calc(var(--header-h)+3.5rem)]`}>
          <div className="flex items-start justify-between gap-10">
            <Pill>{why.label}</Pill>
            <p data-flow-dim className={`max-w-[30ch] text-right ${bodyText}`}>{why.title}</p>
          </div>

          <div className="flex flex-1 items-end justify-between gap-12 pb-4">
            <div className="w-full max-w-[60rem]">
              <div className="relative h-[clamp(4.5rem,10vw,10rem)] w-full">
                {WORDS.map((w, i) => (
                  <h3
                    key={w}
                    data-ghost
                    className={`absolute left-0 top-0 whitespace-nowrap text-[clamp(4rem,10vw,10rem)] font-medium leading-none tracking-[-0.045em] text-white ${i === 0 ? "" : "invisible"}`}
                  >
                    {w}
                  </h3>
                ))}
              </div>
              <div className="relative mt-8 h-[4.5rem] w-full max-w-[46ch]">
                {why.items.map((it, i) => (
                  <p key={it.title} data-detail className={`absolute inset-x-0 top-0 ${bodyText} ${i === 0 ? "" : "invisible"}`}>
                    {it.body}
                  </p>
                ))}
              </div>
            </div>

            <div data-flow-dim className="w-48 shrink-0 text-right">
              <p className="text-[clamp(2.5rem,3.6vw,3.25rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
                <span data-count>01</span>
                <span className="text-white/60">/{String(n).padStart(2, "0")}</span>
              </p>
              <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                <div data-meter className="h-full origin-left bg-electric" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones / tablets: stacked, scrolls freely */}
      <div className={`${wrap} relative z-[2] py-24 lg:motion-safe:hidden`}>
        <Pill>{why.label}</Pill>
        <SplitHeading className="mt-6 max-w-[20ch] text-[clamp(2rem,6vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em]">
          {why.title}
        </SplitHeading>
        <Reveal as="ul" items=":scope > li" className="mt-12 space-y-10">
          {why.items.map((it, i) => (
            <li key={it.title}>
              <p className="text-[14px] tabular-nums text-electric">
                {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </p>
              <SplitHeading as="h3" className="mt-2 text-[28px] font-medium tracking-[-0.025em]">{it.title}</SplitHeading>
              <p className={`mt-2 ${bodyText}`}>{it.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

