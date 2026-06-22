// src/app/admin/layout.tsx
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ToastProvider } from "./components/Toast";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "SP Admin",
  robots: "noindex,nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = user?.email ?? "";

  return (
    <ToastProvider>
      <AdminShell adminEmail={adminEmail}>{children}</AdminShell>
    </ToastProvider>
  );
}
