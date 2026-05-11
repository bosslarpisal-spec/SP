// src/components/public/WishlistButton.tsx
"use client";

// ─────────────────────────────────────────────────────────────
//  WishlistButton
//  Props:
//    productId  – the product to toggle
//    wished     – current state (from useWishlist)
//    onToggle   – call toggle(productId) from useWishlist
//    size       – "sm" (card) | "lg" (detail page)
//    className  – optional extra classes
// ─────────────────────────────────────────────────────────────

interface Props {
  productId: number;
  wished:    boolean;
  onToggle:  (id: number) => void;
  size?:     "sm" | "lg";
  className?: string;
}

export default function WishlistButton({ productId, wished, onToggle, size = "sm", className = "" }: Props) {
  const isLg = size === "lg";

  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(productId); }}
      aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
      title={wished ? "Remove from wishlist" : "Save to wishlist"}
      className={[
        // Base shape
        "group flex items-center justify-center rounded-full transition-all duration-200",
        // Size
        isLg
          ? "w-12 h-12 border-2"
          : "w-8 h-8 border",
        // Colour states
        wished
          ? "bg-red-50 border-red-300 hover:bg-red-100"
          : "bg-white/90 border-gray-200 hover:border-red-300 hover:bg-red-50 backdrop-blur-sm",
        // Shadow
        "shadow-sm hover:shadow-md",
        className,
      ].join(" ")}
    >
      {/* Heart SVG */}
      <svg
        viewBox="0 0 24 24"
        className={[
          "transition-all duration-200",
          isLg ? "w-5 h-5" : "w-4 h-4",
          wished
            ? "fill-red-500 stroke-red-500 scale-110"
            : "fill-none stroke-gray-400 group-hover:stroke-red-400 group-hover:scale-110",
        ].join(" ")}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}