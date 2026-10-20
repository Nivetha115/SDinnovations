import Pill from "./Pill";

/** Section label: the hero's pill style, used across every page. */
export default function SectionLabel({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return <Pill tone={tone}>{children}</Pill>;
}
