"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useOnScreen } from "@/lib/useOnScreen";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/**
 * Hero sky, matched to the reference (sterling.framer.media) by sampled colour:
 * a slowly moving field between royal blue (#0c63fd) and cyan (#03d8fd), darkened by a
 * vertical fade to near-black at the bottom, with a soft diagonal light beam top-left.
 * Our own shader — no third-party code or assets.
 */
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;

  vec3 royal = vec3(0.047, 0.388, 0.992);
  vec3 cyan  = vec3(0.012, 0.847, 0.992);

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1,0)), f - vec2(1,0)), u.x),
               mix(dot(hash(i + vec2(0,1)), f - vec2(0,1)), dot(hash(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;                 // y = 1 at the top
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * aspect, uv.y);
    float t = uTime * 0.05;

    // hue: royal on the left drifting to cyan on the right, with slow liquid variation
    float field = uv.x * 0.7 + fbm(p * 1.3 + vec2(t, -t * 0.6)) * 0.7 + 0.06 * sin(t * 2.0 + uv.y * 3.0) - 0.08;
    vec3 col = mix(royal, cyan, clamp(field, 0.0, 1.0));

    // the reference darkens almost linearly from top (bright) to bottom (near black)
    float fromTop = 1.0 - uv.y;
    float shade = pow(clamp(1.0 - fromTop, 0.0, 1.0), 1.05);
    col *= shade;

    // soft diagonal light beam, top-left, slowly breathing
    vec2 b = p - vec2(0.18 * aspect, 0.88);
    float ang = 0.95;
    float d = abs(dot(b, vec2(-sin(ang), cos(ang))));
    float along = dot(b, vec2(cos(ang), sin(ang)));
    float beam = exp(-d * d * 260.0) * smoothstep(0.55, 0.0, abs(along)) * (0.55 + 0.15 * sin(uTime * 0.4));
    col += vec3(0.65, 0.8, 0.95) * beam * shade;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Sky({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, gl } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 6 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );
  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    const dpr = gl.getPixelRatio();
    m.uniforms.uRes.value.set(size.width * dpr, size.height * dpr);
    if (!reduced) m.uniforms.uTime.value += delta;
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export default function SkyCanvas() {
  const box = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(box);
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div ref={box} aria-hidden style={{ position: "absolute", inset: 0 }}>
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1]} gl={{ antialias: false }} style={{ position: "absolute", inset: 0 }}>
        <Sky reduced={reduced} />
      </Canvas>
    </div>
  );
}
