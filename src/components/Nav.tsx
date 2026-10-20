"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { nav } from "@/lib/content";

// The "Let's talk" button already goes to /contact, so the header skips the Contact link.
const links = nav.filter((l) => l.href !== "/contact");
import ThemeToggle from "./ThemeToggle";
import PaletteSwitch from "./PaletteSwitch";

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// Aitch-style nav: white bar (logo + links) with a separate CTA button beside it.
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // close the mobile menu after navigating
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="theme-fixed fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5"
    >
      <nav
        aria-label="Main"
        className="flex w-full max-w-[960px] items-stretch gap-2"
      >
        <div
          className={`flex flex-1 items-center justify-between rounded-xl bg-white py-2 pl-4 pr-2 text-ink transition-shadow duration-500 ${
            scrolled ? "shadow-[0_12px_40px_-12px_rgba(0,20,60,0.45)]" : ""
          }`}
        >
          <Link href="/" aria-label="SD Innovations home" className="shrink-0">
            <Image
              src="/brand/logo-header.png"
              alt="SD Innovations"
              width={932}
              height={149}
              priority
              className="h-[18px] w-auto brightness-0 md:h-5"
            />
          </Link>

          <ul className="hidden items-center gap-0.5 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className="relative px-3 py-2 text-[14px] font-medium text-[#2e3038] transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-1 after:h-[1.5px] after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 after:ease-[var(--ease-out)] hover:text-ink hover:after:scale-x-100 aria-[current=page]:text-accent-strong aria-[current=page]:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
          <Link
            href="/contact"
            className="wipe group mr-1 hidden h-9 items-center gap-2 rounded-lg bg-[#05070d] px-4 text-[14px] font-medium text-[#fff] transition-[transform,color] duration-150 ease-out hover:text-on-accent active:scale-[0.97] md:flex"
          >
            <span className="sweep bg-electric" />
            Let&apos;s talk
            <Arrow className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45" />
          </Link>
          <PaletteSwitch className="hidden md:flex" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-[#f0f2f7] md:hidden"
          >
            <span
              className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
          </div>
        </div>

      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-4 top-[72px] rounded-xl bg-white p-2 text-ink shadow-2xl md:hidden"
          >
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(pathname, l.href) ? "page" : undefined}
                    className="block px-3 py-3 text-base font-medium underline-offset-[6px] decoration-[1.5px] hover:underline aria-[current=page]:text-accent-strong aria-[current=page]:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#05070d] px-4 py-3 font-medium text-[#fff] active:scale-[0.98]"
            >
              Let&apos;s talk <Arrow />
            </Link>
            <div className="mt-3 flex items-center justify-between px-3">
              <span className="text-[14px] text-[#2e3038]">Colour</span>
              <PaletteSwitch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2 12 12 2M5 2h7v7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
