import type { ReactNode } from "react";

/** The label pill from the hero ("Innovative solutions for modern challenges"), used for every section label. */
export default function Pill({
  children,
  tone = "dark",
  live = false,
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  live?: boolean;
  className?: string;
}) {
  const light = tone === "light";
  return (
    <span
      className={`inline-flex w-fit items-center gap-2.5 rounded-full border py-1.5 pl-2.5 pr-3.5 text-[13px] font-medium backdrop-blur-md ${
        light ? "border-ink/15 bg-ink/[0.04] text-ink/75" : "border-white/15 bg-white/[0.06] text-white/80"
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {live && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-70 motion-reduce:hidden" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
      </span>
      {children}
    </span>
  );
}
