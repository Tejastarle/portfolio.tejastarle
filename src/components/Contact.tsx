"use client";

import { useState } from "react";
import { Check, Copy, Github, Linkedin, Mail, Phone } from "lucide-react";
import AmbientBackdrop from "./AmbientBackdrop";
import { site } from "@/lib/site";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-line px-5 py-24 sm:px-8 lg:px-14 lg:py-32"
    >
      <AmbientBackdrop src="/videos/contact.mp4" opacity={0.22} />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <span className="mono text-xs text-gold">05 — contact</span>

        <h2 className="display mt-4 max-w-3xl text-[clamp(2.2rem,7vw,5.5rem)] text-paper">
          Let&apos;s ship
          <br />
          <span className="text-gold text-glow">something.</span>
        </h2>

        <p className="mt-6 max-w-lg text-lg text-paper/80">
          Seeking a backend or full-stack engineering role in payments. Open to
          relocating. Available immediately.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            onClick={copy}
            className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5"
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : site.email}
          </button>

          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm text-paper transition-colors duration-200 hover:border-gold hover:text-gold"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {site.phone}
          </a>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-line pt-8">
          {[
            { href: site.github, icon: Github, label: "GitHub" },
            { href: site.linkedin, icon: Linkedin, label: "LinkedIn" },
            { href: `mailto:${site.email}`, icon: Mail, label: "Email" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mono group inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.16em] text-dim transition-colors duration-200 hover:text-gold"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
