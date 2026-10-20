"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { easeRGB, getActivePalette } from "@/lib/palette";

/**
 * Scroll-morphing light background (below the hero).
 *
 * One fixed, full-viewport layer of soft blue light ribbons that morphs into a different pattern for
 * each section and scrubs with scroll (and runs backwards on the way up):
 *   0 Drift  → 1 Gather → 2 Arc Fan → 3 Vortex → 4 Settle
 *
 * Sections opt in with attributes (no layout or style changes):
 *   data-flow-hero                      the hero; the effect fades in as it leaves
 *   data-flow-state="2"                 which pattern this section shows
 *   data-flow-calm="x,y,w,h"            optional fixed calm zone in viewport UV (0–1, from top-left)
 *   data-flow-calm-target               optional: elements whose box joins the section's calm zone
 *   data-flow-dim                       small zones dimmed to DIM_STRENGTH, one rect each
 *   data-flow-hide                      elements the light never shows behind
 *                                       (the results section hides behind its case-row list by default)
 * Without data-flow-calm, the calm zone follows the section's first h1/h2 plus any calm targets.
 *
 * Raw WebGL, one fullscreen triangle, rendered at RENDER_SCALE and upscaled by CSS.
 */

// ── Tweakable constants ────────────────────────────────────────────────────────────────────────

type FlowState = {
  count: number;   // ribbons in the family (fractional = the last one fades in)
  spacing: number; // gap between ribbons
  width: number;   // soft glow width
  core: number;    // strength of the thin highlight core
  amp: number;     // curve amplitude
  freq: number;    // curve frequency
  rot: number;     // rotation of the family (rad)
  spin: number;    // extra rotation per unit of scroll state (rotates lattice / vortex)
  cx: number;      // centre of the family (x, screen-height units, 0 = middle)
  cy: number;      // centre of the family (y, + is up)
  swirl: number;   // polar swirl strength: θ += swirl / (r + ε)
  cross: number;   // weight of a second, crossing family (lattice)
  len: number;     // how far along their length ribbons stay lit
  bright: number;  // overall brightness of the state
  twist: number;   // phase offset between neighbouring ribbons (untwists as it blends)
  dark: number;    // soft dark core at the swirl centre
  polar: number;   // 0 = straight ribbons, 1 = ribbons drawn as concentric arcs around (pcx, pcy)
  side: number;    // strength of the right-side mask (left half empty)
  pcx: number;     // arc centre, screen UV x (0–1 from the left)
  pcy: number;     // arc centre, screen UV y (0–1 from the top)
};

const STATES: FlowState[] = [
  // 0 Drift — a few long, faint diagonal beams, like light leaks
  { count: 3, spacing: 0.55, width: 0.07, core: 0.25, amp: 0.02, freq: 1.0, rot: -0.55, spin: 0.05, cx: 0, cy: 0, swirl: 0, cross: 0, len: 2.6, bright: 0.5, twist: 0, dark: 0, polar: 0, side: 0, pcx: 1.12, pcy: 0.52 },
  // 1 Gather — a bundle of parallel glossy tubes in a gentle S-curve across the top third
  { count: 7, spacing: 0.04, width: 0.022, core: 1.0, amp: 0.1, freq: 2.0, rot: 0.06, spin: 0, cx: 0, cy: 0.28, swirl: 0, cross: 0, len: 1.7, bright: 1.0, twist: 0.12, dark: 0, polar: 0, side: 0, pcx: 1.12, pcy: 0.52 },
  // 2 Arc Fan — 5 soft concentric arcs (one more per value step, up to 8) around C3 just off the
  //   right edge, ~110° each, confined to the right half; ≤ 60% of the old lattice's brightness.
  //   Arc count, rotation and pulse are driven live by the Why section's value steps (see ARC_*).
  { count: 5, spacing: 0, width: 0.028, core: 0.9, amp: 0.008, freq: 3.0, rot: 0.5, spin: 0, cx: 0, cy: 0.04, swirl: 0, cross: 0, len: 2.3, bright: 0.5, twist: 0.6, dark: 0, polar: 1, side: 1, pcx: 1.12, pcy: 0.52 },
  // 3 Vortex — the arcs twist into a slow spiral right of centre, around a soft dark core
  { count: 8, spacing: 0.06, width: 0.03, core: 0.8, amp: 0.05, freq: 2.5, rot: 0, spin: 0.3, cx: 0.32, cy: 0, swirl: 1.1, cross: 0.25, len: 2.6, bright: 0.9, twist: 0.3, dark: 1, polar: 0, side: 0, pcx: 0.697, pcy: 0.5 },
  // 4 Settle — relaxes into one soft horizontal glow band behind the CTA
  { count: 3, spacing: 0.0, width: 0.12, core: 0.15, amp: 0, freq: 1.0, rot: 0, spin: 0, cx: 0, cy: -0.05, swirl: 0, cross: 0, len: 1.8, bright: 0.45, twist: 0, dark: 0, polar: 0, side: 0, pcx: 0.697, pcy: 0.5 },
];

