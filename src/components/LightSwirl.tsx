"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { travel } from "@/lib/travel";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/**
 * Swirling streaks of light in the aurora's texture: fine bright lines with soft halos over
 * blurred teal / blue / violet glows. The streaks arc around the edges of the screen, bend
 * continuously (it plays like footage) and morph with scroll.
 * Driven by `travel`: x/y move the composition, spin turns it, s scales it, o fades it.
 */
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uOffset;
  uniform float uAngle;
  uniform float uSpread;
  uniform float uOpacity;
  uniform vec2 uMouse;   // pointer in the same space as p
  uniform float uVel;    // smoothed scroll velocity
  uniform float uScroll; // eased page scroll, in screen heights
  uniform float uLight;  // 0 = dark page, 1 = light page

  vec3 ink    = vec3(0.016, 0.022, 0.045);
  vec3 teal   = vec3(0.09, 0.50, 0.66);
  vec3 blue   = vec3(0.10, 0.24, 0.62);
  vec3 violet = vec3(0.26, 0.13, 0.46);
  vec3 core   = vec3(0.62, 0.86, 1.0);

  float glow(vec2 p, vec2 c, vec2 r) {
    vec2 d = (p - c) / r;
    return exp(-dot(d, d));
  }

  // One swirling streak of light: an arc around centre c with radius r, drawn in the aurora's
  // texture (fine bright line, soft halo, wide glow). Time and scroll both bend it.
  float streak(vec2 p, vec2 c, float r, float ph) {
    float T = uTime * 0.3 + uScroll * 1.5;
    vec2 d = p - c;
    float th = atan(d.y, d.x);
    float rr = r * (1.0 + 0.06 * sin(uScroll * 1.3 + ph))
             + 0.08 * sin(th * 3.0 + ph + T) + 0.04 * sin(th * 5.0 - T * 1.3 + ph * 2.0);
    float dd = length(d) - rr;
    // brightness swells and fades along the arc, like a ribbon of light turning
    float turn = 0.45 + 0.55 * (0.5 + 0.5 * sin(th * 2.0 + ph + T * 0.8));
    float pulse = pow(0.5 + 0.5 * sin(th * 6.0 - uTime * 0.9 + ph), 6.0) * 0.5;
    float line = exp(-dd * dd * 2400.0) * 0.55 + exp(-dd * dd * 160.0) * 0.28 + exp(-abs(dd) * 9.0) * 0.10;
    return line * (turn * 0.85 + pulse);
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) - uOffset * vec2(aspect, 1.0);
    float t = uTime * 0.04;

    // the pointer pushes the light aside a little
    vec2 m = uMouse - uOffset * vec2(aspect, 1.0);
    vec2 dm = p - m;
    float pull = exp(-dot(dm, dm) * 7.0);
    p += dm * pull * 0.1;

    // scrolling stretches the field vertically for a moment
    p.y *= 1.0 + clamp(uVel, -1.0, 1.0) * 0.08;

    // spin and scale the whole composition
    float sa = uAngle - 0.22, ca = cos(sa), sn = sin(sa);
    p = vec2(ca * p.x + sn * p.y, -sn * p.x + ca * p.y) / max(uSpread, 0.2);

    // slow-drifting aurora glows, as before
    vec3 col = ink;
    col += teal   * 0.45 * glow(p, vec2(0.55 + 0.05 * sin(t * 3.0), 0.05 + 0.04 * cos(t * 2.0)), vec2(0.38, 0.30));
    col += blue   * 0.55 * glow(p, vec2(-0.35 + 0.06 * cos(t * 2.4), -0.18), vec2(0.65, 0.34));
    col += blue   * 0.30 * glow(p, vec2(0.25, 0.42 + 0.03 * sin(t * 2.0)), vec2(0.55, 0.22));
    col += violet * 0.45 * glow(p, vec2(0.05 + 0.05 * sin(t * 1.7), -0.48), vec2(0.6, 0.22));

    // swirling streaks framing the screen: over the top from both sides, down the sides, low across the bottom
    vec3 lightA = mix(blue, core, 0.6);
    vec3 lightB = mix(violet, core, 0.45);
    vec3 lightC = mix(teal, core, 0.5);
    col += lightA * streak(p, vec2(-0.95, -1.15), 1.40, 0.0);
    col += lightB * streak(p, vec2(1.05, -1.05), 1.32, 2.1);
    col += lightC * streak(p, vec2(-1.65, 0.25), 1.02, 4.2) * 0.8;
    col += lightA * streak(p, vec2(1.75, -0.15), 1.08, 1.3) * 0.8;
    col += lightB * streak(p, vec2(0.25, 1.65), 1.52, 3.4) * 0.7;

    col += teal * pull * 0.08;

    // keep it low-key
    col = mix(ink, col, 0.8 * uOpacity);

    // light page: the same light, drawn as a soft blue tint on white
    vec3 g = max(col - ink, 0.0);
    float amt = clamp(dot(g, vec3(0.3, 0.45, 0.25)) * 2.4, 0.0, 0.7);
    vec3 lightCol = mix(vec3(1.0), vec3(0.58, 0.74, 1.0), amt);
    col = mix(col, lightCol, uLight);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function LightSwirl({ reduced = false }: { reduced?: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, gl } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 12 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2(travel.x, travel.y) },
      uAngle: { value: 0.22 },
      uSpread: { value: 1 },
      uOpacity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uVel: { value: 0 },
      uScroll: { value: 0 },
      uLight: { value: 0 },
    }),
    []
  );

  // Eased copy of the scroll-driven target so the light glides between sections.
  const cur = useRef({ ...travel, o: 0 });
  const scroll = useRef({ y: 0, vel: 0, eased: 0 });

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    const k = 1 - Math.pow(0.002, Math.min(delta, 0.05));
    const c = cur.current;
    (Object.keys(travel) as (keyof typeof travel)[]).forEach((key) => {
      c[key] += (travel[key] - c[key]) * k;
    });
    const dpr = gl.getPixelRatio();
    m.uniforms.uRes.value.set(size.width * dpr, size.height * dpr);
    if (!reduced) m.uniforms.uTime.value += delta;
    m.uniforms.uOffset.value.set(c.x, c.y);
    m.uniforms.uAngle.value = 0.22 + c.spin;
    m.uniforms.uSpread.value = c.s;
    m.uniforms.uOpacity.value = c.o;

    // pointer (-1..1) → aspect-corrected field space, eased for a liquid lag
    const aspect = size.width / size.height;
    const target = new THREE.Vector2(state.pointer.x * 0.5 * aspect, state.pointer.y * 0.5);
    m.uniforms.uMouse.value.lerp(target, reduced ? 0 : 0.06);

    // scroll: velocity (smoothed, decaying back to rest) and an eased position for the morph
    const y = window.scrollY;
    const h = Math.max(size.height, 1);
    const v = (y - scroll.current.y) / h / Math.max(delta, 0.001);
    scroll.current.y = y;
    scroll.current.vel += (v * 0.15 - scroll.current.vel) * 0.1;
    scroll.current.eased += (y / h - scroll.current.eased) * k;
    m.uniforms.uVel.value = reduced ? 0 : scroll.current.vel;
    m.uniforms.uScroll.value = reduced ? 0 : scroll.current.eased;

    // follow the page theme, cross-fading over ~0.4s
    const lightTarget = document.documentElement.dataset.theme === "light" ? 1 : 0;
    m.uniforms.uLight.value += (lightTarget - m.uniforms.uLight.value) * Math.min(1, delta * 6);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}
