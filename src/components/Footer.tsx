"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { contact, nav } from "@/lib/content";

const legal = [
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  return (
    <footer ref={root} className="relative z-[3] overflow-hidden bg-ink pt-20 pb-10">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <Image src="/brand/logo-header.png" alt="SD Innovations" width={932} height={149} className="theme-logo h-7 w-auto self-start" />
            <a
              href={`mailto:${contact.email}`}
              className="w-fit text-[clamp(1.4rem,2.4vw,2rem)] font-medium tracking-[-0.02em] text-white underline decoration-white/25 underline-offset-[6px] transition-colors duration-200 hover:decoration-electric"
            >
              {contact.email}
            </a>
          </div>
          <FooterCol title="Pages" links={nav} />
          <FooterCol title="Company" links={legal} />
          <div>
            <p className="mb-4 text-[14px] text-white/45">Visit</p>
            <address className="text-[15px] not-italic leading-relaxed text-white/70">
              {contact.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-[13px] text-white/45 sm:flex-row sm:justify-between">
          <span>© 2026 SD Innovations. All rights reserved.</span>
          <span>Humanising technology</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-4 text-[14px] text-white/45">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[15px] text-white/75 transition-colors duration-200 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
