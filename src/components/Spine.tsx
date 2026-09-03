"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "work", label: "work" },
  { id: "experience", label: "experience" },
  { id: "skills", label: "skills" },
  { id: "credentials", label: "credentials" },
  { id: "contact", label: "contact" },
];

/**
 * A commit graph running down the left rail: the branch line draws itself
 * as you scroll and each section is a commit node. It doubles as nav and
 * as scroll progress. Chosen over a plain progress bar because the content
 * genuinely is a history — the order carries meaning.
 *
 * Hidden below lg; small screens get the top bar instead.
 */
export default function Spine() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActive(id),
        { rootMargin: "-45% 0px -45% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-0 top-0 z-40 hidden h-screen w-[var(--spine-w)] flex-col items-center justify-center lg:flex"
    >
      <div className="relative flex h-[60vh] flex-col items-center justify-between">
        {/* Track */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line" />
        {/* Drawn branch */}
        <motion.div
          className="absolute left-1/2 top-0 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-gold via-wine to-jade"
          style={{ height: "100%", scaleY: progress }}
        />

        {SECTIONS.map(({ id, label }) => {
          const on = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className="group relative z-10 flex cursor-pointer items-center"
              aria-current={on ? "true" : undefined}
            >
              <span
                className={`spine-node block rounded-full border ${
                  on
                    ? "h-3.5 w-3.5 border-gold bg-gold scale-110"
                    : "h-2.5 w-2.5 border-line bg-ink-3 group-hover:border-gold"
                }`}
              />
              <span
                className={`mono absolute left-6 whitespace-nowrap text-[10px] uppercase tracking-[0.18em] transition-opacity duration-200 ${
                  on
                    ? "text-gold opacity-100"
                    : "text-dim opacity-0 group-hover:opacity-100"
                }`}
              >
                {label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
