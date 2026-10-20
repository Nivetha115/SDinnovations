"use client";

import { useSyncExternalStore } from "react";
import { DARK_ONLY, PALETTES, PALETTE_NAMES, getChosenPalette, setPalette, type PaletteName } from "@/lib/palette";

// The palette and theme live on <html data-palette / data-theme>; re-render when either changes.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette", "data-theme"] });
  return () => mo.disconnect();
}
const getSnapshot = () => `${getChosenPalette()}|${document.documentElement.dataset.theme === "light" ? "light" : "dark"}`;
const getServerSnapshot = () => "blue|dark";

/** Swatches that switch the colour palette. Black & white is offered in dark mode only. */
export default function PaletteSwitch({ className = "" }: { className?: string }) {
  const [chosen, theme] = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).split("|") as [PaletteName, string];

  return (
    <div role="radiogroup" aria-label="Colour palette" className={`flex items-center gap-1 ${className}`}>
      {PALETTE_NAMES.filter((name) => theme !== "light" || !DARK_ONLY.includes(name)).map((name) => {
        const p = PALETTES[name];
        // in light mode a dark-only choice shows as blue
        const on = chosen === name || (theme === "light" && name === "blue" && DARK_ONLY.includes(chosen));
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={`${p.label} palette`}
            title={p.label}
            onClick={() => setPalette(name)}
            className="grid h-9 w-7 place-items-center rounded-lg transition-[background-color,transform] duration-200 hover:bg-[#f0f2f7] active:scale-[0.92]"
          >
            <span
              className={`block h-3.5 w-3.5 rounded-full transition-[box-shadow,transform] duration-300 ${on ? "scale-110" : "scale-90"}`}
              style={{
                background: p.swatch,
                boxShadow: on
                  ? `0 0 0 2px #fff, 0 0 0 3.5px ${p.ring ?? p.swatch}`
                  : `inset 0 0 0 1px ${p.ring ?? "rgba(0,0,0,0.12)"}`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
