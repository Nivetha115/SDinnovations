import Link from "next/link";
import SplitHeading from "./motion/SplitHeading";
import Reveal from "./motion/Reveal";
import { wrap } from "@/lib/ui";
import { contact } from "@/lib/content";

/**
 * The live sdinnovations.co legal pages are currently empty, so this shows a clear holding notice.
 * Replace the holding text with the approved legal text before launch.
 */
export default function LegalPage({ title, topic }: { title: string; topic: string }) {
  return (
    <main className="bg-ink pb-24 pt-[calc(var(--header-h)+5rem)] md:pb-36 md:pt-[calc(var(--header-h)+8rem)]">
      <article className={wrap}>
        <SplitHeading as="h1" load className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[1] tracking-[-0.035em]">
          {title}
        </SplitHeading>
        <Reveal load delay={0.3} className="mt-10 max-w-[64ch] space-y-5 text-[17px] leading-relaxed text-white/75">
          <p>
            Our full {topic} is being finalised and will be published here soon.
          </p>
          <p>
            In the meantime, if you have any questions about {topic === "privacy policy" ? "how we collect or handle your information" : "the terms that apply to our website and services"}, email us at{" "}
            <a href={`mailto:${contact.email}`} className="text-electric underline underline-offset-4">
              {contact.email}
            </a>
            .
          </p>
          <p>
            <Link href="/" className="text-white underline decoration-white/30 underline-offset-[6px] hover:decoration-electric">
              Back to the homepage
            </Link>
          </p>
        </Reveal>
      </article>
    </main>
  );
}
