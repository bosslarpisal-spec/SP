//src/app/(public)/home/page.tsx
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import HomeClient from "./HomeClient";

export const metadata = { title: "Home" };
export const revalidate = 60;

interface DbProduct {
  id: number;
  name: string;
  name_th: string;
  category: string;
  image_url: string;
  images: string[] | null;
  is_new: boolean;
  is_active: boolean;
  display_order: number;
  tags: string[];
}

export default async function HomePage() {
  let products: {
    id: string;
    name: string;
    description: string;
    category: string;
    is_visible: boolean;
    is_new: boolean;
    tags: string[];
    image_url: string;
    images: string[];
  }[] = [];

  try {
    const supabase = createSupabaseServiceClient();
    const { data } = await supabase
      .from("products")
      .select("id,name,name_th,category,image_url,images,is_new,is_active,display_order,tags")
      .eq("is_active", true)
      .order("display_order");
    if (data) {
      products = (data as DbProduct[]).map(p => ({
        id:          String(p.id),
        name:        p.name,
        description: p.name_th,
        category:    p.category,
        is_visible:  p.is_active,
        is_new:      p.is_new,
        tags:        p.tags ?? [],
        image_url:   p.image_url ?? "",
        images:      p.images ?? [],
      }));
    }
  } catch (err) {
    console.error("[home] product fetch failed:", err);
  }

  return <HomeClient products={products} />;
}
