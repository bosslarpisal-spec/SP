import { assertAdmin } from "../../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { redirect, notFound } from "next/navigation";
import SlideForm from "../SlideForm";
import { th } from "@/app/admin/lib/admin-th";

export const dynamic = "force-dynamic";

export default async function EditSlidePage({ params }: { params: { id: string } }) {
  try {
    await assertAdmin();
  } catch {
    redirect("/login");
  }

  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const supabase = createSupabaseServiceClient();
  const { data: slide, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !slide) notFound();

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
          {th.slideEditPrefix} {slide.heading || slide.badge || `#${slide.id}`}
        </h1>
        <p style={{ fontSize: 12, color: "#aaa", margin: "4px 0 0" }}>
          ID #{slide.id} · ลำดับ {slide.display_order}
        </p>
      </div>
      <SlideForm mode="edit" slideId={id} initial={slide} />
    </div>
  );
}
