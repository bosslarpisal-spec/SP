"use server";

import { assertAdmin } from "./admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { Result, toError } from "./actionResult";

export type PortfolioProjectData = {
  id: string;
  title: string;
  title_th: string;
  description: string;
  client: string;
  image_url: string;
  project_link: string;
  tags: string;
  metrics: string; // JSON string — parsed before writing to DB
  icon: string;
  aspect: string;
  display_order: number;
  visible: boolean;
};

function revalidateAll() {
  revalidatePath("/our-work");
  revalidatePath("/admin/content");
}

function buildRow(p: PortfolioProjectData) {
  let metrics: unknown;
  try { metrics = JSON.parse(p.metrics || "[]"); }
  catch { metrics = []; }
  return {
    title:         p.title.trim(),
    title_th:      p.title_th,
    description:   p.description,
    client:        p.client.trim(),
    image_url:     p.image_url,
    project_link:  p.project_link,
    tags:          p.tags,
    metrics,
    icon:          p.icon || "ti-star",
    aspect:        p.aspect || "square",
    display_order: p.display_order,
    visible:       p.visible,
  };
}

export async function upsertPortfolioProject(p: PortfolioProjectData): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service
      .from("portfolio_projects")
      .update(buildRow(p))
      .eq("id", p.id);
    if (error) return { ok: false, error: error.message };
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "portfolioActions.upsertPortfolioProject") };
  }
}

export async function insertPortfolioProject(): Promise<Result<{ id: string }>> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { data: maxRow } = await service
      .from("portfolio_projects")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = ((maxRow?.display_order as number) ?? 0) + 10;
    const { data, error } = await service
      .from("portfolio_projects")
      .insert({ title: "New Project", client: "Client", display_order: nextOrder })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidateAll();
    return { ok: true, id: data.id as string };
  } catch (err) {
    return { ok: false, error: toError(err, "portfolioActions.insertPortfolioProject") };
  }
}

export async function deletePortfolioProject(id: string): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service.from("portfolio_projects").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "portfolioActions.deletePortfolioProject") };
  }
}

export async function savePortfolioOrder(
  updates: { id: string; display_order: number }[]
): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const results = await Promise.all(
      updates.map(u =>
        service
          .from("portfolio_projects")
          .update({ display_order: u.display_order })
          .eq("id", u.id)
      )
    );
    const failed = results.find(r => r.error);
    if (failed?.error) return { ok: false, error: failed.error.message };
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "portfolioActions.savePortfolioOrder") };
  }
}
