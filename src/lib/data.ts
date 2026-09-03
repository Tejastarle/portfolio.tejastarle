import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { fallbackContent } from "@/content/fallback";
import type { Certification, Experience, Post, Project } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && anon);

/**
 * Anonymous read-only client. Public tables are exposed through RLS
 * "published = true" policies, so this never needs a session.
 */
function readClient() {
  return createSupabaseClient(url!, anon!, {
    auth: { persistSession: false },
  });
}

export async function getProjects(): Promise<Project[]> {
  if (!hasSupabase) return fallbackContent.projects;

  const { data, error } = await readClient()
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return fallbackContent.projects;
  return data as Project[];
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getExperience(): Promise<Experience[]> {
  if (!hasSupabase) return fallbackContent.experience;

  const { data, error } = await readClient()
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return fallbackContent.experience;
  return data as Experience[];
}

export async function getCertifications(): Promise<Certification[]> {
  if (!hasSupabase) return fallbackContent.certifications;

  const { data, error } = await readClient()
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return fallbackContent.certifications;
  return data as Certification[];
}

export async function getPosts(): Promise<Post[]> {
  if (!hasSupabase) return fallbackContent.posts;

  const { data, error } = await readClient()
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data?.length) return fallbackContent.posts;
  return data as Post[];
}

export async function getPost(slug: string): Promise<Post | null> {
  const all = await getPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
