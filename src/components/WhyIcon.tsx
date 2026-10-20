/**
 * Line icons for the "Why SD Innovations" points. Every stroke has pathLength=1 so CSS can
 * redraw it on hover (see .draw-icon in globals.css).
 */
export type WhyIconName = "team" | "agile" | "quality" | "partnership";

const P = { pathLength: 1, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function WhyIcon({ name, className = "" }: { name: WhyIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`draw-icon ${className}`}>
      {name === "team" && (
        <>
          <circle {...P} cx="9" cy="8" r="3.2" />
          <path {...P} d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <circle {...P} cx="17" cy="9" r="2.4" />
          <path {...P} d="M16 14.3c2.9.3 5 2.6 5 5.7" />
        </>
      )}
      {name === "agile" && (
        <>
          <path {...P} d="M20 12a8 8 0 1 1-2.35-5.66" />
          <path {...P} d="M20 4v4.5h-4.5" />
          <path {...P} d="M12 8v4l2.5 2" />
        </>
      )}
      {name === "quality" && (
        <>
          <path {...P} d="M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z" />
          <path {...P} d="M8.6 12.2l2.4 2.4 4.4-4.8" />
        </>
      )}
      {name === "partnership" && (
        <>
          <circle {...P} cx="9" cy="12" r="5" />
          <circle {...P} cx="15" cy="12" r="5" />
        </>
      )}
    </svg>
  );
}
