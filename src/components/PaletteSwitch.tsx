"use client";

import { useSyncExternalStore } from "react";
import { PALETTES, PALETTE_NAMES, getChosenPalette, setPalette, type PaletteName } from "@/lib/palette";

// The palette lives on <html data-palette>; re-render when it changes.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });
  return () => mo.disconnect();
}
const getServerSnapshot = (): PaletteName => "blue";

/** Swatches that switch the colour palette, in light and dark mode. */
export default function PaletteSwitch({ className = "" }: { className?: string }) {
  const chosen = useSyncExternalStore(subscribe, getChosenPalette, getServerSnapshot);

  return (
    <div role="radiogroup" aria-label="Colour palette" className={`flex items-center gap-1 ${className}`}>
      {PALETTE_NAMES.map((name) => {
        const p = PALETTES[name];
        const on = chosen === name;
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