const BRIGHTNESS = 0.6;        // overall glow of the strands
const MAX_OPACITY = 0.5;       // the whole layer at most this opaque (its base matches the page)
const CALM_STRENGTH = 0.35;    // brightness inside a calm zone
const IDLE_SPEED = 0.02;       // rad/s of drift when the page is still
const VELOCITY_BOOST = 0.25;   // width + glow lift while scrolling fast
const RENDER_SCALE = 0.6;      // fraction of device resolution to render at
const MAX_DPR = 1.5;
// Colours come from the active palette (src/lib/palette.ts): base matches the page colour exactly,
// lift is the tint the light raises the dark toward, b1–b3 the glow, h1–h2 the highlight cores.
const GRAIN = 0.03;            // film grain against banding
const LUM_CAP = 0.08;          // max background luminance: keeps #b9c6e4 body text at ≥ 4.5:1
const HERO_FADE_START = 0.4;   // fully in once the hero's bottom edge reaches this fraction of the viewport
const FOOTER_FADE = 0.6;       // fade out over the last N viewport heights of the page
const DAMPING = 4;             // cur += (target − cur) * min(1, dt * DAMPING)
const MAX_HIDE = 2;            // fully hidden rects sent to the shader
const MAX_DIM = 2;             // dimmed rects sent to the shader
const DIM_STRENGTH = 0.3;      // light inside a data-flow-dim zone
// Arc Fan (state 2)
const ARC_R0 = 0.28;           // inner radius, in screen widths
const ARC_R1 = 0.62;           // outer radius
const ARC_GAMMA = 0.6;         // < 1: arcs dense near the inner edge, looser outside
const ARC_SWEEP = 1.92;        // ≈ 110° of sweep per arc
const ARC_TURN = 0.35;         // ≈ +20° of rotation across the section
const ARC_PULSE = 0.15;        // brightness pulse per value step, decays in 0.6s

// ── Shaders ────────────────────────────────────────────────────────────────────────────────────

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime, uPhase, uS;
uniform float uCount, uSpacing, uWidth, uCore, uAmp, uFreq, uRot, uSwirl, uCross, uLen, uBright, uTwist, uDark;
uniform vec2 uCenter, uSwirlC;
uniform float uBoost, uLight;
uniform vec4 uCalmA, uCalmB;
uniform float uCalmWA, uCalmWB, uCalmStrength;
uniform vec4 uHide[${MAX_HIDE}];
uniform vec4 uDim[${MAX_DIM}];
uniform float uDimStrength;
uniform float uPolar, uSide, uFanRot, uR0, uR1, uGamma, uSweep;
uniform vec2 uPC;
uniform vec3 uBase, uLift, uB1, uB2, uB3, uH1, uH2;
uniform float uGrain, uLumCap;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

