// src/app/admin/profile/actions.ts
"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import { th } from "@/app/admin/lib/admin-th";

// Server Actions that throw have their Error.message redacted by Next.js in
// production builds (replaced with a generic "Server Components render" message +
// digest). Returning a { ok, error } result instead avoids that entirely and lets
// the real, translated message reach the toast. Every export below wraps its whole
// body in try/catch so that truly unexpected exceptions (including from
// assertAdmin(), which still throws) are converted to a normal return too — nothing
// in this file may throw across the action boundary, for any reason.

type Result<T = object> = { ok: false; error: string } | ({ ok: true } & T);

function toError(err: unknown): string {
  console.error("[admin/profile/actions]", err);
  return err instanceof Error ? err.message : String(err);
}

export async function addAdmin(
  email: string
): Promise<Result<{ id: number; email: string; created_at: string }>> {
  try {
    await assertAdmin();
    const clean = email.trim().toLowerCase();
    if (!clean) return { ok: false, error: th.errEmailRequired };

    const service = createSupabaseServiceClient();
    const { data, error } = await service
      .from("admins")
      .insert({ email: clean })
      .select()
      .single();
    if (error) {
      return { ok: false, error: error.code === "23505" ? th.errEmailExists : error.message };
    }

    // Invite email is intentionally disabled for now — Supabase's Auth "Site URL" still
    // points at the vercel.app preview domain, so invite links are broken. New admins
    // get an account via the normal public /signup form instead (any email that
    // already has an admins row is recognized automatically by middleware.ts). Once the
    // Site URL is fixed this can be re-enabled with
    // service.auth.admin.inviteUserByEmail(clean).

    return { ok: true, ...(data as { id: number; email: string; created_at: string }) };
  } catch (err) {
    return { ok: false, error: toError(err) };
  }
}

export async function removeAdmin(id: number): Promise<Result> {
  try {
    const user = await assertAdmin();
    const service = createSupabaseServiceClient();
    const { data: target } = await service
      .from("admins")
      .select("email")
      .eq("id", id)
      .single();
    if (target?.email === (user.email ?? "").toLowerCase()) {
      return { ok: false, error: th.errCannotRemoveSelf };
    }
    const { error } = await service.from("admins").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err) };
  }
}

export async function changeAdminEmail(newEmail: string): Promise<Result> {
  try {
    const user = await assertAdmin();
    const clean = newEmail.trim().toLowerCase();
    if (!clean) return { ok: false, error: th.errEmailRequired };

    // Update Supabase Auth (sends confirmation to new address)
    const sessionClient = await createSupabaseServerClient();
    const { error: authError } = await sessionClient.auth.updateUser({ email: clean });
    if (authError) return { ok: false, error: authError.message };

    // Keep admins table in sync
    const service = createSupabaseServiceClient();
    const { error: dbError } = await service
      .from("admins")
      .update({ email: clean })
      .eq("email", (user.email ?? "").toLowerCase());
    if (dbError) {
      return { ok: false, error: `Auth email queued but admins table sync failed: ${dbError.message}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err) };
  }
}

export async function changeAdminPassword(newPassword: string): Promise<Result> {
  try {
    const user = await assertAdmin();
    if (newPassword.length < 6) return { ok: false, error: th.errPwTooShort };
    const service = createSupabaseServiceClient();
    const { error } = await service.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err) };
  }
}
