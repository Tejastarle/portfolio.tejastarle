import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  stargazers_count: number;
};

/** Rough bucketing so freshly synced repos land in a sensible filter. */
function categorise(repo: Repo): "web" | "android" | "enterprise" | "academic" {
  const hay = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase();
  if (/(android|kotlin|flutter|dart|app|apk|mobile)/.test(hay)) return "android";
  if (/(crm|erp|dashboard|management|admin|analytics)/.test(hay)) return "enterprise";
  if (/(sem|assignment|college|university|practical)/.test(hay)) return "academic";
  if (["Java", "Kotlin", "Dart"].includes(repo.language ?? "")) return "android";
  return "web";
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST() {
  // Only a signed-in admin can trigger a sync.
  const auth = await createServerClient();
  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const username = process.env.GITHUB_USERNAME ?? "Tejastarle";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !url) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not set" },
      { status: 500 }
    );
  }

  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
    { headers, cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `GitHub returned ${res.status}. Add GITHUB_TOKEN to raise the rate limit.` },
      { status: 502 }
    );
  }

  const repos: Repo[] = await res.json();
  const usable = repos.filter((r) => !r.fork && !r.archived);

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Preserve hand-written copy: only fill fields the author hasn't set.
  const { data: existing } = await admin.from("projects").select("slug, tagline, category, featured, sort_order, body");
  const bySlug = new Map((existing ?? []).map((r) => [r.slug, r]));

  const payload = usable.map((repo, i) => {
    const slug = slugify(repo.name);
    const prev = bySlug.get(slug);

    return {
      slug,
      title: repo.name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      tagline: prev?.tagline || repo.description || "Source available on GitHub.",
      body: prev?.body ?? null,
      category: prev?.category || categorise(repo),
      stack: [repo.language, ...(repo.topics ?? [])].filter(Boolean).slice(0, 5),
      repo_url: repo.html_url,
      live_url: repo.homepage || null,
      language: repo.language,
      featured: prev?.featured ?? false,
      year: new Date(repo.pushed_at).getFullYear(),
      sort_order: prev?.sort_order ?? 50 + i,
      published: true,
      updated_at: repo.pushed_at,
    };
  });

  const { error } = await admin
    .from("projects")
    .upsert(payload, { onConflict: "slug" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: payload.length });
}
