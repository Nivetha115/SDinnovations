"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// The theme lives on <html data-theme>, set before paint by the script in layout.tsx.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const getServerTheme = (): Theme => "dark";

export function setTheme(next: Theme) {
  const d = document.documentElement;
  d.classList.add("theme-switching");
  d.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
  window.setTimeout(() => d.classList.remove("theme-switching"), 450);
}

/** Sun / moon switch. Remembers the visitor's choice; first visit follows the system setting. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const light = theme === "light";
  return (
    <button
      type="button"
      onClick={() => setTheme(light ? "dark" : "light")}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Dark mode" : "Light mode"}
      className={`relative grid h-9 w-9 place-items-center rounded-lg text-ink transition-[background-color,transform] duration-200 hover:bg-[#f0f2f7] active:scale-[0.94] ${className}`}
    >
      {/* sun */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={`absolute h-[18px] w-[18px] transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
          light ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
      {/* moon */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={`absolute h-[18px] w-[18px] transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
          light ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    </button>
  );
}
