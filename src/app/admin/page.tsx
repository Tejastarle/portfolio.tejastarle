import Link from "next/link";
import { FolderGit2, GraduationCap, Newspaper, RefreshCw } from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";
import SyncButton from "./SyncButton";

export const dynamic = "force-dynamic";

async function counts() {
  if (!supabaseConfigured) return null;
  const supabase = await createClient();

  const [projects, posts, certs] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("certifications").select("id", { count: "exact", head: true }),
  ]);

  return {
    projects: projects.count ?? 0,
    posts: posts.count ?? 0,
    certifications: certs.count ?? 0,
  };
}

export default async function AdminHome() {
  const stats = await counts();

  const supabase = supabaseConfigured ? await createClient() : null;
  const { data } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };

  const cards = [
    {
      href: "/admin/projects",
      icon: FolderGit2,
      label: "Projects",
      count: stats?.projects,
      note: "Add, edit, reorder, publish",
    },
    {
      href: "/admin/posts",
      icon: Newspaper,
      label: "Posts",
      count: stats?.posts,
      note: "Blog-style writing",
    },
    {
      href: "/admin/certifications",
      icon: GraduationCap,
      label: "Certifications",
      count: stats?.certifications,
      note: "Credentials and links",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-gold">
            Control room
          </span>
          <h1 className="display mt-2 text-4xl text-paper">Admin</h1>
          {data.user?.email && (
            <p className="mono mt-2 text-xs text-dim">
              Signed in as {data.user.email}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <SyncButton />
          <SignOutButton />
        </div>
      </div>

      {!supabaseConfigured && (
        <div className="mb-8 rounded-xl border border-wine/40 bg-wine/5 p-5 text-sm leading-relaxed text-paper/80">
          Supabase isn&apos;t connected. Run{" "}
          <code className="mono text-gold">supabase/schema.sql</code> in the SQL
          editor, then add your keys to{" "}
          <code className="mono text-gold">.env.local</code>.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ href, icon: Icon, label, count, note }) => (
          <Link
            key={href}
            href={href}
            className="group cursor-pointer rounded-xl border border-line bg-ink-2 p-6 transition-colors hover:border-gold/50"
          >
            <Icon
              className="mb-4 h-5 w-5 text-gold"
              aria-hidden="true"
            />
            <div className="display text-3xl text-paper">
              {count ?? "—"}
            </div>
            <div className="mt-1 font-semibold text-paper">{label}</div>
            <div className="mt-1 text-xs text-dim">{note}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-ink-2 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-paper">
          <RefreshCw className="h-4 w-4 text-gold" aria-hidden="true" />
          GitHub sync
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dim">
          Pulls every public repo from your GitHub account and upserts it into the
          projects table. Existing rows keep their tagline, category, and featured
          flag, so hand-written copy is never overwritten — only stars, language,
          and last-pushed date refresh.
        </p>
      </div>
    </div>
  );
}