// a family of up to 8 ribbons: soft bands around y = amp·sin(freq·x + phase) in the q frame
// Offsets: straight ribbons are evenly spaced around the centre; in polar mode they are measured
// inward from the outer arc, denser toward the inner edge (polar blends between the two).
void family(vec2 q, float len, float polar, float span, float weight, inout float G, inout float C) {
  float w = uWidth * (1.0 + uBoost);
  float cw = w * 0.16;
  float div = mix(max(uCount - 1.0, 1.0), 7.0, polar);
  float gamma = mix(1.0, uGamma, polar);
  float anchor = mix(0.5, 0.0, polar);
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float on = clamp(uCount - fi, 0.0, 1.0);
    if (on <= 0.0) continue;
    float off = (pow(fi / div, gamma) - anchor) * span;
    float ph = uPhase + fi * uTwist;
    float y = uAmp * sin(uFreq * q.x + ph);
    float sl = uAmp * uFreq * cos(uFreq * q.x + ph);
    float d = (q.y - y - off) / sqrt(1.0 + sl * sl);
    // highlights slide along the ribbons with scroll
    float slide = 0.6 + 0.4 * pow(0.5 + 0.5 * sin(q.x * 2.6 - uPhase * 2.2 + fi * 1.3), 3.0);
    float k = on * weight * slide * len;
    G += exp(-d * d / (w * w)) * k;
    C += exp(-d * d / (cw * cw)) * k * uCore;
  }
}

