import Link from "next/link";
export const metadata = { title: "Our Work" };

const PROJECTS = [
  { title:"P&G Annual Gift Set 2024",       category:"Premium Sets",  client:"Procter & Gamble Thailand", img:"https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80", qty:"5,000 sets",  desc:"Curated gift hampers with branded skincare products and custom packaging for P&G's year-end corporate gifting." },
  { title:"Acer Tech Promo Bundle",          category:"IT Gadgets",    client:"Acer Thailand",             img:"https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=600&q=80", qty:"2,000 units", desc:"Custom-branded power banks and USB drives in Acer-themed gift tins for laptop purchase promotions." },
  { title:"Oral-B Event Merchandise",        category:"Souvenirs",     client:"Oral-B Thailand",           img:"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80", qty:"10,000 pcs",  desc:"Full range of branded tote bags, mugs, and notebook sets for Oral-B's regional dental health events." },
  { title:"Ambipur Eco Bottle Campaign",     category:"Drinkware",     client:"Ambipur Thailand",          img:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80", qty:"3,000 units", desc:"Stainless-steel insulated bottles with Ambipur branding for GWP (Gift With Purchase) retail campaigns." },
  { title:"VSTECS New Year Hamper",          category:"Premium Sets",  client:"VSTECS",                    img:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80", qty:"800 hampers",  desc:"Custom rigid boxes with assorted premium food items and a personalised card for VSTECS's client appreciation." },
  { title:"Absolute You Loyalty Bags",       category:"Bags",          client:"Absolute You",              img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", qty:"1,500 bags",  desc:"Custom-embroidered backpacks with loyalty tier badges for Absolute You's fitness membership programme." },
];

export default function WorkPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="badge-pill-white">Portfolio</span>
          <h1>Our Work</h1>
          <p>ผลงานที่ผ่านมาและโปรเจกต์ที่ภาคภูมิใจ</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge-pill">Selected Projects</span>
            <h2>50,000+ Projects — A Few We&apos;re Proud Of</h2>
            <p className="text-gray-500 text-xl mt-2">ตัวอย่างผลงานที่เราทำให้แบรนด์ชั้นนำ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {PROJECTS.map((p,i) => (
              <div key={i} className="card !p-0 overflow-hidden group">
                <div className="relative overflow-hidden h-52">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute top-3 left-3">
                    <span className="badge-cat">{p.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-base text-primary font-semibold mb-1">{p.client}</div>
                  <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-3">{p.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-700">Qty:</span>
                    <span className="text-base text-gray-500">{p.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-primary text-white text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-white mb-4">Want to Be Our Next Success Story?</h2>
          <p className="text-white/80 text-xl mb-8">Tell us about your project and we&apos;ll make it happen.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/catalog" className="btn-white btn-lg">Browse Products</Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white/60 text-white rounded-full text-xl font-medium hover:bg-white/10 transition-all">Get a Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
