"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function SyncButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const sync = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/github-sync", { method: "POST" });
      const json = await res.json();
      setMsg(res.ok ? `Synced ${json.count} repos` : json.error ?? "Sync failed");
      if (res.ok) router.refresh();
    } catch {
      setMsg("Sync failed");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {msg && <span className="mono text-xs text-gold">{msg}</span>}
      <button
        onClick={sync}
        disabled={busy}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gold px-4 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-ink disabled:opacity-50"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        {busy ? "Syncing…" : "Sync GitHub"}
      </button>
    </div>
  );
}
