// src/app/(public)/catalog/[id]/ProductDetailClient.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/hooks/useWishlist";
import WishlistButton from "@/components/public/WishlistButton";

// DB-shaped product (matches what page.tsx passes)
type Product = {
  id: number;
  name: string;
  nameTH: string;
  category: string;
  desc: string;
  descTH: string;
  image: string;
  isNew?: boolean;
  tags: string[];
};

interface Props {
  product: Product;
  related?: Product[]; // optional — safe if not passed
}

export default function ProductDetailClient({ product, related = [] }: Props) {
  const { isWished, toggle } = useWishlist();

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-accent border-b border-gray-200">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/home" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/home" className="hover:text-primary">Catalog</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product layout */}
      <section className="section">
        <div className="container grid md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-3xl shadow-xl object-cover aspect-square"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 badge-new text-sm px-3 py-1">New</span>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="badge-cat mb-3 inline-block">{product.category}</span>
            <h1 className="text-3xl mb-1" style={{ fontFamily: "Georgia,serif" }}>
              {product.name}
            </h1>
            <p className="text-primary text-sm mb-6">{product.nameTH}</p>
            <p className="text-gray-600 text-lg leading-relaxed mb-2">{product.desc}</p>
            <p className="text-gray-400 leading-relaxed mb-8">{product.descTH}</p>

            {/* Tags */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {(product.tags ?? []).map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex gap-3 flex-wrap items-center">
              <Link href="/contact" className="btn-primary btn-lg flex-1 min-w-[160px] justify-center">
                Enquire About This Product →
              </Link>
              <WishlistButton
                productId={product.id}
                wished={isWished(product.id)}
                onToggle={toggle}
                size="lg"
              />
              <Link href="/home" className="btn-ghost btn-lg">
                ← Back to Catalog
              </Link>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              ♡&nbsp; Tap the heart to save this product to your wishlist.{" "}
              <Link href="/login" className="underline hover:text-primary transition-colors">
                Sign in
              </Link>{" "}
              to save across devices.
            </p>
          </div>
        </div>
      </section>

      {/* Related products — only shown if there are any */}
      {related.length > 0 && (
        <section className="section-sm bg-accent">
          <div className="container">
            <h3 className="mb-6">More in {product.category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <Link
                  key={p.id}
                  href={`/catalog/${p.id}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  <div className="relative h-36">
                    <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} />
                    <div className="absolute top-2 right-2">
                      <WishlistButton
                        productId={p.id}
                        wished={isWished(p.id)}
                        onToggle={toggle}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm leading-snug hover:text-primary transition-colors">
                      {p.name}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">{p.nameTH}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}