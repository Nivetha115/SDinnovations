"use client";

import { useRef, useState, type FormEvent } from "react";
import { contact } from "@/lib/content";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { Arrow } from "./Nav";

type Fields = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  services: string[];
  description: string;
};
type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { name: "", email: "", phone: "", companyName: "", services: [], description: "" };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please tell us your name.";
  if (!f.email.trim()) e.email = "We need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "That email doesn't look right — check for typos.";
  if (f.phone && !/^[+\d][\d\s()-]{6,}$/.test(f.phone.trim())) e.phone = "Use digits, spaces or + only.";
  if (f.services.length === 0) e.services = "Pick at least one service for your project.";
  if (f.description.trim().length < 20) e.description = "Add a little more detail (20 characters or more).";
  return e;
}

/**
 * No form backend is connected yet, so sending opens the visitor's email app
 * with the message written out, addressed to the SD Innovations inbox.
 */
export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const toggleService = (s: string) => {
    setFields((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));
    if (errors.services) setErrors((e) => ({ ...e, services: undefined }));
  };

  const set = (k: Exclude<keyof Fields, "services">) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const shake = contextSafe((el: Element | null) => {
    if (!el || !window.matchMedia(MOTION).matches) return;
    gsap.to(el, { keyframes: { x: [0, -6, 5, -3, 0] }, duration: 0.4, ease: "power2.out" });
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const first = Object.keys(found)[0] as keyof Fields | undefined;
    if (first) {
      const el = e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      shake(el?.closest("[data-field]") ?? null);
      return;
    }
    const subject = `Project enquiry — ${fields.services.join(", ")}${fields.companyName ? ` · ${fields.companyName}` : ""}`;
    const body = [
      fields.description.trim(),
      "",
      `Name: ${fields.name.trim()}`,
      `Email: ${fields.email.trim()}`,
      fields.phone.trim() ? `Phone: ${fields.phone.trim()}` : null,
      fields.companyName.trim() ? `Company: ${fields.companyName.trim()}` : null,
      `Services: ${fields.services.join(", ")}`,
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div ref={root} role="status" className="rounded-2xl bg-white/[0.05] p-8 md:p-12">
        <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight tracking-[-0.025em]">
          Your message is ready to send.
        </p>
        <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/70">
          Your email app should have opened with everything filled in — just press send. If nothing
          opened, write to us directly at{" "}
          <a href={`mailto:${contact.email}`} className="text-electric underline underline-offset-4">
            {contact.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setFields(empty);
          }}
          className="mt-8 text-[15px] font-medium text-white underline decoration-white/30 underline-offset-[6px] hover:decoration-electric"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <div ref={root}>
      <form noValidate onSubmit={onSubmit} className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <Field label="Your name" name="name" value={fields.name} onChange={set("name")} error={errors.name} autoComplete="name" required />
        <Field label="Email" name="email" type="email" value={fields.email} onChange={set("email")} error={errors.email} autoComplete="email" required />
        <Field label="Phone" name="phone" type="tel" value={fields.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" optional />
        <Field label="Company" name="companyName" value={fields.companyName} onChange={set("companyName")} autoComplete="organization" optional />

        <div data-field className="sm:col-span-2">
          <span id="service-label" className="mb-3 block text-[14px] text-white/70">
            Select services <span className="text-white/60">(choose any that apply)</span>
          </span>
          <div role="group" aria-labelledby="service-label" aria-describedby={errors.services ? "services-error" : undefined} className="flex flex-wrap gap-2.5">
            {contact.services.map((s) => (
              <label key={s} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="services"
                  value={s}
                  checked={fields.services.includes(s)}
                  onChange={() => toggleService(s)}
                  className="peer sr-only"
                />
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[15px] text-white/80 transition-[background-color,border-color,color,transform] duration-200 ease-out hover:border-white/50 active:scale-[0.97] peer-checked:border-electric peer-checked:bg-electric peer-checked:[&>svg]:block peer-checked:text-on-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-electric">
                  <svg aria-hidden viewBox="0 0 16 16" className="hidden h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8" /></svg>
                  {s}
                </span>
              </label>
            ))}
          </div>
          {errors.services && (
            <p id="services-error" className="mt-2 text-[14px] text-[var(--danger)]">
              {errors.services}
            </p>
          )}
        </div>

        <div data-field className="sm:col-span-2">
          <label htmlFor="description" className="mb-2 block text-[14px] text-white/70">
            Share a brief project description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={fields.description}
            onChange={(e) => set("description")(e.target.value)}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
            className={inputCls(!!errors.description) + " resize-y"}
          />
          {errors.description && (
            <p id="description-error" className="mt-2 text-[14px] text-[var(--danger)]">
              {errors.description}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="wipe group inline-flex h-14 items-center gap-3 rounded-xl bg-white px-6 text-[16px] font-medium text-ink transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            <span className="sweep bg-electric" />
            <span className="transition-colors duration-200 group-hover:text-on-accent">Send message</span>
            <Arrow className="transition-colors duration-200 group-hover:text-on-accent transition-transform duration-300 ease-out group-hover:rotate-45" />
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = (invalid: boolean) =>
  `w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-[16px] text-white caret-electric outline-none transition-[border-color,background-color] duration-200 placeholder:text-white/60 hover:border-white/40 focus:border-electric focus:bg-white/[0.07] ${
    invalid ? "border-[var(--danger)]" : "border-white/20"
  }`;

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  optional,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  optional?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div data-field>
      <label htmlFor={name} className="mb-2 flex justify-between text-[14px] text-white/70">
        {label}
        {optional && <span className="text-white/60">Optional</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputCls(!!error)}
      />
      {error && (
        <p id={`${name}-error`} className="mt-2 text-[14px] text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
