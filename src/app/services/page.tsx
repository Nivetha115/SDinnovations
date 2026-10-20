import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CTA from "@/components/CTA";
import { WhyUs } from "@/components/Sections";
import { ServiceList, TechStack } from "@/components/ServicesDetail";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Software development, data engineering, cybersecurity, digital transformation, team augmentation, AI & machine learning and ServiceNow solutions.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        title="Build, protect and grow with confidence."
        body="From custom software to AI and cybersecurity, our expertise helps you build, protect, and grow with confidence."
        kicker="Services"
      />
      <ServiceList />
      <TechStack />
      <WhyUs />
      <CTA />
    </main>
  );
}
