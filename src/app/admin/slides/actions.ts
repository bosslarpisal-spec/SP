"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { Result, toError } from "@/app/admin/lib/actionResult";

export type SlidePayload = {
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

function revalidate() {
  revalidatePath("/home");
  revalidatePath("/admin/slides");
}

export async function createSlide(payload: SlidePayload): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service
      .from("hero_slides")
      .insert({ ...payload, updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "slides/actions.createSlide") };
  }
}

export async function updateSlide(id: number, payload: SlidePayload): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service
      .from("hero_slides")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "slides/actions.updateSlide") };
  }
}

export async function toggleSlideActive(id: number, isActive: boolean): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service
      .from("hero_slides")
      .update({ is_active: !isActive, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "slides/actions.toggleSlideActive") };
  }
}

export async function deleteSlide(id: number): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();

    const { data: slide } = await service
      .from("hero_slides")
      .select("bg_image_url")
      .eq("id", id)
      .single();

    const { error } = await service.from("hero_slides").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    const url = slide?.bg_image_url ?? "";
    if (url && url.includes("supabase.co/storage")) {
      const path = url.split("/page-images/")[1];
      if (path) {
        await service.storage.from("page-images").remove([path]);
      }
    }

    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "slides/actions.deleteSlide") };
  }
}

export async function reorderSlides(orderedIds: number[]): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const results = await Promise.all(
      orderedIds.map((id, index) =>
        service
          .from("hero_slides")
          .update({ display_order: index + 1, updated_at: new Date().toISOString() })
          .eq("id", id)
      )
    );
    const failed = results.find(r => r.error);
    if (failed?.error) return { ok: false, error: failed.error.message };
    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "slides/actions.reorderSlides") };
  }
}
