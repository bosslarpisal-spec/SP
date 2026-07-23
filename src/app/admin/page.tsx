// src/app/admin/page.tsx
import { assertAdmin } from "./lib/admin-guard";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { th } from "@/app/admin/lib/admin-th";
import { nameFromEmail } from "@/app/admin/lib/format";

export const dynamic = "force-dynamic";

type ProductRow = {
  id: number;
  name: string;
  name_th: string;
  category: string;
  is_active: boolean;
  is_new: boolean;
  created_at: string;
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return th.greetMorning;
  if (hour < 18) return th.greetAfternoon;
  return th.greetEvening;
}

export default async function AdminDashboard() {
  try {
    await assertAdmin();
  } catch {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  // Service role — this table's public RLS only allows reading active
  // products; the dashboard stats need to count hidden ones too.
  const service = createSupabaseServiceClient();

  const [{ data: { user } }, { data }, { count: categoryCount }] = await Promise.all([
    supabase.auth.getUser(),
    service
      .from("products")
      .select("id, name, name_th, category, is_active, is_new, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  const products: ProductRow[] = data ?? [];
  const total = products.length;
  const active = products.filter((p) => p.is_active).length;
  const isNew  = products.filter((p) => p.is_new).length;
  const recent = products.slice(0, 5);

  const categoryTotals = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    { label: th.dashStatTotal, value: total, icon: "ti-package", iconBg: "#F5F3F0", iconColor: "#0D1E3D" },
    { label: th.dashStatVisible, value: active, icon: "ti-eye", iconBg: "#EAF5E8", iconColor: "#3B6D11" },
    { label: th.dashStatNew, value: isNew, icon: "ti-sparkles", iconBg: "#E1F5EE", iconColor: "#0F6E56" },
    { label: th.dashStatCats, value: categoryCount ?? 0, icon: "ti-category", iconBg: "#F5F3F0", iconColor: "#0D1E3D" },
  ];

  const displayName = nameFromEmail(user?.email ?? "");

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 500, color: "#1a1a1a", margin: "0 0 2px" }}>
          {greeting()}, {displayName}
        </h1>
        <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>
          {th.dashSubtitle}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #E8E6E0",
              borderRadius: 10,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: s.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <i className={`ti ${s.icon}`} style={{ fontSize: 18, color: s.iconColor }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#1a1a1a",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: 12, color: "#aaa" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        {/* Left: Recent products */}
        <div
          style={{
            background: "#FFFFFF",
            border: "0.5px solid #E8E6E0",
            borderRadius: 10,
            overflow: "hidden",
            alignSelf: "start",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #E8E6E0" }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>
              {th.dashRecent}
            </p>
          </div>

          {recent.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "#aaa", fontSize: 13 }}>
              {th.dashNoProducts}
            </div>
          ) : (
            <div>
              {recent.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 20px",
                    borderBottom: "0.5px solid #F0EDE6",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: "#F5F3F0", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <i className="ti ti-gift" style={{ fontSize: 15, color: "#888" }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1a1a1a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.name}
                      </p>
                      {p.name_th && (
                        <p style={{ fontSize: 11, color: "#aaa", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.name_th}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16, flexShrink: 0 }}>
                    <span
                      style={{
                        background: "#F5F3F0",
                        color: "#888",
                        border: "0.5px solid #E8E6E0",
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: 99,
                      }}
                    >
                      {p.category}
                    </span>
                    <span
                      style={{
                        background: p.is_active ? "#EAF5E8" : "#F5F3F0",
                        color: p.is_active ? "#3B6D11" : "#888",
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: 99,
                      }}
                    >
                      {p.is_active ? th.statusActive : th.statusHidden}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              padding: "12px 20px",
              borderTop: total > 5 ? "0.5px solid #E8E6E0" : "none",
            }}
          >
            <Link
              href="/admin/products"
              style={{
                fontSize: 12,
                color: "#0D1E3D",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {th.dashViewAll}
            </Link>
          </div>
        </div>

        {/* Right: Top categories + Quick actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #E8E6E0",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 14 }}>
              {th.dashTopCats}
            </p>
            {topCategories.length === 0 ? (
              <p style={{ fontSize: 12, color: "#aaa" }}>{th.dashNoProducts}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {topCategories.map(([category, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={category}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#333" }}>{category}</span>
                        <span style={{ fontSize: 11, color: "#aaa" }}>{count}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: "#F0EDE6", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "#0D1E3D", borderRadius: 99 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #E8E6E0",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 12 }}>
              {th.dashQuickActions}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link
                href="/admin/products/new"
                style={{
                  padding: "9px 16px",
                  background: "#0D1E3D",
                  border: "1px solid #0D1E3D",
                  color: "#E8D5A3",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                {th.dashAddNew}
              </Link>
              <Link
                href="/admin/products"
                style={{
                  padding: "9px 16px",
                  background: "#FFFFFF",
                  border: "1px solid #D8D5CE",
                  color: "#555",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                {th.dashViewProducts}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
