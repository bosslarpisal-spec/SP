// src/app/admin/lib/actionResult.ts
// Shared result type for admin Server Actions. Next.js redacts thrown Error
// messages in production builds, so every action must return { ok, error }
// instead of throwing — this is what makes that possible everywhere.

export type Result<T = object> = { ok: false; error: string } | ({ ok: true } & T);

export function toError(err: unknown, context: string): string {
  console.error(`[${context}]`, err);
  return err instanceof Error ? err.message : String(err);
}
