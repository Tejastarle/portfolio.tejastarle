import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8 lg:px-14">
      <div className="mono mx-auto flex max-w-[1400px] flex-col gap-3 text-[11px] text-dim sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {site.name}. Built with Next.js &amp; Supabase.
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          Open to opportunities
        </span>
      </div>
    </footer>
  );
}
