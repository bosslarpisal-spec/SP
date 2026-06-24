import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSlidesClient from "./AdminSlidesClient";
import { th } from "@/app/admin/lib/admin-th";

export const dynamic = "force-dynamic";
const MAX_SLIDES = 7;

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
        {th.slidesLoadFail}: {error.message}
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
            {th.slidesHeading}
          </h1>
          <p style={{ fontSize: 12, color: "#aaa", margin: "4px 0 0" }}>
            {th.slidesSubtitle((data ?? []).length)}
          </p>
        </div>
        {(data ?? []).length >= MAX_SLIDES ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#F5F4F1", color: "#aaa", borderRadius: 7, fontSize: 13, fontWeight: 500, border: "0.5px solid #E8E6E0", cursor: "not-allowed", opacity: 0.6 }}>
              <i className="ti ti-plus" style={{ fontSize: 14 }} />
              {th.slidesAddBtn}
            </div>
            <span style={{ fontSize: 11, color: "#D97706", fontWeight: 500 }}>
              สูงสุด {MAX_SLIDES} สไลด์ / Max {MAX_SLIDES} slides
            </span>
          </div>
        ) : (
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
            {th.slidesAddBtn}
          </Link>
        )}
      </div>

      <AdminSlidesClient slides={(data ?? []) as HeroSlide[]} />
    </div>
  );
}
