//src/app/(public)/home/page.tsx
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import HomeClient from "./HomeClient";
import type { ContentMap } from "@/app/admin/content/page";

export const metadata = { title: "Home" };
export const revalidate = 30;

export interface HeroSlide {
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
}

interface DbProduct {
  id: number;
  name: string;
  name_th: string;
  description: string | null;
  description_th: string | null;
  category: string;
  image_url: string;
  images: string[] | null;
  is_new: boolean;
  is_active: boolean;
  display_order: number;
  tags: string[];
  moq: number | null;
  branding_methods: string[] | null;
}

export default async function HomePage() {
  const supabase = createSupabaseServiceClient();

  const [productsResult, contentResult, categoriesResult, tagsResult, slidesResult] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,name_th,description,description_th,category,image_url,images,is_new,is_active,display_order,tags,moq,branding_methods")
      .eq("is_active", true)
      .order("display_order"),
    supabase
      .from("page_content")
      .select("section, key, value")
      .eq("page", "home"),
    supabase
      .from("categories")
      .select("name, display_order, is_visible")
      .eq("is_visible", true)
      .order("display_order"),
    supabase
      .from("tags")
      .select("name")
      .order("name"),
    supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
  ]);

  if (productsResult.error) {
    console.error("[home/page] products query failed:", productsResult.error.message);
  }

  const products = (productsResult.data as DbProduct[] ?? []).map(p => ({
    id:          String(p.id),
    name:        p.name,
    nameTh:      p.name_th,
    description: p.name_th,         // Thai name shown as bilingual subtitle in catalog card
    descEn:      p.description ?? "",
    descTh:      p.description_th ?? "",
    category:    p.category,
    is_visible:  p.is_active,
    is_new:      p.is_new,
    tags:        p.tags ?? [],
    moq:         p.moq ?? null,
    branding_methods: p.branding_methods ?? [],
    image_url:   p.image_url ?? "",
    images:      p.images ?? [],
  }));

  const contentMap: ContentMap = {};
  for (const row of contentResult.data ?? []) {
    if (!contentMap[row.section]) contentMap[row.section] = {};
    contentMap[row.section][row.key] = row.value;
  }

  const categoryOrder = (categoriesResult.data ?? []).map(c => c.name);
  const allTags = (tagsResult.data ?? []).map(t => t.name);
  const slides = (slidesResult.data ?? []) as HeroSlide[];

  return <HomeClient products={products} content={contentMap} categoryOrder={categoryOrder} allTags={allTags} slides={slides} />;
}
