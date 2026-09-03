import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";

/**
 * Fonts are self-hosted through next/font: Next downloads them at build time,
 * serves them from our own origin, and inlines the @font-face + size-adjust
 * metrics. That removes the render-blocking request to fonts.googleapis.com
 * and eliminates the layout shift (CLS) a late-loading webfont causes.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Tejas Tarle is a backend engineer in Nashik, India, specialising in Node.js, Express and MongoDB. Core strength is payment gateway integration — Razorpay, Stripe and PayPal — covering checkout, webhooks, signature verification, idempotent retries, refunds and reconciliation. Five production systems shipped end to end.",
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: site.url,
    siteName: `${site.name} — Portfolio`,
    title: `${site.name} — ${site.role}`,
    description:
      "Backend engineer specialising in Node.js, Express, MongoDB and payment gateway integration (Razorpay, Stripe, PayPal). Five production systems shipped end to end.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description:
      "Backend engineer · Node.js, Express, MongoDB · Payment gateway integration (Razorpay, Stripe, PayPal).",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0a0710",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Person + ProfilePage structured data. This is what makes a recruiter's
 * Google result show the role, employer, and skills rather than a bare link.
 */
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: site.name,
      jobTitle: "Backend Engineer",
      description:
        "Backend engineer specialising in Node.js, Express and MongoDB, with a core strength in payment gateway integration (Razorpay, Stripe, PayPal). Has shipped five production systems end to end across web and Android.",
      url: site.url,
      email: `mailto:${site.email}`,
      telephone: site.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nashik",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "D.Y. Patil Technical Campus, Shivaji University",
      },
      worksFor: {
        "@type": "Organization",
        name: "Agix International Pvt. Ltd.",
      },
      knowsAbout: [
        "Node.js", "Express.js", "REST API Design", "MongoDB", "MySQL",
        "Payment Gateway Integration", "Razorpay", "Stripe", "PayPal",
        "Webhooks", "OAuth 2.0", "JWT Authentication", "Microservices",
        "ReactJS", "Android Development", "Firebase", "CI/CD", "System Design",
      ],
      knowsLanguage: ["English", "Hindi", "Marathi"],
      sameAs: [site.github, site.linkedin],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <head>
        <JsonLd />
      </head>
      <body>
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
