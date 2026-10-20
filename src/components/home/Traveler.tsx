"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { travel, type TravelState } from "@/lib/travel";

const TravelerScene = dynamic(() => import("./TravelerScene"), { ssr: false });

type Stop = { id: string; state: TravelState; at?: string };

// Where the light sits as each section arrives (desktop). x/y shift the whole aurora (fractions of
// the viewport), spin turns the streak (radians), s spreads the glows, o is overall strength.
const DESKTOP_PATH: Stop[] = [
  { id: "top", state: { x: 0.08, y: 0.06, s: 1, o: 0, spin: 0 } }, // no aurora in the hero
  { id: "about", state: { x: 0.2, y: 0.12, s: 0.95, o: 0.85, spin: 0.12 } },
  { id: "capabilities", state: { x: 0, y: -0.12, s: 1.1, o: 0.75, spin: -0.1 } },
  { id: "why", state: { x: 0, y: 0, s: 0.9, o: 0.7, spin: -0.22 } },
  { id: "work", state: { x: 0.25, y: 0.3, s: 0.8, o: 0.45, spin: 0.05 } },
  { id: "cta", state: { o: 0 }, at: "top 80%" },
];

// Phones: quieter so copy always reads.
const MOBILE_PATH: Stop[] = [
  { id: "top", state: { x: 0, y: 0.12, s: 1, o: 0, spin: 0.25 } },
  { id: "about", state: { x: 0.1, y: 0.2, s: 0.9, o: 0.6, spin: 0.3 } },
  { id: "capabilities", state: { x: 0, y: 0.1, s: 1, o: 0.55, spin: 0.15 } },
  { id: "why", state: { x: 0, y: 0, s: 0.9, o: 0.5, spin: 0.05 } },
  { id: "work", state: { x: 0.1, y: 0.25, s: 0.8, o: 0.35, spin: 0.2 } },
  { id: "cta", state: { o: 0 }, at: "top 80%" },
];

/**
 * One background element — a soft aurora with a long light streak — that travels through the
 * homepage the way Philos moves its statue. Sits behind all content.
 * Each section's arrival moves it to that section's stop, scroll-linked and smoothed;
 * the WebGL scene eases toward the target every frame.
 */
export default function Traveler() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (path: Stop[]) => {
      Object.assign(travel, path[0].state);
      for (let i = 1; i < path.length; i++) {
        const el = document.getElementById(path[i].id);
        if (!el) continue;
        gsap.fromTo(travel, { ...path[i - 1].state }, {
          ...path[i].state,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: el, start: path[i].at ?? "top bottom", end: "top top", scrub: 1 },
        });
      }
      ScrollTrigger.refresh();
    };
    mm.add("(min-width: 768px)", () => build(DESKTOP_PATH));
    mm.add("(max-width: 767px)", () => build(MOBILE_PATH));
    return () => mm.revert();
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[1]">
      <TravelerScene reduced={reduced} />
    </div>
  );
}
