"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Certification } from "@/lib/types";

const EMPTY = {
  name: "",
  issuer: "",
  year: new Date().getFullYear(),
  credential_url: "",
  sort_order: 99,
};

export default function AdminCertifications() {
  const [rows, setRows] = useState<Certification[]>([]);
  const [editing, setEditing] = useState<Partial<Certification> | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await createClient()
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setStatus(error.message);
    setRows((data as Certification[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing?.name || !editing?.issuer) {
      setStatus("Name and issuer are required.");
      return;
    }
    const supabase = createClient();
    const { error } = editing.id
      ? await supabase.from("certifications").update(editing).eq("id", editing.id)
      : await supabase.from("certifications").insert(editing);

    if (error) return setStatus(error.message);
    setStatus("Saved");
    setEditing(null);
    load();
    setTimeout(() => setStatus(null), 2500);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this certification?")) return;
    const { error } = await createClient().from("certifications").delete().eq("id", id);
    if (error) setStatus(error.message);
    else load();
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-paper">Certifications</h1>
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
          New
        </button>
      </div>

      {editing && (
        <div className="mb-8 grid gap-4 rounded-xl border border-gold/40 bg-ink-2 p-6 sm:grid-cols-2">
          <Field label="Name" value={editing.name ?? ""} onChange={(v) => setEditing({ ...editing, name: v })} />
          <Field label="Issuer" value={editing.issuer ?? ""} onChange={(v) => setEditing({ ...editing, issuer: v })} />
          <Field label="Year" type="number" value={String(editing.year ?? "")} onChange={(v) => setEditing({ ...editing, year: Number(v) })} />
          <Field label="Sort order" type="number" value={String(editing.sort_order ?? "")} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
          <div className="sm:col-span-2">
            <Field label="Credential URL (optional)" value={editing.credential_url ?? ""} onChange={(v) => setEditing({ ...editing, credential_url: v })} />
          </div>
          <div className="flex gap-2 sm:col-span-2">
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
              <div className="truncate font-medium text-paper">{r.name}</div>
              <div className="mono text-[10px] uppercase tracking-[0.14em] text-dim">
                {r.issuer}{r.year ? ` · ${r.year}` : ""}
              </div>
            </div>
            <button onClick={() => setEditing(r)} className="mono cursor-pointer text-[11px] uppercase text-dim hover:text-gold">
              Edit
            </button>
            <button onClick={() => remove(r.id)} aria-label={`Delete ${r.name}`} className="cursor-pointer text-dim hover:text-wine">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="px-5 py-12 text-center text-sm text-dim">
            Nothing yet. Add your first certification.
          </li>
        )}
      </ul>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-dim">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
      />
    </label>
  );
}
