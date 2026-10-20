"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger stays in sync.
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return;

    // Philos-like glide (they use 0.075); slightly firmer so it never feels hard to stop.
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, anchors: { offset: 0 } });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Web fonts change line lengths; re-measure pins once they're in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page: start at the top (unless linking to an anchor), then
  // measure triggers again once its layout has settled.
  useEffect(() => {
    if (!window.location.hash) {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
