"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const LOGO_FALLBACK = "/F2.png";

export function useLogoUrl(): string {
  const [url, setUrl] = useState(LOGO_FALLBACK);
  useEffect(() => {
    let active = true;
    supabase
      .from("page_content")
      .select("value")
      .eq("page", "site")
      .eq("section", "branding")
      .eq("key", "logo_url")
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("[useLogoUrl] fetch failed:", error.message);
          return;
        }
        if (data?.value) setUrl(data.value);
      });
    return () => {
      active = false;
    };
  }, []);
  return url;
}
