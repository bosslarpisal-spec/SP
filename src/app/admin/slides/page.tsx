import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSlidesClient from "./AdminSlidesClient";

export const dynamic = "force-dynamic";

export type HeroSlide = {
  id: number;
  display_order: number;
  badge: string;
  heading: string;
  subheadline: string;
  subtext: string;
  description: string;
  btn1_text: string;
  btn1_link: string;
  btn2_text: string;
  btn2_link: string;
  bg_image_url: string;
  bg_color: string;
  is_active: boolean;
  styles: Record<string, Record<string, string>>;
};

export default async function SlidesPage() {
  try {
    await assertAdmin();
  } catch {
    redirect("/login");
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("display_order");

  if (error) {
    return (
      <div style={{ color: "#A32D2D", padding: 24, fontSize: 14 }}>
        Failed to load slides: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
            Hero Slides
          </h1>
          <p style={{ fontSize: 12, color: "#aaa", margin: "4px 0 0" }}>
            Drag to reorder · Toggle to show/hide · {(data ?? []).length} slide
            {(data ?? []).length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/slides/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "#0D1E3D",
            color: "#E8D5A3",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          <i className="ti ti-plus" style={{ fontSize: 14 }} />
          Add Slide
        </Link>
      </div>

      <AdminSlidesClient slides={(data ?? []) as HeroSlide[]} />
    </div>
  );
}
