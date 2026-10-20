"use client";

import { Canvas } from "@react-three/fiber";
import LightSwirl from "../LightSwirl";

/** Client-only WebGL layer for the travelling light swirl (the previous aurora is in AuroraStreak.tsx). */
export default function TravelerScene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      eventSource={document.body}
      eventPrefix="client"
      style={{ position: "absolute", inset: 0 }}
    >
      <LightSwirl reduced={reduced} />
    </Canvas>
  );
}
