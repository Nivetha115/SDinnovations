import Link from "next/link";
import SplitHeading from "@/components/motion/SplitHeading";

export default function NotFound() {
  return (
    <main className="flex min-h-[80svh] flex-col justify-end bg-ink px-5 pb-20 pt-40 md:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <SplitHeading as="h1" load className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[1] tracking-[-0.035em]">
          {"This page doesn't exist."}
        </SplitHeading>
        <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-white/70">
          The link may be old or mistyped. Head back home, or see what we do.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex h-14 items-center rounded-xl bg-white px-6 font-medium text-ink active:scale-[0.97]">
            Go home
          </Link>
          <Link href="/services" className="inline-flex h-14 items-center rounded-xl border border-white/25 px-6 font-medium text-white hover:border-white active:scale-[0.97]">
            Our services
          </Link>
        </div>
      </div>
    </main>
  );
}
