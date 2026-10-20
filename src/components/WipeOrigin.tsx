"use client";

import { useEffect } from "react";

/**
 * Buttons with `.wipe` fill on hover with a circle that grows from where the pointer came in
 * (and shrinks back toward where it left). This records that point as --wx / --wy on the button.
 */
export default function WipeOrigin() {
  useEffect(() => {
    const mark = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".wipe");
      if (!el || el.contains(e.relatedTarget as Node | null)) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--wx", `${e.clientX - r.left}px`);
      el.style.setProperty("--wy", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointerover", mark);
    document.addEventListener("pointerout", mark);
    return () => {
      document.removeEventListener("pointerover", mark);
      document.removeEventListener("pointerout", mark);
    };
  }, []);
  return null;
}
