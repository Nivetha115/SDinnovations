"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element is near the viewport — used to pause WebGL that can't be seen. */
export function useOnScreen(ref: RefObject<Element | null>, margin = "200px") {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return on;
}
