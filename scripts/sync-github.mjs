#!/usr/bin/env node
/**
 * Offline GitHub -> Supabase sync.
 *
 *   npm run sync:github
 *
 * Does the same job as the "Sync GitHub" button in /admin, but from the
 * terminal, so you can run it from a cron job or a CI step.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GITHUB_USERNAME        (optional, defaults to Tejastarle)
 *   GITHUB_TOKEN           (optional, raises the API rate limit)
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Minimal .env.local reader so this works without extra dependencies.
try {
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#"))
    .forEach((line) => {
      const i = line.indexOf("=");
      if (i === -1) return;
      const key = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    });
} catch {
  // No .env.local — fall back to whatever is already in the environment.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const username = process.env.GITHUB_USERNAME ?? "Tejastarle";

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function categorise(repo) {
  const hay = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase();
  if (/(android|kotlin|flutter|dart|app|apk|mobile)/.test(hay)) return "android";
  if (/(crm|erp|dashboard|management|admin|analytics)/.test(hay)) return "enterprise";
  if (/(sem|assignment|college|university|practical)/.test(hay)) return "academic";
  if (["Java", "Kotlin", "Dart"].includes(repo.language)) return "android";
  return "web";
}

const headers = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const res = await fetch(
  `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
  { headers }
);

if (!res.ok) {
  console.error(`GitHub returned ${res.status}. Set GITHUB_TOKEN to raise the limit.`);
  process.exit(1);
}

const repos = (await res.json()).filter((r) => !r.fork && !r.archived);
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const { data: existing } = await supabase
  .from("projects")
  .select("slug, tagline, category, featured, sort_order, body");
const bySlug = new Map((existing ?? []).map((r) => [r.slug, r]));

const payload = repos.map((repo, i) => {
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

const { error } = await supabase.from("projects").upsert(payload, { onConflict: "slug" });

if (error) {
  console.error("Upsert failed:", error.message);
  process.exit(1);
}

console.log(`Synced ${payload.length} repos from github.com/${username}`);
