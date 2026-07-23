// src/app/admin/products/page.tsx
import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminProductsClient from "./AdminProductsClient";
import { th } from "@/app/admin/lib/admin-th";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  try {
    await assertAdmin();
  } catch {
    redirect("/login");
  }

  // Service role — this table's public RLS only allows reading active
  // products; this admin list needs to see hidden ones too.
  const service = createSupabaseServiceClient();

  const { data: products, error } = await service
    .from("products")
    .select("id, name, name_th, category, image_url, is_active, is_new, display_order, tags")
    .order("display_order", { ascending: true });

  if (error) {
    return (
      <div
        style={{
          background: "#FCEBEB",
          border: "1px solid #F09595",
          color: "#A32D2D",
          padding: "16px 20px",
          borderRadius: 10,
          fontSize: 13,
        }}
      >
        โหลดสินค้าไม่สำเร็จ: {error.message}
      </div>
    );
  }

  const total = products?.length ?? 0;
  const active = products?.filter((p) => p.is_active).length ?? 0;
  const isNew = products?.filter((p) => p.is_new).length ?? 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: "#1a1a1a", margin: "0 0 2px" }}>
            {th.productsHeading}
          </h1>
          <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>
            {th.productsSubtitle(total, active, isNew)}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            padding: "9px 18px",
            background: "#0D1E3D",
            color: "#E8D5A3",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {th.productsAddBtn}
        </Link>
      </div>

      <AdminProductsClient products={products ?? []} />
    </div>
  );
}
