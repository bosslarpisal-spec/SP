import Link from "next/link";
import { SERVICES } from "@/lib/data";
import { ServiceIcon } from "@/lib/icons";

export const metadata = { title: "Our Services" };

const PROCESS = [
  { step:"1", title:"Consultation",    desc:"We discuss your needs, target audience, budget, and brand requirements." },
  { step:"2", title:"Design & Sample", desc:"Our team creates designs and sends physical samples for your approval." },
  { step:"3", title:"Production",      desc:"Full-scale manufacturing with multi-stage quality control at every step." },
  { step:"4", title:"Delivery",        desc:"On-time delivery nationwide and worldwide with full tracking support." },
];

const WHY = [
  { n:"01", title:"20+ Years of Experience",  desc:"Decades of know-how delivering premium solutions across all sectors." },
  { n:"02", title:"Custom Design Team",        desc:"In-house designers who bring your brand vision to life from concept to product." },
  { n:"03", title:"Strict Quality Control",    desc:"Every product undergoes multi-stage quality checks before shipping." },
  { n:"04", title:"Global Export Capability",  desc:"Exporting to 30+ countries with full logistics and customs support." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="badge-pill-white">What We Offer</span>
          <h1>Our Services</h1>
          <p>บริการครบวงจรด้านของพรีเมียมและโปรโมชั่น</p>
        </div>
      </section>

      {/* All services */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge-pill">Our Expertise</span>
            <h2>Everything Under One Roof</h2>
            <p className="text-gray-500 text-xl mt-2">ทุกบริการที่คุณต้องการ อยู่ในที่เดียว</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s,i) => (
              <div key={i} className="card group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl"/>
                <ServiceIcon name={s.icon} className="w-10 h-10 text-primary mb-4"/>
                <h3 className="text-xl font-semibold mb-1">{s.title}</h3>
                <p className="text-primary text-base mb-3">{s.titleTH}</p>
                <p className="text-gray-500 text-lg leading-relaxed mb-3">{s.desc}</p>
                <p className="text-gray-400 text-base leading-relaxed">{s.descTH}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-accent">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge-pill">How It Works</span>
            <h2>Our Simple 4-Step Process</h2>
            <p className="text-gray-500 text-xl mt-2">ขั้นตอนการทำงานของเรา</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map((p,i) => (
              <div key={i} className="card-flat text-center relative">
                {i < PROCESS.length-1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 text-primary text-3xl font-bold z-10">→</div>
                )}
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{fontFamily:"Georgia,serif"}}>{p.step}</div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-500 text-base leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section">
        <div className="container grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="badge-pill">Why Choose SP</span>
            <h2 className="mb-8">Trusted by 3,000+ Brands Across Thailand</h2>
            <div className="space-y-5">
              {WHY.map((w,i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 min-w-[2.5rem] bg-blue-50 text-primary rounded-xl flex items-center justify-center font-bold text-lg">{w.n}</div>
                  <div>
                    <div className="font-semibold text-lg mb-1">{w.title}</div>
                    <div className="text-gray-500 text-lg">{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/contact" className="btn-primary">Get a Free Quote →</Link>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80"
            alt="Our team" className="rounded-3xl shadow-2xl w-full" />
        </div>
      </section>
    </>
  );
}
