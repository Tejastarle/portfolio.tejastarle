import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-5 py-4 sm:px-8">
          <Link href="/admin" className="mono cursor-pointer text-sm font-bold">
            tejas<span className="text-gold">.</span>admin
          </Link>
          <nav className="flex gap-5" aria-label="Admin">
            <Link href="/admin/projects" className="mono cursor-pointer text-[11px] uppercase tracking-[0.16em] text-dim hover:text-gold">
              Projects
            </Link>
            <Link href="/admin/posts" className="mono cursor-pointer text-[11px] uppercase tracking-[0.16em] text-dim hover:text-gold">
              Posts
            </Link>
            <Link href="/admin/certifications" className="mono cursor-pointer text-[11px] uppercase tracking-[0.16em] text-dim hover:text-gold">
              Certifications
            </Link>
          </nav>
          <Link href="/" className="mono ml-auto cursor-pointer text-[11px] uppercase tracking-[0.16em] text-dim hover:text-gold">
            View site ↗
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
