import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="mono text-xs text-gold">404 — no such route</span>
      <h1 className="display mt-4 text-6xl text-paper">Dead link.</h1>
      <p className="mt-4 max-w-sm text-sm text-dim">
        This page isn&apos;t deployed. Head back to the work.
      </p>
      <Link
        href="/"
        className="mt-8 cursor-pointer rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink"
      >
        Back to portfolio
      </Link>
    </main>
  );
}
