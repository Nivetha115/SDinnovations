import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import { wrap } from "@/lib/ui";
import { about, contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description: "Work with SD Innovations — a team of tech pioneers humanising technology since 2014.",
};

const applyHref = `mailto:${contact.email}?subject=${encodeURIComponent("Careers — introduction")}`;

export default function CareersPage() {
  return (
    <main>
      <PageHero
        title="Build what's next with us."
        body={about.paragraphs[0]}
        kicker="Careers"
      />
      <section className="bg-ink py-20 md:py-32">
        <div className={`${wrap} grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-24`}>
          <Reveal>
            <SplitHeading className="max-w-[18ch] text-[clamp(2rem,4.4vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              No open roles are listed right now.
            </SplitHeading>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-white/70">
              We still like hearing from people who care about craft. Send a short note about you and
              the work you&apos;re proud of, and we&apos;ll keep you in mind as new roles open.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-col items-start gap-5">
            <a
              href={applyHref}
              className="wipe group inline-flex h-14 items-center gap-3 rounded-xl bg-white px-6 text-[16px] font-medium text-ink transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <span className="sweep bg-electric" />
              <span className="transition-colors duration-200 group-hover:text-on-accent">Introduce yourself</span>
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[15px] text-white/70 underline decoration-white/25 underline-offset-[6px] transition-colors duration-200 hover:text-white"
            >
              Follow us on LinkedIn for new roles ↗
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
