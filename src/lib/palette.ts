/**
 * Colour palettes. The CSS side lives in globals.css (the --p-* tokens); this file
 * holds the same palettes for the WebGL backgrounds, plus the switch itself.
 * The choice lives on <html data-palette>, set before paint by the script in layout.tsx.
 * Every palette works in both themes (light mode uses deeper accents; see globals.css).
 */

export type PaletteName = "blue" | "orange" | "emerald" | "mono";
export const PALETTE_NAMES: PaletteName[] = ["mono", "blue", "orange", "emerald"]; // switcher order

type RGB = [number, number, number];

export type Palette = {
  label: string;
  swatch: string; // the accent, for the switcher
  ring?: string;  // swatch outline when the swatch itself is near-white or near-black
  /** Hero sky (SkyCanvas): the field drifts from `a` to `b`; `beam` tints the light beam. */
  sky: { a: RGB; b: RGB; beam: RGB };
  /** Background ribbons (FlowBackground): `base` matches the page colour exactly. */
  flow: { base: RGB; lift: RGB; b1: RGB; b2: RGB; b3: RGB; h1: RGB; h2: RGB };
  /**
   * Background brightness for this palette: `gain` multiplies the strands, `cap` is the peak
   * luminance before the layer's opacity (see FlowBackground). Grey light reads much fainter than
   * coloured light, so black & white gets more of both. Defaults: gain 1, cap LUM_CAP.
   */
  flowGain?: number;
  flowCap?: number;
};

const rgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as RGB;

export const PALETTES: Record<PaletteName, Palette> = {
  blue: {
    label: "Blue",
    swatch: "#0099ff",
    sky: { a: rgb("#0c63fd"), b: rgb("#03d8fd"), beam: [0.65, 0.8, 0.95] },
    flow: {
      base: rgb("#04060d"),
      lift: rgb("#04102e"),
      b1: rgb("#0b2fa8"),
      b2: rgb("#1f4fff"),
      b3: rgb("#4d8bff"),
      h1: rgb("#9cc4ff"),
      h2: rgb("#dbe8ff"),
    },
  },
  orange: {
    label: "Orange",
    swatch: "#e85002",
    // the branding gradient: deep red #C10801 into orange #F16001, beam warmed toward #D9C3AB
    sky: { a: rgb("#c10801"), b: rgb("#f16001"), beam: rgb("#d9c3ab") },
    flow: {
      base: rgb("#000000"),
      lift: rgb("#1a0601"),
      b1: rgb("#c10801"),
      b2: rgb("#e85002"),
      b3: rgb("#f16001"),
      h1: rgb("#f5a46b"),
      h2: rgb("#f9e3d2"),
    },
  },
  emerald: {
    label: "Emerald",
    swatch: "#06d6a0",
    // Brunswick Green into Emerald, beam toward Polar
    sky: { a: rgb("#0a8f6c"), b: rgb("#06d6a0"), beam: rgb("#e6fbf6") },
    flow: {
      base: rgb("#03110e"),
      lift: rgb("#062a22"),
      b1: rgb("#0c4137"),
      b2: rgb("#0a8f6c"),
      b3: rgb("#06d6a0"),
      h1: rgb("#7fe9cb"),
      h2: rgb("#e6fbf6"),
    },
  },
  mono: {
    label: "Black & white",
    swatch: "linear-gradient(135deg, #000 50%, #fff 50%)",
    ring: "rgba(0,0,0,0.35)",
    sky: { a: rgb("#3a3a3a"), b: rgb("#9a9a9a"), beam: rgb("#ffffff") },
    flow: {
      base: rgb("#000000"),
      lift: rgb("#111111"),
      b1: rgb("#5a5a5a"),
      b2: rgb("#9a9a9a"),
      b3: rgb("#d4d4d4"),
      h1: rgb("#f0f0f0"),
      h2: rgb("#ffffff"),
    },
    // after the layer's 50% opacity this peaks around 8% luminance — still dark enough behind text
    flowGain: 2.2,
    flowCap: 0.34,
  },
};

const isName = (v: unknown): v is PaletteName => PALETTE_NAMES.includes(v as PaletteName);

/** The palette the visitor picked (whatever the theme). */
export function getChosenPalette(): PaletteName {
  if (typeof document === "undefined") return "blue";
  const v = document.documentElement.dataset.palette;
  return isName(v) ? v : "blue";
}

/** The palette on screen. */
export function getActivePalette(): Palette {
  return PALETTES[getChosenPalette()];
}

export function setPalette(next: PaletteName) {
  const d = document.documentElement;
  d.classList.add("theme-switching");
  d.dataset.palette = next;
  try {
    localStorage.setItem("palette", next);
  } catch {}
  window.setTimeout(() => d.classList.remove("theme-switching"), 450);
}

/** Ease `cur` toward `target` in place (for smooth colour changes in the shaders). */
export function easeRGB(cur: number[], target: readonly number[], k: number) {
  for (let i = 0; i < 3; i++) cur[i] += (target[i] - cur[i]) * k;
}
