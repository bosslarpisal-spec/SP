import OurWorkContent from "./OurWorkContent";
import type { PortfolioProject } from "./OurWorkContent";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export const metadata = { title: "Our Work" };
export const revalidate = 3600;

export default async function OurWorkPage() {
  const supabase = createSupabaseServiceClient();
  const [contentRes, projectsRes] = await Promise.all([
    supabase.from("page_content").select("section, key, value").eq("page", "our-work"),
    supabase.from("portfolio_projects").select("*").eq("visible", true).order("display_order"),
  ]);
  return (
    <OurWorkContent
      rows={contentRes.data ?? []}
      projects={(projectsRes.data ?? []) as unknown as PortfolioProject[]}
    />
  );
}
