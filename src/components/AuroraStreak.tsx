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
 * Soft aurora (the original SD Innovations hero look): blurred teal / blue / violet glows on deep ink,
 * and fine light streaks with a wide halo, shaped as a bundle that fans out from the left.
 * Driven by `travel`: x/y move the composition, spin turns the streaks, s spreads them, o fades it.
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
  uniform float uLight;  // 0 = dark page, 1 = light page

  vec3 ink    = vec3(0.016, 0.022, 0.045);
  vec3 teal   = vec3(0.09, 0.50, 0.66);
  vec3 blue   = vec3(0.10, 0.24, 0.62);
  vec3 violet = vec3(0.26, 0.13, 0.46);
  vec3 core   = vec3(0.62, 0.86, 1.0);

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash2(i), f), dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
               mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)), dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
  }

  float glow(vec2 p, vec2 c, vec2 r) {
    vec2 d = (p - c) / r;
    return exp(-dot(d, d));
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) - uOffset * vec2(aspect, 1.0);
    float t = uTime * 0.04;

    // liquid: the whole field flows slowly
    vec2 flow = vec2(noise(p * 1.6 + vec2(0.0, uTime * 0.07)), noise(p * 1.6 + vec2(5.2, -uTime * 0.06)));
    p += flow * 0.06;

    // the pointer pushes the liquid aside and lights it a little
    vec2 m = uMouse - uOffset * vec2(aspect, 1.0);
    vec2 dm = p - m;
    float pull = exp(-dot(dm, dm) * 7.0);
    p += normalize(dm + 1e-4) * pull * 0.05;

    // scrolling stretches the field vertically for a moment
    p.y *= 1.0 + clamp(uVel, -1.0, 1.0) * 0.08;

    // slow-drifting aurora glows
    vec3 col = ink;
    col += teal   * 0.55 * glow(p, vec2(0.55 + 0.05 * sin(t * 3.0), 0.05 + 0.04 * cos(t * 2.0)), vec2(0.38, 0.30) * uSpread);
    col += blue   * 0.60 * glow(p, vec2(-0.35 + 0.06 * cos(t * 2.4), -0.18), vec2(0.65, 0.34) * uSpread);
    col += blue   * 0.35 * glow(p, vec2(0.25, 0.42 + 0.03 * sin(t * 2.0)), vec2(0.55, 0.22) * uSpread);
    col += violet * 0.45 * glow(p, vec2(0.05 + 0.05 * sin(t * 1.7), -0.48), vec2(0.6, 0.22) * uSpread);

    // The streak, in the original style (fine bright line, soft halo, travelling pulses),
    // now shaped as a bundle of strands that leave the left together and fan out to the right.
    float a = uAngle;
    vec2 n = vec2(-sin(a), cos(a));
    vec2 dir = vec2(cos(a), sin(a));
    float along = dot(p, dir);
    float across = dot(p, n);
    float wave = 0.035 * sin(along * 2.6 + uTime * 0.45) + 0.015 * sin(along * 5.3 - uTime * 0.7);
    float span = smoothstep(1.25 * aspect * 0.6, 0.0, abs(along + 0.1)); // fade toward the ends
    float fan = smoothstep(-0.45, 0.95, along);                          // 0 = together, 1 = spread
    float shimmer = 0.85 + 0.15 * sin(along * 6.0 - uTime * 0.6);
    float lines = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float k = (fi - 2.0) / 2.0;                                        // -1..1 across the bundle
      float c = wave + k * fan * 0.34 * uSpread
              + 0.02 * fan * sin(along * 3.1 + uTime * 0.5 + fi * 1.7);  // each strand sways a little
      float d = abs(across - c);
      float main = 1.0 - 0.45 * abs(k);                                  // outer strands are fainter
      float pulse = pow(0.5 + 0.5 * sin(along * 2.2 - uTime * 0.9 + fi * 1.1), 6.0) * 0.6;
      lines += (exp(-d * d * 2400.0) * 0.55 + exp(-d * d * 160.0) * 0.14) * main * (shimmer + pulse);
    }
    // one wide halo around the whole bundle, as before
    float dc = abs(across - wave);
    lines += exp(-dc * 9.0) * 0.12 * shimmer;
    col += mix(blue, core, 0.6) * lines * span;

    col += teal * pull * 0.08;

    // keep it low-key
    col = mix(ink, col, 0.8 * uOpacity);

    // light page: the same light, drawn as a soft blue tint on white
    vec3 g = max(col - ink, 0.0);
    float amt = clamp(dot(g, vec3(0.3, 0.45, 0.25)) * 2.4, 0.0, 0.7);
    vec3 paper = vec3(1.0);
    vec3 lightCol = mix(paper, vec3(0.58, 0.74, 1.0), amt);
    col = mix(col, lightCol, uLight);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function AuroraStreak({ reduced = false }: { reduced?: boolean }) {
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
      uLight: { value: 0 },
    }),
    []
  );

  // Eased copy of the scroll-driven target so the light glides between sections.
  const cur = useRef({ ...travel, o: 0 });
  const scroll = useRef({ y: 0, vel: 0 });

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

    // scroll velocity, smoothed and decaying back to rest
    const y = window.scrollY;
    const v = (y - scroll.current.y) / Math.max(size.height, 1) / Math.max(delta, 0.001);
    scroll.current.y = y;
    scroll.current.vel += (v * 0.15 - scroll.current.vel) * 0.1;
    m.uniforms.uVel.value = reduced ? 0 : scroll.current.vel;

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
