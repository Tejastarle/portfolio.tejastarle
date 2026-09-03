"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/types";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "android", label: "Android" },
  { key: "enterprise", label: "Enterprise" },
] as const;

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("all");
  const reduced = useReducedMotion();

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter, projects]
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => {
          const on = filter === f.key;
          const count =
            f.key === "all"
              ? projects.length
              : projects.filter((p) => p.category === f.key).length;

          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={on}
              className={`mono cursor-pointer rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                on
                  ? "border-gold bg-gold text-ink"
                  : "border-line text-dim hover:border-gold hover:text-gold"
              }`}
            >
              {f.label}
              <span className={on ? "ml-2 text-ink/60" : "ml-2 text-dim/60"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{
                duration: 0.45,
                delay: reduced ? 0 : Math.min(i * 0.04, 0.3),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProjectCard project={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && (
        <p className="mono py-16 text-center text-sm text-dim">
          Nothing here yet. Pick another filter.
        </p>
      )}
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-xl border border-line bg-ink-2/60 p-6 transition-all duration-300 hover:border-gold/50 hover:bg-ink-3/50">
      {/* Sodium bloom follows the card, not the cursor — cheaper and calmer. */}
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,158,79,0.10),transparent_70%)]" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-gold">
            {project.category}
          </span>
          <span className="mono text-[10px] text-dim">{project.year}</span>
        </div>

        <h3 className="display text-2xl leading-tight text-paper">
          <Link
            href={`/projects/${project.slug}`}
            className="cursor-pointer after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-dim">{project.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((s) => (
            <span
              key={s}
              className="mono rounded border border-line px-2 py-1 text-[10px] text-paper/60"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-4 pt-6">
          {project.repo_url && (
            <span className="relative z-10 inline-flex items-center gap-1.5 text-xs text-dim transition-colors duration-200 group-hover:text-paper">
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              Source
            </span>
          )}
          <ArrowUpRight className="ml-auto h-5 w-5 text-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
        </div>
      </div>
    </article>
  );
}
