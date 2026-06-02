// src/app/admin/layout.tsx
import type { Metadata } from "next";
import AdminSignOut from "./AdminSignout";

export const metadata: Metadata = {
  title: "SP Admin",
  robots: "noindex,nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-gray-900">
              SP <span className="text-primary">Admin</span>
            </span>
            <span className="text-[10px] bg-yellow-100 text-yellow-700 font-semibold px-1.5 py-0.5 rounded-full">
              INTERNAL
            </span>
          </div>
          <nav className="flex items-center gap-0.5">
            <a href="/admin"
              className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Dashboard
            </a>
            <a href="/admin/products"
              className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Products
            </a>
            <a href="/admin/profile"
              className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Profile
            </a>
            <a href="/home"
              className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              ← Public site
            </a>
            <div className="w-px h-3 bg-gray-200 mx-1" />
            <AdminSignOut />
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5">{children}</main>
    </div>
  );
}