float inRect(vec2 uv, vec4 r, float e) {
  // r = x, y, w, h with y from the top; soft edges
  if (r.z <= 0.0) return 0.0;
  vec2 t = vec2(uv.x, 1.0 - uv.y);
  vec2 lo = r.xy, hi = r.xy + r.zw;
  return smoothstep(lo.x - e, lo.x + e, t.x) * smoothstep(hi.x + e, hi.x - e, t.x)
       * smoothstep(lo.y - e, lo.y + e, t.y) * smoothstep(hi.y + e, hi.y - e, t.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // vortex: polar swirl θ += k / (r + ε), turning further as the state advances
  vec2 d = p - uSwirlC;
  float r = length(d);
  d = rot(uSwirl / (r + 0.12) + uSwirl * uS * 0.6) * d;
  p = uSwirlC + d;

  vec2 rel = p - uCenter;
  vec2 qc = rot(uRot) * rel;

  // Arc Fan: the same ribbons in polar space around uPC — x runs along the arc, y inward from the
  // outer radius. Blending the coordinates (not two images) bends tubes into arcs and back.
  vec2 pc = vec2((uPC.x - 0.5) * aspect, 0.5 - uPC.y);
  vec2 dp = p - pc;
  float rU = length(dp) / aspect;                      // radius in screen widths
  float ang = atan(dp.y, -dp.x) - uFanRot;             // 0 = pointing left, into the screen
  vec2 qp = vec2(ang * uR1 * aspect, (uR1 - rU) * aspect);
  vec2 q = mix(qc, qp, uPolar);
  float lenC = exp(-qc.x * qc.x / (uLen * uLen));
  float angM = smoothstep(uSweep * 0.5, uSweep * 0.5 - 0.4, abs(ang));   // partial arcs, soft ends
  float span = mix((uCount - 1.0) * uSpacing, (uR1 - uR0) * aspect, uPolar);

  float G = 0.0, C = 0.0;
  family(q, mix(lenC, angM, uPolar), uPolar, span, 1.0, G, C);
  if (uCross > 0.001) family(rot(uRot + 1.15) * rel, lenC, 0.0, (uCount - 1.0) * uSpacing, uCross, G, C);

  // right-side mask: the left half stays empty while the fan is up
  float sideM = mix(1.0, smoothstep(0.48, 0.70, uv.x), uSide);
  G *= sideM; C *= sideM;

  float hole = mix(1.0, smoothstep(0.04, 0.3, r), uDark);
  float B = uBright * (1.0 + uBoost) * hole;
  G *= B; C *= B;

  vec3 col = uBase;
  col += (uLift - uBase) * clamp(G * 1.5, 0.0, 1.0);
  vec3 glowC = mix(uB1, uB2, smoothstep(0.0, 0.8, G));
  glowC = mix(glowC, uB3, smoothstep(0.8, 2.0, G));
  col += glowC * (1.0 - exp(-G * 0.9));
  col += mix(uH1, uH2, smoothstep(0.0, 1.5, C)) * (1.0 - exp(-C * 0.8)) * 0.8;

  // calm zones: the light behind headlines and text columns drops to CALM_STRENGTH
  float calm = max(uCalmWA * inRect(uv, uCalmA, 0.06), uCalmWB * inRect(uv, uCalmB, 0.06));
  col = uBase + (col - uBase) * mix(1.0, uCalmStrength, calm);

  // dimmed zones (e.g. the tagline and the 01/04 counter)
  float dim = 0.0;
  for (int i = 0; i < ${MAX_DIM}; i++) dim = max(dim, inRect(uv, uDim[i], 0.04));
  col = uBase + (col - uBase) * mix(1.0, uDimStrength, dim);

  // hidden zones: no light at all behind these
  float hide = 0.0;
  for (int i = 0; i < ${MAX_HIDE}; i++) hide = max(hide, inRect(uv, uHide[i], 0.005));
  col = mix(col, uBase, hide);

  // cap luminance so body copy keeps its contrast everywhere
  vec3 lin = pow(max(col, 0.0), vec3(2.2));
  float L = dot(lin, vec3(0.2126, 0.7152, 0.0722));
  if (L > uLumCap) col = pow(lin * (uLumCap / L), vec3(1.0 / 2.2));

  // film grain
  float n = fract(sin(dot(gl_FragCoord.xy + fract(uTime) * 61.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  col += n * uGrain * 0.5;

  // light page: the same light as a soft tint of the palette on white
  float amt = clamp(dot(max(col - uBase, 0.0), vec3(0.3, 0.45, 0.25)) * 3.0, 0.0, 0.45);
  col = mix(col, mix(vec3(1.0), mix(vec3(1.0), uB3, 0.45), amt), uLight);

  gl_FragColor = vec4(col, 1.0);
}
`;

// ── Helpers ────────────────────────────────────────────────────────────────────────────────────

const KEYS = Object.keys(STATES[0]) as (keyof FlowState)[];
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function stateAt(s: number): FlowState {
  const i = Math.min(STATES.length - 2, Math.max(0, Math.floor(s)));
  const f = smooth(clamp01(s - i));
  const a = STATES[i], b = STATES[i + 1];
  const out = {} as FlowState;
  for (const k of KEYS) out[k] = a[k] + (b[k] - a[k]) * f;
  return out;
}

// pinned sections live inside a GSAP pin-spacer; measure that so progress follows real scroll
const box = (el: Element) => {
  const parent = el.parentElement;
  return (parent?.classList.contains("pin-spacer") ? parent : el).getBoundingClientRect();
};

const NO_RECT: [number, number, number, number] = [0, 0, 0, 0];

function calmRect(section: Element | undefined, vw: number, vh: number): [number, number, number, number] {
  if (!section) return NO_RECT;
  const fixed = section.getAttribute("data-flow-calm");
  if (fixed) {
    const v = fixed.split(",").map(Number);
    if (v.length === 4 && v.every(Number.isFinite)) return v as [number, number, number, number];
  }
  // the first heading actually on screen (sections can hold a phone and a desktop version)
  const heading = [...section.querySelectorAll("h1, h2")].find((e) => (e as HTMLElement).offsetParent !== null);
  const els = [heading, ...section.querySelectorAll("[data-flow-calm-target]")].filter(
    (e): e is Element => !!e && (e as HTMLElement).offsetParent !== null
  );
  if (!els.length) return NO_RECT;
  let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
  for (const e of els) {
    const rc = e.getBoundingClientRect();
    l = Math.min(l, rc.left); t = Math.min(t, rc.top); r = Math.max(r, rc.right); b = Math.max(b, rc.bottom);
  }
  const pad = 24;
  return [(l - pad) / vw, (t - pad) / vh, (r - l + pad * 2) / vw, (b - t + pad * 2) / vh];
}

// elements the light never shows behind (or is dimmed behind), for the sections on screen
function zoneRects(sections: HTMLElement[], states: number[], vw: number, vh: number, attr: string, max: number): Float32Array {
  const out = new Float32Array(max * 4);
  let n = 0;
  sections.forEach((section, i) => {
    const els = [...section.querySelectorAll(`[${attr}]`)].filter((e) => (e as HTMLElement).offsetParent !== null);
    if (attr === "data-flow-hide" && states[i] === 3 && !els.length) {
      const list = section.querySelector("ul");
      if (list) els.push(list);
    }
    for (const el of els) {
      if (n >= max) return;
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= vh || r.width <= 0) continue;
      out.set([r.left / vw, r.top / vh, r.width / vw, r.height / vh], n * 4);
      n++;
    }
  });
  return out;
}

// ── Styles (inline so the layer never depends on a stylesheet) ──────────────────────────────────
// Fixed behind all content and never takes the pointer; 100lvh tall so mobile toolbars don't resize
// it while scrolling.
const WRAP: CSSProperties = { position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" };
const LAYER: CSSProperties = { position: "absolute", left: 0, top: 0, width: "100%", height: "100lvh", opacity: 0 };
// without WebGL: a few blurred glows in the same blues
const FALLBACK: CSSProperties = {
  background: [
    "radial-gradient(40% 30% at 75% 25%, rgba(31, 79, 255, 0.22), transparent 70%)",
    "radial-gradient(45% 35% at 20% 70%, rgba(11, 47, 168, 0.28), transparent 70%)",
    "radial-gradient(30% 20% at 60% 80%, rgba(77, 139, 255, 0.12), transparent 70%)",
    "var(--page)",
  ].join(", "),
  filter: "blur(20px)",
};

// ── Component ──────────────────────────────────────────────────────────────────────────────────

export default function FlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [noGL, setNoGL] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) setNoGL(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // ── GL setup
    let prog: WebGLProgram | null = null;
    const U: Record<string, WebGLUniformLocation | null> = {};
    if (gl) {
      const sh = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
        return s;
      };
      prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const name of [
        "uRes", "uTime", "uPhase", "uS", "uCount", "uSpacing", "uWidth", "uCore", "uAmp", "uFreq", "uRot",
        "uSwirl", "uCross", "uLen", "uBright", "uTwist", "uDark", "uCenter", "uSwirlC", "uBoost", "uLight",
        "uCalmA", "uCalmB", "uCalmWA", "uCalmWB", "uCalmStrength", "uHide", "uDim", "uDimStrength", "uPolar", "uSide", "uFanRot", "uR0", "uR1", "uGamma", "uSweep", "uPC", "uBase", "uLift", "uB1", "uB2", "uB3",
        "uH1", "uH2", "uGrain", "uLumCap",
      ]) U[name] = gl.getUniformLocation(prog, name);
      gl.uniform1f(U.uCalmStrength, CALM_STRENGTH);
      gl.uniform1f(U.uGrain, GRAIN);
      gl.uniform1f(U.uLumCap, LUM_CAP);
      gl.uniform2f(U.uSwirlC, 0.35, 0.0);
      gl.uniform1f(U.uDimStrength, DIM_STRENGTH);
      gl.uniform1f(U.uR0, ARC_R0);
      gl.uniform1f(U.uR1, ARC_R1);
      gl.uniform1f(U.uGamma, ARC_GAMMA);
      gl.uniform1f(U.uSweep, ARC_SWEEP);
    }
    // live palette colours, eased toward the active palette each frame
    const colours = Object.fromEntries(
      Object.entries(getActivePalette().flow).map(([key, v]) => [key, [...v]])
    ) as Record<string, number[]>;

    // ── Size: only when the canvas box changes (it is 100lvh tall, so mobile toolbars don't resize it)
    const resize = () => {
      if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * RENDER_SCALE;
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // always (re)send: a remount reuses the same context and canvas size with a fresh program
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.uRes, w, h);
    };
    const ro = new ResizeObserver(() => {
      resize();
      wake();
    });
    ro.observe(canvas);

    // ── Scroll-driven state
    const cur = { s: 0, phase: 0, opacity: 0, boost: 0, light: 0, fan: 0, arcs: 0, step: 0, pulse: 0 };
    let time = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;
    let running = false;

    const targets = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const y = window.scrollY;
      const sections = [...document.querySelectorAll<HTMLElement>("[data-flow-state]")];
      const states = sections.map((el) => Number(el.dataset.flowState) || 0);

      // s: the first section's state, plus each next section's entry progress (0 when its top is at the
      // bottom of the viewport, 1 when it reaches the top) times its step
      let s = states[0] ?? 0;
      for (let i = 1; i < sections.length; i++) {
        const p = clamp01((vh - box(sections[i]).top) / vh);
        s += (states[i] - states[i - 1]) * p;
      }

      // calm zones of the two sections being blended
      const base = Math.floor(s);
      const f = s - base;
      const idx = (st: number) => states.findIndex((v) => v === st);
      const calmA = calmRect(sections[idx(base)], vw, vh);
      const calmB = calmRect(sections[idx(Math.min(base + 1, STATES.length - 1))], vw, vh);
      const hide = zoneRects(sections, states, vw, vh, "data-flow-hide", MAX_HIDE);
      const dim = zoneRects(sections, states, vw, vh, "data-flow-dim", MAX_DIM);

      // Arc Fan: progress through the (pinned) Why section drives rotation and value steps
      const why = sections[idx(2)];
      let fan = 0;
      let step = 0;
      if (why) {
        const b = box(why);
        fan = clamp01(-b.top / Math.max(b.height - vh, 1));
        step = b.top > 0 ? 0 : Math.min(3, Math.floor(fan * 4 * 0.999));
      }

      // fade in as the hero leaves, out over the end of the page
      const hero = document.querySelector("[data-flow-hero]");
      let o = 1;
      if (hero) {
        const bottom = hero.getBoundingClientRect().bottom;
        o = clamp01((vh - bottom) / (vh * (1 - HERO_FADE_START)));
      }
      const remaining = document.documentElement.scrollHeight - (y + vh);
      o *= clamp01(remaining / (vh * FOOTER_FADE));

      return { s, o, y, vh, calmA, calmB, wA: 1 - f, wB: f, hide, dim, fan, step };
    };

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = targets();
      const k = Math.min(1, dt * DAMPING);
      const still = reduced.matches;

      cur.s += (t.s - cur.s) * k;
      cur.opacity += (t.o - cur.opacity) * k;
      cur.phase += ((t.y / t.vh) * 0.8 - cur.phase) * k;
      const vel = Math.abs(t.y - lastY) / t.vh / Math.max(dt, 0.001);
      lastY = t.y;
      // velocity lift: rises with fast scroll, decays over ~0.5s
      const boostTarget = still ? 0 : Math.min(1, vel * 0.5) * VELOCITY_BOOST;
      cur.boost = Math.max(boostTarget, cur.boost - (dt / 0.5) * VELOCITY_BOOST);
      if (!still) time += dt;

      // Arc Fan: one more arc per value step (from the inside), with a short pulse on each step
      cur.fan += (t.fan - cur.fan) * k;
      cur.arcs += (t.step - cur.arcs) * k;
      if (t.step > cur.step && !still) cur.pulse = 1;
      cur.step = t.step;
      cur.pulse = Math.max(0, cur.pulse - dt / 0.6);
      const flow = getActivePalette().flow;
      for (const [key, v] of Object.entries(flow)) easeRGB(colours[key], v, Math.min(1, dt * 6));
      const lightTarget = document.documentElement.dataset.theme === "light" ? 1 : 0;
      cur.light += (lightTarget - cur.light) * Math.min(1, dt * 6);

      const layer = gl ? canvas : fallbackRef.current;
      if (layer) layer.style.opacity = (cur.opacity * MAX_OPACITY).toFixed(3);

      if (gl && cur.opacity > 0.002) {
        const st = stateAt(cur.s);
        const wFan = clamp01(1 - Math.abs(cur.s - 2)); // how much of the Arc Fan is showing
        st.count += cur.arcs * wFan;
        st.bright *= 1 + ARC_PULSE * cur.pulse * wFan;
        // idle: highlights keep sliding; the pattern sways gently (peak IDLE_SPEED rad/s) instead of
        // turning further and further
        const idle = time * IDLE_SPEED;
        const sway = 0.12 * Math.sin((time * IDLE_SPEED) / 0.12);
        gl.uniform1f(U.uTime, time);
        gl.uniform1f(U.uPhase, cur.phase + idle);
        gl.uniform1f(U.uS, cur.s);
        gl.uniform1f(U.uCount, st.count);
        gl.uniform1f(U.uSpacing, st.spacing);
        gl.uniform1f(U.uWidth, st.width);
        gl.uniform1f(U.uCore, st.core);
        gl.uniform1f(U.uAmp, st.amp);
        gl.uniform1f(U.uFreq, st.freq);
        gl.uniform1f(U.uRot, st.rot + st.spin * cur.s + sway);
        gl.uniform1f(U.uSwirl, st.swirl);
        gl.uniform1f(U.uCross, st.cross);
        gl.uniform1f(U.uLen, st.len);
        gl.uniform1f(U.uBright, st.bright * BRIGHTNESS);
        gl.uniform1f(U.uTwist, st.twist);
        gl.uniform1f(U.uDark, st.dark);
        gl.uniform2f(U.uCenter, st.cx, st.cy);
        gl.uniform1f(U.uBoost, cur.boost);
        gl.uniform1f(U.uLight, cur.light);
        for (const [key, v] of Object.entries(colours)) gl.uniform3fv(U["u" + key[0].toUpperCase() + key.slice(1)], v);
        gl.uniform4fv(U.uCalmA, t.calmA);
        gl.uniform4fv(U.uCalmB, t.calmB);
        gl.uniform1f(U.uCalmWA, t.wA);
        gl.uniform1f(U.uCalmWB, t.wB);
        gl.uniform4fv(U.uHide, t.hide);
        gl.uniform4fv(U.uDim, t.dim);
        gl.uniform1f(U.uPolar, st.polar);
        gl.uniform1f(U.uSide, st.side);
        gl.uniform2f(U.uPC, st.pcx, st.pcy);
        gl.uniform1f(U.uFanRot, ARC_TURN * cur.fan + sway);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      // sleep when hidden, or when invisible and settled; scroll / resize wakes it
      const settled = t.o === 0 && cur.opacity < 0.002;
      if (document.hidden || settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    function wake() {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    resize();
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    document.addEventListener("visibilitychange", wake);
    const themeObserver = new MutationObserver(wake);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", wake);
      if (gl && prog) gl.deleteProgram(prog);
    };
  }, []);

  return (
    <div aria-hidden style={WRAP}>
      <canvas ref={canvasRef} style={{ ...LAYER, display: noGL ? "none" : "block" }} />
      {noGL && <div ref={fallbackRef} style={{ ...LAYER, ...FALLBACK }} />}
    </div>
  );
}
