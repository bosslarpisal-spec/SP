"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/home");
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
    >
      Sign Out
    </button>
  );
}