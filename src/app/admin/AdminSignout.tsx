"use client";
import { supabase } from "@/lib/supabase";

export default function AdminSignOut() {

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
    >
      ออกจากระบบ
    </button>
  );
}