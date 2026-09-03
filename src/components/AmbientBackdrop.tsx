"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Put files in /public/videos. Falls back to canvas aurora if absent. */
  src?: string;
  poster?: string;
  /** 0-1. Video is dimmed hard so text keeps its 4.5:1 contrast. */
  opacity?: number;
};

/**
 * Background video with three safety nets:
 *  1. If the file is missing or fails to decode -> animated canvas aurora.
 *  2. If the tab is hidden or the element scrolls away -> paused (battery).
 *  3. If the user prefers reduced motion -> static gradient, no video at all.
 */
export default function AmbientBackdrop({
  src = "/videos/hero.mp4",
  poster,
  opacity = 0.35,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCanvas, setUseCanvas] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Pause when off-screen or tab hidden.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => setUseCanvas(true));
        else el.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    const onVisibility = () => {
      if (document.hidden) el.pause();
      else el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  // Canvas aurora fallback — drifting gold/rose blobs.
  useEffect(() => {
    if (!useCanvas || reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { c: "255,158,79", r: 0.55, sx: 0.00021, sy: 0.00013 },
      { c: "224,69,123", r: 0.45, sx: -0.00017, sy: 0.00023 },
      { c: "201,191,255", r: 0.5, sx: 0.00013, sy: -0.00019 },
    ];

    const draw = () => {
      t += 16;
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      blobs.forEach((b, i) => {
        const x = w * (0.5 + 0.32 * Math.sin(t * b.sx + i * 2.1));
        const y = h * (0.5 + 0.3 * Math.cos(t * b.sy + i * 1.4));
        const rad = Math.min(w, h) * b.r;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${b.c},0.30)`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [useCanvas, reduced]);

  return (
    <div
      className="grain pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {!reduced && !useCanvas && (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          style={{ opacity }}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setUseCanvas(true)}
        />
      )}

      {!reduced && useCanvas && (
        <canvas ref={canvasRef} className="h-full w-full" style={{ opacity }} />
      )}

      {/* Duotone wash — pushes the footage toward the palette and
          guarantees text contrast whatever the video contains. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,158,79,0.14),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,6,15,0.55),rgba(8,6,15,0.86)_55%,var(--color-ink))]" />
    </div>
  );
}
