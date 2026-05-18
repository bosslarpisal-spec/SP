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
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tight text-gray-900">
              SP <span className="text-primary">Admin</span>
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">
              INTERNAL
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/admin"
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Dashboard
            </a>
            <a href="/admin/products"
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Products
            </a>
            <a href="/admin/profile"
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Profile
            </a>
            <a href="/home"
              className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              ← Public site
            </a>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <AdminSignOut />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}