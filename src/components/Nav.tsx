"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#credentials", label: "Credentials" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-line bg-ink/85 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
        <a href="#top" className="mono cursor-pointer text-sm font-bold tracking-tight">
          tejas<span className="text-gold">.</span>tarle
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono cursor-pointer text-[11px] uppercase tracking-[0.16em] text-dim transition-colors duration-200 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            className="cursor-pointer rounded-full border border-gold px-4 py-1.5 text-xs font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-ink"
          >
            Résumé
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer p-2 text-paper md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-line bg-ink px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="mono block cursor-pointer py-3 text-sm uppercase tracking-[0.14em] text-dim hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            className="mono block cursor-pointer py-3 text-sm uppercase tracking-[0.14em] text-gold"
          >
            Résumé
          </a>
        </nav>
      )}
    </header>
  );
}
