"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Build log covering the full engineering + delivery stack.
 *
 * Lines are capped at ~52 characters. The console sits in a ~380px column,
 * and at 11px mono that's roughly the widest a line can be before it
 * overflows and forces a horizontal scrollbar inside the hero.
 */
const LINES: { t: string; tone?: "ok" | "warn" | "dim" }[] = [
  { t: "$ tejas deploy --env production", tone: "dim" },
  { t: "→ backend ..... Node · Express · REST · services" },
  { t: "→ payments .... Razorpay · Stripe · PayPal · UPI" },
  { t: "→ checkout .... order · capture · refund · webhooks" },
  { t: "→ integrity ... HMAC verify · idempotency keys" },
  { t: "→ recon ....... pending · failed · reconciliation" },
  { t: "→ api ......... architecture · auth · data flows" },
  { t: "→ authz ....... OAuth 2.0 · JWT · OTP · sessions" },
  { t: "→ data ........ MongoDB · MySQL · schema · indexing" },
  { t: "→ frontend .... React · JS · HTML5 · CSS3" },
  { t: "→ mobile ...... Android/Java · XML · Flutter" },
  { t: "→ ai .......... agents · LLM workflows · integrations" },
  { t: "→ cs .......... OOP · DSA · DBMS · debugging" },
  { t: "→ devops ...... Git · CI/CD · Linux · Nginx · SSL" },
  { t: "→ security .... secure coding · OWASP Top 10" },
  { t: "→ delivery .... Agile · Scrum · Jira · Asana · SDLC" },
  { t: "✓ payment gateways integrated ×3", tone: "ok" },
  { t: "✓ backend systems engineered", tone: "ok" },
  { t: "✓ full-stack applications developed", tone: "ok" },
  { t: "✓ five production systems deployed", tone: "ok" },
  { t: "$ status ...... BACKEND · PAYMENTS · FULL-STACK", tone: "warn" },
  { t: "$ build succeeded — 3+ years engineering", tone: "warn" },
];

const TONE = {
  ok: "text-gold",
  warn: "text-wine",
  dim: "text-dim",
  base: "text-paper/70",
};

export default function DeployConsole() {
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Start only once the console is on screen.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLine(LINES.length);
      setDone(true);
      return;
    }

    const el = boxRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          setStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Type the current line one character at a time.
  useEffect(() => {
    if (!started || done) return;

    if (line >= LINES.length) {
      setDone(true);
      return;
    }

    const target = LINES[line].t;

    if (chars < target.length) {
      const id = window.setTimeout(() => setChars((c) => c + 1), 6);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      setLine((c) => c + 1);
      setChars(0);
    }, 90);
    return () => window.clearTimeout(id);
  }, [started, line, chars, done]);

  // Keep the newest line in view, the way a real terminal does.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [line, done]);

  return (
    <div
      ref={boxRef}
      className="glow-gold overflow-hidden rounded-xl border border-line bg-ink-2/80 backdrop-blur-sm"
      role="img"
      aria-label="Build log summarising Tejas Tarle's engineering stack: Node.js and Express backends, payment gateway integration with Razorpay, Stripe and PayPal including checkout, webhooks, signature verification and reconciliation, React frontends, Android and Flutter mobile, MongoDB and MySQL, CI/CD and Linux infrastructure, and Agile delivery with Jira and Asana."
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-wine/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-jade/50" aria-hidden="true" />
        <span className="mono ml-2 text-[11px] text-dim">~/career — deploy.log</span>
      </div>

      {/* Fixed viewport that scrolls itself. Without this, 26 lines would make
          the card ~500px tall and push the hero layout apart as it types.
          aria-hidden because role="img" above already carries the summary —
          announcing every character would be unusable on a screen reader. */}
      <div
        ref={scrollRef}
        className="mono h-[210px] overflow-y-auto px-4 py-4 text-[11px] leading-relaxed scroll-smooth"
        aria-hidden="true"
      >
        <div className="space-y-1">
          {LINES.map((item, index) => {
            if (index > line) return null;

            const text = index === line && !done ? item.t.slice(0, chars) : item.t;

            return (
              <div
                key={index}
                className={`whitespace-pre ${TONE[item.tone ?? "base"]}`}
              >
                {text}
                {index === line && !done && (
                  <span className="caret text-gold">▌</span>
                )}
              </div>
            );
          })}

          {done && (
            <div className="text-dim">
              $ <span className="caret">▌</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}