/**
 * Resolve the public site URL defensively.
 *
 * `metadataBase: new URL(site.url)` runs at module load, so a malformed
 * value here doesn't just break SEO — it kills the entire build before a
 * single page renders. Anything the environment hands us gets normalised
 * or discarded.
 */
function resolveSiteUrl(): string {
  const fallback = "https://tejastarle.com";

  // Trim whitespace/newlines from copy-paste and strip stray quotes.
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/^["']|["']$/g, "");
  if (!raw) return fallback;

  // Tolerate a bare hostname like "foo.vercel.app" by assuming https.
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    // .origin normalises away trailing slashes, paths, and query strings.
    return new URL(candidate).origin;
  } catch {
    console.warn(
      `[site] NEXT_PUBLIC_SITE_URL is not a valid URL (received: ${raw}). ` +
        `Falling back to ${fallback}.`
    );
    return fallback;
  }
}

export const site = {
  name: "Tejas Tarle",
  role: "Backend Engineer · Node.js & Payment Gateways",
  tagline: "I build production backends and the payment systems behind them.",
  location: "Nashik, Maharashtra, India",
  email: "tejastarle2441@gmail.com",
  phone: "+91 93564 89327",
  github: "https://github.com/Tejastarle",
  linkedin: "https://www.linkedin.com/in/tejas-tarle-924300230/",
  url: resolveSiteUrl(),
  // Recruiter-facing keywords. Kept here so metadata and JSON-LD agree.
  keywords: [
    "Tejas Tarle",
    "Backend Engineer India",
    "Node.js Developer",
    "Express.js Developer",
    "MongoDB Developer",
    "Payment Gateway Integration",
    "Razorpay Integration Developer",
    "Stripe Integration Developer",
    "REST API Developer",
    "Full Stack Developer Nashik",
    "React Node.js Developer",
  ],
  metrics: [
    { value: "5", label: "Production systems" },
    { value: "3", label: "Payment gateways" },
    { value: "95%", label: "On-time delivery" },
    { value: "15+", label: "Enterprise clients" },
  ],
} as const;