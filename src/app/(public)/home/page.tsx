import Link from "next/link";
import { STATS, SERVICES, TESTIMONIALS, CLIENTS, BRAND } from "@/lib/data";
import { ServiceIcon, IconTrophy, IconGlobe, IconCheck } from "@/lib/icons";

export const metadata = { title: "Home" };

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="flex items-center bg-gradient-to-br from-blue-50 via-accent to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
          style={{background:"radial-gradient(circle, #316FC5 0%, transparent 70%)"}} />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-32 w-full">
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-primary mb-4">Welcome to SP</p>
            <h2 className="text-5xl md:text-6xl mb-4 leading-tight" style={{fontFamily:"Georgia,serif"}}>
              The Expert In<br/>
              <span className="text-primary">&ldquo;Total Premiums &amp;<br/>Promotion Solution&rdquo;</span>
            </h2>
            <p className="text-gray-500 text-xl mb-2">{BRAND.taglineTH}</p>
            <p className="text-gray-500 text-xl mb-8 leading-relaxed">
              Designing, producing, and delivering world-class premium gifts and corporate merchandise for leading brands across Thailand and beyond.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/catalog" className="btn-primary">View Our Catalog →</Link>
              <Link href="/contact" className="btn-outline">Get a Quote</Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center relative">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80"
              alt="Premium gifts" className="w-80 h-80 object-cover rounded-3xl shadow-2xl z-10 relative" />
            <div className="absolute top-6 -right-4 bg-white rounded-2xl p-3.5 shadow-xl z-20">
              <div className="text-2xl font-bold text-primary" style={{fontFamily:"Georgia,serif"}}>3,000+</div>
              <div className="text-base text-gray-500">Satisfied Clients</div>
            </div>
            <div className="absolute bottom-8 -left-4 bg-primary text-white rounded-2xl p-3.5 shadow-xl z-20">
              <div className="text-2xl font-bold" style={{fontFamily:"Georgia,serif"}}>20+</div>
              <div className="text-base opacity-80">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────── */}
      <section className="bg-secondary py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 items-stretch">
          {STATS.map((s,i) => (
            <div key={i} className={`text-center py-4 px-4 flex flex-col items-center justify-center min-h-[100px] ${i<STATS.length-1?"border-r-2 border-primary/30":""}`}>
              <div className="text-4xl font-bold text-primary mb-0.5" style={{fontFamily:"Georgia,serif"}}>{s.number}</div>
              <div className="text-primary/80 text-sm">{s.label}</div>
              <div className="text-primary/60 text-xs">{s.labelTH}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────────────── */}
      <section className="section">
        <div className="container grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=700&q=80"
              alt="Who we are" className="w-full rounded-3xl shadow-2xl" />
            <div className="absolute bottom-8 -left-5 bg-primary text-white rounded-2xl p-3.5 shadow-xl flex items-center gap-2.5">
              <IconTrophy className="w-7 h-7 shrink-0"/><span className="text-lg font-medium">20+ Years Experience</span>
            </div>
            <div className="absolute top-8 -right-5 bg-[#1a1a2e] text-white rounded-2xl p-3.5 shadow-xl flex items-center gap-2.5">
              <IconGlobe className="w-7 h-7 shrink-0"/><span className="text-lg font-medium">30+ Countries</span>
            </div>
          </div>
          <div>
            <span className="badge-pill">Who We Are</span>
            <h2 className="mb-5">Our Expert Team combine &ldquo;Creativity with Innovation&rdquo; to create &ldquo;Solution&rdquo;</h2>
            <p className="text-gray-500 text-xl mb-4 leading-relaxed">
              &ldquo;SP&rdquo; เป็นผู้เชี่ยวชาญด้านกิจกรรมการตลาด และส่งเสริมการขาย ของที่ระลึก ของพรีเมียม ของแจก ของขวัญปีใหม่ให้ลูกค้า สินค้าพรีเมียม จัดหา ผลิตและจำหน่ายสินค้าของขวัญ
            </p>
            <p className="text-gray-500 text-xl mb-8 leading-relaxed">
              &ldquo;SP&rdquo; is a specialist in marketing activities and sales promotion. We design and produce premium gifts, corporate souvenirs, and branded merchandise for leading companies.
            </p>
            {["20+ years delivering premium merchandise","Custom design team on every project","100% quality guarantee on all orders"].map((item,i) => (
              <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3.5 border-l-4 border-primary mb-3">
                <IconCheck className="w-6 h-6 text-primary shrink-0"/>
                <span className="text-xl font-medium text-gray-700">{item}</span>
              </div>
            ))}
            <div className="mt-6"><Link href="/about" className="btn-primary">Learn More About Us →</Link></div>
          </div>
        </div>
      </section>

      {/* ── Services preview ─────────────────────────── */}
      <section className="section bg-accent">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge-pill">What We Offer</span>
            <h2>Our Core Services</h2>
            <p className="text-gray-500 text-xl mt-2">บริการหลักของเรา</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s,i) => (
              <Link href="/services" key={i} className="card group">
                <ServiceIcon name={s.icon} className="w-12 h-12 text-primary mb-4"/>
                <h3 className="text-2xl font-semibold mb-1.5">{s.title}</h3>
                <p className="text-primary text-lg mb-3">{s.titleTH}</p>
                <p className="text-gray-500 text-xl leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className="btn-outline">See All Services →</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-8">
            <span className="badge-pill">Testimonials</span>
            <h2>How customers like our services</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {CLIENTS.map(c => (
              <span key={c} className="px-5 py-2 bg-white border border-gray-200 rounded-full text-lg font-semibold text-gray-500">{c}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="card">
                <div className="text-yellow-400 text-2xl mb-3">{"★".repeat(t.stars)}</div>
                <p className="text-gray-600 text-xl leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">{t.name.slice(0,2).toUpperCase()}</div>
                  <div>
                    <div className="font-semibold text-xl">{t.name}</div>
                    <div className="text-lg text-gray-500">{t.role}</div>
                    <div className="text-lg text-primary font-medium">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="section bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-white mb-4">Ready to Create Something Unforgettable?</h2>
          <p className="text-white/80 text-2xl mb-10">สร้างความประทับใจให้กับแบรนด์ของคุณด้วยของพรีเมียมคุณภาพสูง</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/catalog" className="btn-white btn-lg">Browse Catalog</Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white/60 text-white rounded-full text-xl font-medium hover:bg-white/10 transition-all inline-flex items-center gap-2">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
