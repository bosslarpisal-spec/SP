"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { IconSearch } from "@/lib/icons";

function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 group flex flex-col">
      <div className="relative overflow-hidden h-52">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        {product.isNew && (
          <div className="absolute top-2.5 left-2.5">
            <span className="badge-new">New</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="badge-cat text-base mb-2 self-start">{product.category}</span>
        <Link href={`/catalog/${product.id}`} className="font-semibold text-lg leading-snug hover:text-primary transition-colors mb-0.5">{product.name}</Link>
        <p className="text-gray-400 text-base mb-2">{product.nameTH}</p>
        <p className="text-gray-500 text-base leading-relaxed mb-4 flex-1 line-clamp-2">{product.desc}</p>
        <Link href={`/catalog/${product.id}`}
          className="w-full py-2.5 rounded-xl text-lg font-semibold text-center bg-primary text-white hover:bg-primary-dark transition-colors">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (search)    list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.nameTH.includes(search) || p.category.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase())));
    if (category !== "All") list = list.filter(p => p.category === category);
    return list;
  }, [search, category]);

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="badge-pill-white">Product Catalog</span>
          <h1>Our Catalog</h1>
          <p>เลือกสินค้าที่ใช่สำหรับแบรนด์ของคุณ — ปรับแต่งได้ทุกชิ้น</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search bar */}
          <div className="relative mb-8 max-w-xl mx-auto">
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search products — name, category, or tags…"
              className="form-input pl-12 text-base"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">✕</button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Sidebar filters ── */}
            <aside className="lg:w-60 shrink-0 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-700 mb-3">Category</h4>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-lg transition-colors ${category === cat ? "bg-primary text-white font-semibold" : "text-gray-600 hover:bg-blue-50 hover:text-primary"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { setCategory("All"); setSearch(""); }}
                className="btn-ghost w-full justify-center btn-sm">
                Reset Filters
              </button>
            </aside>

            {/* ── Product grid ── */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <p className="text-lg text-gray-500">
                  <span className="font-semibold text-gray-800">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                  <div className="flex justify-center mb-4"><IconSearch className="w-14 h-14 text-gray-300"/></div>
                  <p className="font-medium text-xl">No products match your filters.</p>
                  <button onClick={() => { setCategory("All"); setSearch(""); }} className="btn-outline btn-sm mt-4">Clear Filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(p => <ProductCard key={p.id} product={p}/>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
