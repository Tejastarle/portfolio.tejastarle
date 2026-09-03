"use client";

const ITEMS = [
  "Node.js", "Express", "MongoDB", "REST APIs", "Razorpay", "Stripe", "PayPal",
  "Webhooks", "Idempotency", "Reconciliation", "OAuth 2.0", "JWT", "ReactJS",
  "Android / Java", "Firebase", "CI/CD", "Linux", "System Design", "OWASP",
];

/** Ambient band separating hero from the work. Paused on hover. */
export default function Marquee() {
  return (
    <div
      className="group relative flex overflow-hidden border-y border-line bg-ink-2/60 py-4"
      aria-hidden="true"
    >
      <div className="marquee-track flex shrink-0 group-hover:[animation-play-state:paused]">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {ITEMS.map((item) => (
              <span
                key={`${dup}-${item}`}
                className="mono flex items-center whitespace-nowrap px-6 text-xs tracking-wider text-dim"
              >
                {item}
                <span className="ml-6 text-gold/50">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
