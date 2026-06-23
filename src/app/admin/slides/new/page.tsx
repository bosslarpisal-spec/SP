import { assertAdmin } from "../../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SlideForm from "../SlideForm";
import { th } from "@/app/admin/lib/admin-th";

export const dynamic = "force-dynamic";

export default async function NewSlidePage() {
  try {
    await assertAdmin();
  } catch {
    redirect("/login");
  }

  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from("hero_slides")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextDisplayOrder = (data?.[0]?.display_order ?? 0) + 1;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
          {th.slideNewHeading}
        </h1>
        <p style={{ fontSize: 12, color: "#aaa", margin: "4px 0 0" }}>
          {th.slideNewSub}
        </p>
      </div>
      <SlideForm mode="new" nextDisplayOrder={nextDisplayOrder} />
    </div>
  );
}
