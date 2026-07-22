// src/app/admin/lib/format.ts

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0];
  if (!local) return "Admin";
  return local.charAt(0).toUpperCase() + local.slice(1);
}
