import AboutContent from "./AboutContent";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export const metadata = { title: "About Us" };
export const revalidate = 3600;

export default async function AboutPage() {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from("page_content")
    .select("section, key, value")
    .eq("page", "about");
  return <AboutContent rows={data ?? []} />;
}
