// src/app/api/newsletter/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidatePath("/catalog", "page");
  revalidatePath("/catalog/[id]", "page");
  revalidatePath("/home", "page");
  return NextResponse.json({ revalidated: true });
}