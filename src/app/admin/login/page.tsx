"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const configured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-xl border border-line bg-ink-2 p-8">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-gold">
          Admin
        </span>
        <h1 className="display mt-3 text-3xl text-paper">Sign in</h1>

        {!configured ? (
          <div className="mt-6 rounded-lg border border-wine/40 bg-wine/5 p-4 text-sm leading-relaxed text-paper/80">
            Supabase isn&apos;t connected yet. Add{" "}
            <code className="mono text-gold">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="mono text-gold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            to <code className="mono text-gold">.env.local</code>, then restart the
            dev server. The public site keeps working on local content in the
            meantime.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <div>
              <label htmlFor="email" className="mono mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-dim">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-paper outline-none focus:border-gold"
              />
            </div>
            <div>
              <label htmlFor="password" className="mono mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-dim">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signIn()}
                className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-paper outline-none focus:border-gold"
              />
            </div>

            {error && <p className="text-sm text-wine">{error}</p>}

            <button
              onClick={signIn}
              disabled={busy || !email || !password}
              className="w-full cursor-pointer rounded-lg bg-gold py-2.5 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
