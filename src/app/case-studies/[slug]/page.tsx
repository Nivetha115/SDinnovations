import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/content";
import CaseStudyView from "@/components/CaseStudyView";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return {};
  return { title: study.title, description: study.summary };
}

// Not async: the params are read below a Suspense boundary so the App Shell stays static.
export default function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  return (
    <Suspense fallback={<main className="min-h-svh bg-ink" />}>
      <Study params={params} />
    </Suspense>
  );
}

async function Study({ params }: Pick<PageProps<"/case-studies/[slug]">, "params">) {
  const { slug } = await params;
  const i = caseStudies.findIndex((c) => c.slug === slug);
  if (i === -1) notFound();
  const next = caseStudies[(i + 1) % caseStudies.length];
  return <CaseStudyView study={caseStudies[i]} next={next} />;
}
