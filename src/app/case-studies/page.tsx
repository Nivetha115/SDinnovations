import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CTA from "@/components/CTA";
import { CaseRows } from "@/components/Sections";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Successful projects and innovative solutions that have helped businesses across industries transform and grow.",
};

export default function CaseStudiesPage() {
  return (
    <main>
      <PageHero
        title="Our case studies"
        body="Explore our diverse range of successful projects and innovative solutions that have helped businesses across various industries transform and grow."
        kicker="Case Studies"
      />
      <section className="bg-ink py-20 md:py-32">
        <div className={wrap}>
          <CaseRows />
        </div>
      </section>
      <CTA />
    </main>
  );
}
