import { Award, BookOpen, GraduationCap } from "lucide-react";
import Reveal from "./Reveal";
import type { Certification } from "@/lib/types";

export default function Credentials({ items }: { items: Certification[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Education */}
      <Reveal className="lg:col-span-1">
        <div className="h-full rounded-xl border border-line bg-ink-2/60 p-6">
          <GraduationCap className="mb-4 h-5 w-5 text-gold" aria-hidden="true" />
          <h3 className="mono mb-4 text-[10px] uppercase tracking-[0.18em] text-dim">
            Education
          </h3>
          <div className="text-base font-semibold text-paper">
            B.Tech, Computer Science &amp; Engineering
          </div>
          <div className="mt-1 text-sm text-dim">
            D.Y. Patil Technical Campus, Shivaji University
          </div>
          <div className="mono mt-4 flex items-center gap-3 text-xs">
            <span className="text-dim">2020 — 2024</span>
            <span className="text-line">/</span>
            <span className="text-gold">CGPA 8.27 / 10</span>
          </div>
        </div>
      </Reveal>

      {/* Publication */}
      <Reveal delay={0.08} className="lg:col-span-2">
        <div className="h-full rounded-xl border border-line bg-ink-2/60 p-6">
          <BookOpen className="mb-4 h-5 w-5 text-wine" aria-hidden="true" />
          <h3 className="mono mb-4 text-[10px] uppercase tracking-[0.18em] text-dim">
            Peer-reviewed publication
          </h3>
          <div className="text-base font-semibold text-paper">
            Women Safety Application Using Android Technology
          </div>
          <div className="mt-1 text-sm text-dim">
            International Journal IJARIIE, Volume 11, 2025
          </div>
          <p className="mt-4 text-sm leading-relaxed text-dim">
            Real-time mobile safety using Android, Firebase, GPS, and SOS emergency
            response.
          </p>
        </div>
      </Reveal>

      {/* Certifications */}
      <Reveal delay={0.12} className="lg:col-span-3">
        <div className="rounded-xl border border-line bg-ink-2/60 p-6">
          <Award className="mb-4 h-5 w-5 text-jade" aria-hidden="true" />
          <h3 className="mono mb-5 text-[10px] uppercase tracking-[0.18em] text-dim">
            Certifications
          </h3>
          <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <li key={c.id} className="bg-ink-2 px-5 py-4">
                {c.credential_url ? (
                  <a
                    href={c.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer text-sm font-medium text-paper hover:text-gold"
                  >
                    {c.name}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-paper">{c.name}</span>
                )}
                <div className="mono mt-1.5 text-[10px] uppercase tracking-[0.14em] text-dim">
                  {c.issuer}
                  {c.year ? ` · ${c.year}` : ""}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
