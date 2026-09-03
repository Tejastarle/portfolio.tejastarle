"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Experience } from "@/lib/types";

function fmt(d: string | null) {
  if (!d) return "Present";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function Timeline({ items }: { items: Experience[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const reduced = useReducedMotion();

  return (
    <ol className="relative border-l border-line pl-6 sm:pl-10">
      {items.map((job, i) => {
        const isOpen = open === job.id;
        const current = job.end_date === null;

        return (
          <motion.li
            key={job.id}
            initial={reduced ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="relative pb-8 last:pb-0"
          >
            {/* Commit node on the branch */}
            <span
              className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 sm:-left-[43px] ${
                current
                  ? "border-gold bg-gold"
                  : "border-line bg-ink-3"
              }`}
              aria-hidden="true"
            />
            {current && (
              <span className="absolute -left-[27px] top-1.5 h-3 w-3 animate-ping rounded-full bg-gold/40 sm:-left-[43px]" aria-hidden="true" />
            )}

            <button
              onClick={() => setOpen(isOpen ? null : job.id)}
              aria-expanded={isOpen}
              className="group flex w-full cursor-pointer items-start justify-between gap-4 text-left"
            >
              <div>
                <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.16em] text-dim">
                  {fmt(job.start_date)} — {fmt(job.end_date)}
                  {job.location && <span className="text-line"> / </span>}
                  {job.location}
                </div>
                <h3 className="text-lg font-semibold text-paper transition-colors duration-200 group-hover:text-gold">
                  {job.role}
                </h3>
                <div className="mt-0.5 text-sm text-gold/80">{job.company}</div>
              </div>
              <ChevronDown
                className={`mt-1 h-4 w-4 shrink-0 text-dim transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <motion.div
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-4 space-y-2.5">
                {job.highlights.map((h, hi) => (
                  <li key={hi} className="flex gap-3 text-sm leading-relaxed text-dim">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/60" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.li>
        );
      })}
    </ol>
  );
}
