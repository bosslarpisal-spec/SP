// src/hooks/useWishlist.ts
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────
//  useWishlist
//  – Loads the signed-in user's wishlist from Supabase.
//  – toggle(productId) adds or removes, with optimistic update.
//  – If the user is NOT signed in, toggle() redirects to /login.
// ─────────────────────────────────────────────────────────────
export function useWishlist() {
  const router = useRouter();
  const [ids,     setIds]     = useState<Set<number>>(new Set());
  const idsRef = useRef(ids);
  idsRef.current = ids;
  const [userId,  setUserId]  = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── 1. Load user & their wishlist on mount ──────────────────
  useEffect(() => {
    let active = true;
    let requestSeq = 0;

    async function init() {
      const seq = ++requestSeq;
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!active || seq !== requestSeq) return;

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);

      if (active && seq === requestSeq && data) {
        setIds(new Set(data.map((row: { product_id: number }) => row.product_id)));
      }
      if (active && seq === requestSeq) setLoading(false);
    }

    init();

    // Re-sync on real sign-in/sign-out transitions. Skip INITIAL_SESSION — it fires
    // synchronously right after subscribing and would otherwise duplicate the
    // mount-time init() call above for an already-signed-in user.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      requestSeq++; // invalidate any in-flight init() from a previous auth state
      if (!session) {
        setIds(new Set());
        setUserId(null);
        setLoading(false);
      } else {
        init();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── 2. Toggle a product in/out of wishlist ──────────────────
  const toggle = useCallback(async (productId: number) => {
    if (!userId) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const isWished = idsRef.current.has(productId);

    setIds(prev => {
      const next = new Set(prev);
      isWished ? next.delete(productId) : next.add(productId);
      return next;
    });

    if (isWished) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);
      if (error) setIds(prev => { const n = new Set(prev); n.add(productId); return n; });
    } else {
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: userId, product_id: productId });
      if (error) setIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
    }
  }, [userId, router]);

  const isWished = useCallback((productId: number) => ids.has(productId), [ids]);

  return { ids, isWished, toggle, loading, isAuthed: !!userId };
}