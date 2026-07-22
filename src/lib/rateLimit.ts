// src/lib/rateLimit.ts
// Lightweight in-memory rate limiter for public API routes. Resets when the
// serverless instance recycles — not a substitute for a real distributed
// limiter, but enough to blunt basic spam/abuse on low-traffic form endpoints.

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > limit;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
