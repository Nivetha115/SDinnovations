import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/motion/Reveal";
import { wrap } from "@/lib/ui";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Share your business objectives with us, and let's collaborate to craft something extraordinary.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        title="Let's craft something extraordinary."
        body="Share your business objectives with us, and let's collaborate to craft something extraordinary."
        kicker="Contact"
      />
      <section className="bg-ink py-20 md:py-32">
        <div className={`${wrap} grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24`}>
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.025em]">Tell us about your project</h2>
            <ContactForm />
          </Reveal>

          <Reveal as="aside" stagger={0.09} delay={0.15} className="space-y-12 lg:pt-3">
            <div>
              <h2 className="text-[14px] text-white/55">Inquiries</h2>
              <a
                href={`mailto:${contact.email}`}
                className="mt-3 inline-block text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium tracking-[-0.02em] underline decoration-white/25 underline-offset-[6px] transition-colors duration-200 hover:decoration-electric"
              >
                {contact.email}
              </a>
            </div>
            <div>
              <h2 className="text-[14px] text-white/55">Location</h2>
              <address className="mt-3 text-[17px] not-italic leading-relaxed text-white/85">
                {contact.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Workafella+Highstreet+431+Anna+Salai+Teynampet+Chennai"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-[15px] text-electric hover:underline"
              >
                Open in Maps ↗
              </a>
            </div>
            <div>
              <h2 className="text-[14px] text-white/55">Hours</h2>
              <p className="mt-3 text-[17px] text-white/85">{contact.hours}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
