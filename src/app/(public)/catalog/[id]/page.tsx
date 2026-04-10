import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS } from "@/lib/data";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find(p => p.id === Number(params.id));
  if (!product) notFound();

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-accent border-b border-gray-200">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/home" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-primary">Catalog</Link>
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
            <img src={product.image} alt={product.name} className="w-full rounded-3xl shadow-xl object-cover aspect-square"/>
            {product.isNew && <span className="absolute top-4 left-4 badge-new text-sm px-3 py-1">New</span>}
          </div>

          {/* Info */}
          <div>
            <span className="badge-cat mb-3 inline-block">{product.category}</span>
            <h1 className="text-3xl mb-1" style={{ fontFamily:"Georgia,serif" }}>{product.name}</h1>
            <p className="text-primary text-sm mb-6">{product.nameTH}</p>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-2">{product.desc}</p>
            <p className="text-gray-400 leading-relaxed mb-8">{product.descTH}</p>

            {/* Tags */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">#{tag}</span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-3 flex-wrap">
              <Link href="/contact" className="btn-primary btn-lg flex-1 min-w-[160px] justify-center">
                Enquire About This Product →
              </Link>
              <Link href="/catalog" className="btn-ghost btn-lg">
                ← Back to Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section-sm bg-accent">
          <div className="container">
            <h3 className="mb-6">More in {product.category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <Link key={p.id} href={`/catalog/${p.id}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
                  <img src={p.image} alt={p.name} className="w-full h-36 object-cover"/>
                  <div className="p-3">
                    <div className="font-medium text-sm leading-snug hover:text-primary transition-colors">{p.name}</div>
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
