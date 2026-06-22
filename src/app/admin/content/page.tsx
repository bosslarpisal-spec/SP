import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import ContentEditorClient from "./ContentEditorClient";

export const dynamic = "force-dynamic";

export type ContentMap = Record<string, Record<string, string>>;

export type ContentRow = {
  section: string;
  key: string;
  value: string | null;
  type: string;
  is_visible: boolean;
};

export type Category = {
  id: string;
  name: string;
  display_order: number;
  is_visible: boolean;
};

export type Tag = {
  id: string;
  name: string;
};

export default async function ContentPage() {
  try {
    await assertAdmin();
  } catch {
    redirect("/login");
  }

  const supabase = createSupabaseServiceClient();
  const [{ data: rows }, { data: categories }, { data: tags }, { data: products }] = await Promise.all([
    supabase
      .from("page_content")
      .select("section, key, value, type, is_visible")
      .eq("page", "home"),
    supabase
      .from("categories")
      .select("*")
      .order("display_order"),
    supabase
      .from("tags")
      .select("*"),
    supabase
      .from("products")
      .select("category, tags"),
  ]);

  const productCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  for (const p of products ?? []) {
    productCounts[p.category] = (productCounts[p.category] ?? 0) + 1;
    for (const t of p.tags ?? []) {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1;
    }
  }

  return (
    <ContentEditorClient
      initialContent={(rows ?? []) as ContentRow[]}
      categories={(categories ?? []) as Category[]}
      tags={(tags ?? []) as Tag[]}
      productCounts={productCounts}
      tagCounts={tagCounts}
    />
  );
}
