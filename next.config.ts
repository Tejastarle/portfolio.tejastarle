import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve modern formats first; AVIF/WebP cut image weight ~30-50% vs JPEG/PNG.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Tree-shake heavy barrel imports so only the icons/motion primitives
  // actually used ship to the client.
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },

  // Drop the `X-Powered-By: Next.js` header (smaller responses, less fingerprinting).
  poweredByHeader: false,

  // gzip/brotli compression of rendered HTML and assets.
  compress: true,

  // No source maps in the production client bundle — smaller deploy, faster loads.
  productionBrowserSourceMaps: false,

  // Long-lived immutable caching for the optimised static assets, plus
  // sensible security headers that also nudge best-practice audit scores.
  async headers() {
    return [
      {
        source: "/:all*(webp|avif|jpg|jpeg|png|svg|woff2|mp4)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
