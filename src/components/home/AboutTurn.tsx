"use client";

import { useRef } from "react";
import { about } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { bodyText, wrap } from "@/lib/ui";
import Pill from "../Pill";

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

/** Offset of `el` from `ancestor`, from layout only (ignores transforms). */
function layoutOffset(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== ancestor) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * About, as a held scene (desktop):
 *  1. "Humanising technology!" starts huge in the centre of the screen and lands in its place.
 *  2. The story then fills in word by word — faint to full — paced by the scroll.
 * Phones scroll freely: the words fill in as they pass, no hold.
 */
export default function AboutTurn() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const ink = gsap.utils.toArray<HTMLElement>("[data-ink]");

      mm.add(DESKTOP, () => {
        const section = root.current!;
        const h = heading.current!;
        // Where the heading would need to be (and how big) to sit centred, filling the screen.
        const start = () => {
          const o = layoutOffset(h, section);
          const w = h.offsetWidth;
          const hh = h.offsetHeight;
          const s = Math.min(2.4, (window.innerWidth * 0.82) / w);
          return {
            x: window.innerWidth / 2 - (o.x + w / 2),
            y: section.offsetHeight / 2 - (o.y + hh / 2),
            scale: s,
          };
        };

        gsap.set(ink, { opacity: 0.16 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          h,
          { x: () => start().x, y: () => start().y, scale: () => start().scale },
          { x: 0, y: 0, scale: 1, duration: 0.35, ease: "power2.inOut" },
          0
        )
          .fromTo("[data-pill]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.3)
          .fromTo("[data-story]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.3)
          // the story fills in, word by word, in reading order
          .to(ink, { opacity: 1, duration: 0.04, stagger: { each: 0.55 / ink.length } }, 0.38)
          .to({}, { duration: 0.06 }); // a short rest before the section releases
      });

      mm.add(MOBILE, () => {
        gsap.fromTo(
          ink,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: { each: 0.5 / Math.max(ink.length, 1) },
            scrollTrigger: { trigger: "[data-story]", start: "top 85%", end: "bottom 55%", scrub: 1 },
          }
        );
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
      {/* black overlay at the seam with the hero, easing into the aurora */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ink to-transparent" />

      <div className={`${wrap} relative z-[2]`}>
        <p data-pill className="mb-8">
          <Pill>About SD Innovations</Pill>
        </p>
        <h2
          ref={heading}
          className="w-fit max-w-[15ch] origin-center text-[clamp(2.3rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em] will-change-transform"
        >
          {about.title}
        </h2>
        <div data-story className="mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2 md:gap-10">
          {about.paragraphs.map((p, i) => (
            <p key={i} className={bodyText}>
              {p.split(" ").map((w, wi, all) => (
                <span key={wi} data-ink>
                  {w}
                  {wi < all.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
