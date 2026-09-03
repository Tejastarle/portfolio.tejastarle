"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/types";

const EMPTY = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  cover_url: "",
  tags: [] as string[],
  published: false,
  published_at: new Date().toISOString(),
};

export default function AdminPosts() {
  const [rows, setRows] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await createClient()
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) setStatus(error.message);
    setRows((data as Post[]) ?? []);
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
    const { error } = editing.id
      ? await supabase.from("posts").update(editing).eq("id", editing.id)
      : await supabase.from("posts").insert(editing);

    if (error) return setStatus(error.message);
    setStatus("Saved");
    setEditing(null);
    load();
    setTimeout(() => setStatus(null), 2500);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await createClient().from("posts").delete().eq("id", id);
    if (error) setStatus(error.message);
    else load();
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-paper">Posts</h1>
          <p className="mono mt-2 text-xs text-dim">
            {rows.length} rows
            {status && <span className="ml-3 text-gold">{status}</span>}
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New post
        </button>
      </div>

      {editing && (
        <div className="mb-8 grid gap-4 rounded-xl border border-gold/40 bg-ink-2 p-6">
          <Field
            label="Title"
            value={editing.title ?? ""}
            onChange={(v) =>
              setEditing({
                ...editing,
                title: v,
                slug: editing.id
                  ? editing.slug
                  : v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
              })
            }
          />
          <Field label="Slug" value={editing.slug ?? ""} onChange={(v) => setEditing({ ...editing, slug: v })} />
          <Field label="Excerpt" value={editing.excerpt ?? ""} onChange={(v) => setEditing({ ...editing, excerpt: v })} />
          <Field
            label="Tags (comma separated)"
            value={(editing.tags ?? []).join(", ")}
            onChange={(v) => setEditing({ ...editing, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />

          <label className="block">
            <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-dim">
              Body (blank line between paragraphs)
            </span>
            <textarea
              value={editing.body ?? ""}
              onChange={(e) => setEditing({ ...editing, body: e.target.value })}
              rows={12}
              className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm leading-relaxed text-paper outline-none focus:border-gold"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-paper">
            <input
              type="checkbox"
              checked={!!editing.published}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              className="h-4 w-4 cursor-pointer accent-[var(--color-gold)]"
            />
            Published
          </label>

          <div className="flex gap-2">
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
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-paper">{r.title}</span>
                {!r.published && (
                  <span className="mono rounded bg-wine/15 px-1.5 py-0.5 text-[9px] uppercase text-wine">draft</span>
                )}
              </div>
              <div className="truncate text-xs text-dim">{r.excerpt}</div>
            </div>
            <button onClick={() => setEditing(r)} className="mono cursor-pointer text-[11px] uppercase text-dim hover:text-gold">
              Edit
            </button>
            <button onClick={() => remove(r.id)} aria-label={`Delete ${r.title}`} className="cursor-pointer text-dim hover:text-wine">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="px-5 py-12 text-center text-sm text-dim">
            No posts yet. Write your first one.
          </li>
        )}
      </ul>
    </div>
  );
}

function Field({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-dim">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
      />
    </label>
  );
}
