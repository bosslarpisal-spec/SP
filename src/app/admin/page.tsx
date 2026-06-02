// src/app/admin/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: activeProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: newProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_new", true);

  const stats = [
    { label: "Total Products", value: totalProducts ?? 0, color: "bg-blue-50 text-blue-700" },
    { label: "Active / Visible", value: activeProducts ?? 0, color: "bg-green-50 text-green-700" },
    { label: "Marked as New", value: newProducts ?? 0, color: "bg-yellow-50 text-yellow-700" },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">SP Admin Panel — manage products shown to customers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} inline-block px-2 py-0.5 rounded-lg`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="font-semibold text-sm text-gray-800 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            View all products
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            + Add new product
          </Link>
          <Link
            href="/home"
            target="_blank"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Preview catalog ↗
          </Link>
        </div>
      </div>
    </div>
  );
}