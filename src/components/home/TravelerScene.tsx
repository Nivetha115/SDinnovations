"use client";

import { Canvas } from "@react-three/fiber";
import AuroraStreak from "../AuroraStreak";

/** Client-only WebGL layer for the travelling aurora streak. */
export default function TravelerScene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      eventSource={document.body}
      eventPrefix="client"
      style={{ position: "absolute", inset: 0 }}
    >
      <AuroraStreak reduced={reduced} />
    </Canvas>
  );
}
