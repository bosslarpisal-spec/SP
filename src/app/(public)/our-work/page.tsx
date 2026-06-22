import OurWorkContent from "./OurWorkContent";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export const metadata = { title: "Our Work" };
export const revalidate = 3600;

export default async function OurWorkPage() {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from("page_content")
    .select("section, key, value")
    .eq("page", "our-work");
  return <OurWorkContent rows={data ?? []} />;
}
