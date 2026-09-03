"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/** Counts up once, on first view. Numbers land on the real CV figures. */
function Counter({ value }: { value: string }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return;
    const suffix = value.replace(/[0-9]/g, "");

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true;
      io.disconnect();

      const start = performance.now();
      const dur = 1100;
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(Math.round(num * eased) + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      setShown("0" + suffix);
      requestAnimationFrame(tick);
    });

    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{shown}</span>;
}

export default function Metrics() {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
      {site.metrics.map((m) => (
        <div key={m.label} className="bg-ink-2 px-6 py-8">
          <dt className="mono mb-2 text-[10px] uppercase tracking-[0.16em] text-dim">
            {m.label}
          </dt>
          <dd className="display text-4xl text-gold sm:text-5xl">
            <Counter value={m.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
