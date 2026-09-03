"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";

const EMPTY: Omit<Project, "id" | "updated_at"> = {
  slug: "",
  title: "",
  tagline: "",
  body: "",
  category: "web",
  stack: [],
  repo_url: "",
  live_url: "",
  cover_url: "",
  language: "",
  featured: false,
  year: new Date().getFullYear(),
  sort_order: 99,
  published: true,
};

export default function AdminProjects() {
  const [rows, setRows] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await createClient()
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) setStatus(error.message);
    setRows((data as Project[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing?.title || !editing?.slug) {
      setStatus("Title and slug are required.");
      return;
    }

    const supabase = createClient();
    const payload = { ...editing, updated_at: new Date().toISOString() };

    const { error } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);

    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus(editing.id ? "Saved" : "Created");
    setEditing(null);
    load();
    setTimeout(() => setStatus(null), 2500);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project? This can't be undone.")) return;
    const { error } = await createClient().from("projects").delete().eq("id", id);
    if (error) setStatus(error.message);
    else load();
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-paper">Projects</h1>
          <p className="mono mt-2 text-xs text-dim">
            {loading ? "Loading…" : `${rows.length} rows`}
            {status && <span className="ml-3 text-gold">{status}</span>}
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New project
        </button>
      </div>

      {editing && (
        <div className="mb-8 rounded-xl border border-gold/40 bg-ink-2 p-6">
          <h2 className="mb-5 font-semibold text-paper">
            {editing.id ? `Editing “${editing.title}”` : "New project"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" value={editing.title ?? ""} onChange={(v) =>
              setEditing({
                ...editing,
                title: v,
                slug: editing.id
                  ? editing.slug
                  : v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
              })
            } />
            <Field label="Slug" value={editing.slug ?? ""} onChange={(v) => setEditing({ ...editing, slug: v })} />

            <div className="sm:col-span-2">
              <Field label="Tagline (one line)" value={editing.tagline ?? ""} onChange={(v) => setEditing({ ...editing, tagline: v })} />
            </div>

            <div>
              <Label>Category</Label>
              <select
                value={editing.category ?? "web"}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as Project["category"] })}
                className="w-full cursor-pointer rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
              >
                <option value="web">web</option>
                <option value="android">android</option>
                <option value="enterprise">enterprise</option>
                <option value="academic">academic</option>
              </select>
            </div>

            <Field label="Stack (comma separated)" value={(editing.stack ?? []).join(", ")} onChange={(v) => setEditing({ ...editing, stack: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
            <Field label="Repo URL" value={editing.repo_url ?? ""} onChange={(v) => setEditing({ ...editing, repo_url: v })} />
            <Field label="Live URL" value={editing.live_url ?? ""} onChange={(v) => setEditing({ ...editing, live_url: v })} />
            <Field label="Year" type="number" value={String(editing.year ?? "")} onChange={(v) => setEditing({ ...editing, year: Number(v) })} />
            <Field label="Sort order" type="number" value={String(editing.sort_order ?? "")} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />

            <div className="sm:col-span-2">
              <Label>Body (optional, blank line between paragraphs)</Label>
              <textarea
                value={editing.body ?? ""}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                rows={5}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
              />
            </div>

            <div className="flex items-center gap-6 sm:col-span-2">
              <Toggle label="Featured" checked={!!editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
              <Toggle label="Published" checked={!!editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button onClick={save} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save
            </button>
            <button onClick={() => setEditing(null)} className="cursor-pointer rounded-lg border border-line px-5 py-2.5 text-sm text-dim hover:text-paper">
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="divide-y divide-[var(--color-line)] overflow-hidden rounded-xl border border-line bg-ink-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-4 px-5 py-4">
            <span className="mono w-8 shrink-0 text-xs text-dim">{r.sort_order}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-paper">{r.title}</span>
                {r.featured && <span className="mono rounded bg-gold/15 px-1.5 py-0.5 text-[9px] uppercase text-gold">featured</span>}
                {!r.published && <span className="mono rounded bg-wine/15 px-1.5 py-0.5 text-[9px] uppercase text-wine">draft</span>}
              </div>
              <div className="truncate text-xs text-dim">{r.tagline}</div>
            </div>
            <button onClick={() => setEditing(r)} className="mono cursor-pointer text-[11px] uppercase tracking-wider text-dim hover:text-gold">
              Edit
            </button>
            <button onClick={() => remove(r.id)} aria-label={`Delete ${r.title}`} className="cursor-pointer text-dim hover:text-wine">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {!loading && rows.length === 0 && (
          <li className="px-5 py-12 text-center text-sm text-dim">
            No projects yet. Hit “Sync GitHub” on the dashboard, or add one manually.
          </li>
        )}
      </ul>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-dim">
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-paper">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-[var(--color-gold)]"
      />
      {label}
    </label>
  );
}
