"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={signOut}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line px-4 py-2 text-xs text-dim transition-colors hover:border-wine hover:text-wine"
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      Sign out
    </button>
  );
}
