"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

// Register once for the whole app.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

// Motion tokens (taste-skill motion.md / Emil's curves)
gsap.defaults({ ease: "expo.out", duration: 0.8 });

export const MOTION = "(prefers-reduced-motion: no-preference)";
export const REDUCED = "(prefers-reduced-motion: reduce)";
export const REVEAL_START = "top 88%";

export { gsap, ScrollTrigger, SplitText, useGSAP };
