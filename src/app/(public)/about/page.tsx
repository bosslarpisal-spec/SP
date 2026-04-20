import Link from "next/link";
import { STATS } from "@/lib/data";

export const metadata = { title: "About Us" };

const MILESTONES = [
  { year:"2003", text:"Founded as a small premium gift sourcing company in Bangkok." },
  { year:"2008", text:"Expanded OEM manufacturing and began exporting to Southeast Asia." },
  { year:"2012", text:"Achieved 1,000+ satisfied clients. Opened new in-house design studio." },
  { year:"2018", text:"Launched Eco-Premium line — sustainable materials for corporate gifting." },
  { year:"2024", text:"Serving 3,000+ clients in 30+ countries. Still growing, still innovating." },
];

const TEAM = [
  { name:"Somchai P.",  role:"CEO & Founder",       img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name:"Nattaya W.",  role:"Head of Design",       img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
  { name:"Krit T.",     role:"Sales Director",       img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
  { name:"Ploy S.",     role:"Operations Manager",   img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
];

const CERTS = ["ISO 9001:2015","Sedex Member","Thailand Trust Mark","EcoVadis Bronze","TGP Certified"];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="badge-pill-white">About Us</span>
          <h1>Who We Are</h1>
          <p>ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชั่นครบวงจร มากว่า 20 ปี</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="badge-pill">Our Story</span>
            <h2 className="mb-5">Built on Creativity, Trust &amp; 20 Years of Excellence</h2>
            <p className="text-gray-500 text-xl leading-relaxed mb-4">
              &ldquo;SP&rdquo; (Siam Premium Product) was founded with a single mission: to help brands leave a lasting impression through thoughtfully crafted premium goods. What started as a small Bangkok-based sourcing firm has grown into a full-service premium merchandise company serving thousands of clients across Thailand and beyond.
            </p>
            <p className="text-gray-500 text-xl leading-relaxed mb-4">
              &ldquo;SP&rdquo; เป็นผู้เชี่ยวชาญด้านกิจกรรมการตลาด และส่งเสริมการขาย ของที่ระลึก ของพรีเมียม ของแจก ของขวัญปีใหม่ให้ลูกค้า และสินค้าพรีเมียมสำหรับองค์กรชั้นนำ
            </p>
            <p className="text-gray-500 text-xl leading-relaxed">
              Today our in-house design team, manufacturing partners, and logistics network allow us to deliver end-to-end solutions — from the first sketch to doorstep delivery — with unmatched speed and quality.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80"
            alt="Our story" className="rounded-3xl shadow-2xl w-full" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-secondary py-10">
        <div className="container grid grid-cols-2 md:grid-cols-4 items-stretch">
          {STATS.map((s,i) => (
            <div key={i} className={`text-center py-4 px-4 flex flex-col items-center justify-center min-h-[100px] ${i<STATS.length-1?"border-r-2 border-primary/30":""}`}>
              <div className="text-4xl font-bold text-primary mb-0.5" style={{fontFamily:"Georgia,serif"}}>{s.number}</div>
              <div className="text-primary/80 text-sm">{s.label}</div>
              <div className="text-primary/60 text-xs">{s.labelTH}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-accent">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="badge-pill">Our Journey</span>
            <h2>Key Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[4.5rem] top-0 bottom-0 w-0.5 bg-primary/20"/>
            {MILESTONES.map((m,i) => (
              <div key={i} className="flex gap-6 mb-8 items-start relative">
                <div className="w-16 text-right shrink-0 pt-1">
                  <span className="text-primary font-bold text-lg">{m.year}</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md mt-1 shrink-0 relative z-10"/>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1">
                  <p className="text-gray-600 text-lg leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge-pill">The Team</span>
            <h2>Meet Our Leadership</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((m,i) => (
              <div key={i} className="card text-center">
                <img src={m.img} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4"/>
                <div className="font-semibold text-lg">{m.name}</div>
                <div className="text-primary text-base font-medium mt-1">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-sm bg-accent">
        <div className="container text-center">
          <p className="text-base font-bold tracking-widest uppercase text-primary mb-6">Certifications &amp; Memberships</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {CERTS.map(c => (
              <span key={c} className="px-5 py-2 bg-white border border-gray-200 rounded-full text-lg font-medium text-gray-600">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary text-white text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-white mb-4">Ready to Work Together?</h2>
          <p className="text-white/80 text-xl mb-8">Let&apos;s build something remarkable for your brand.</p>
          <Link href="/contact" className="btn-white btn-lg">Contact Us Today →</Link>
        </div>
      </section>
    </>
  );
}
