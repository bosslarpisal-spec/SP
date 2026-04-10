"use client";
import { useState } from "react";
import { BRAND } from "@/lib/data";
import { IconPhone, IconMail, IconClock, IconMapPin, IconCheckCircle } from "@/lib/icons";

export default function ContactPage() {
  const [form, setForm]       = useState({ name:"", email:"", phone:"", company:"", interest:"", message:"" });
  const [status, setStatus]   = useState<"idle"|"loading"|"ok">("idle");

  function update(k: string, v: string) { setForm(f => ({...f, [k]:v})); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1000)); // simulate API
    setStatus("ok");
  }

  const INFO = [
    { icon:<IconPhone   className="w-5 h-5 text-primary"/>, label:"Phone",   lines:[BRAND.phone1, BRAND.phone2, BRAND.mobile] },
    { icon:<IconMail    className="w-5 h-5 text-primary"/>, label:"Email",   lines:[BRAND.email] },
    { icon:<IconClock   className="w-5 h-5 text-primary"/>, label:"Hours",   lines:[BRAND.hours] },
    { icon:<IconMapPin  className="w-5 h-5 text-primary"/>, label:"Address", lines:[BRAND.address, BRAND.addressTH] },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="badge-pill-white">Get In Touch</span>
          <h1>Contact Us</h1>
          <p>ติดต่อเราเพื่อรับคำปรึกษาและใบเสนอราคาฟรี</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid md:grid-cols-5 gap-12">

          {/* Info column */}
          <div className="md:col-span-2 space-y-4">
            <span className="badge-pill">Contact Details</span>
            <h2 className="mb-6">Let&apos;s Talk About Your Next Project</h2>
            {INFO.map((item,i) => (
              <div key={i} className="card-flat flex gap-4 items-start">
                <div className="w-11 h-11 min-w-[2.75rem] bg-blue-50 rounded-xl flex items-center justify-center text-lg">{item.icon}</div>
                <div>
                  <div className="text-base font-bold tracking-widest uppercase text-gray-400 mb-1">{item.label}</div>
                  {item.lines.map((l,j) => (
                    <div key={j} className="text-lg text-gray-700 leading-relaxed">{l}</div>
                  ))}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="card-flat">
              <div className="text-base font-bold tracking-widest uppercase text-gray-400 mb-3">Follow Us</div>
              <div className="flex gap-2 flex-wrap">
                {[["Facebook","#facebook","#1877F2"],["Instagram","#instagram","#E1306C"],["Line","#line","#06C755"],["YouTube","#youtube","#FF0000"],["TikTok","#tiktok","#010101"],["Twitter","#twitter","#1DA1F2"]].map(([name,href,bg]) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-white text-base font-semibold hover:opacity-90 transition-opacity"
                    style={{background:bg}}>{name}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="md:col-span-3">
            {status === "ok" ? (
              <div className="card-flat text-center py-16">
                <div className="flex justify-center mb-4"><IconCheckCircle className="w-14 h-14 text-green-500"/></div>
                <h3 className="mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-xl mb-6">Thank you! We&apos;ll get back to you within 1 business day.<br/>ขอบคุณที่ติดต่อเรา เราจะตอบกลับภายใน 1 วันทำการ</p>
                <button onClick={() => { setStatus("idle"); setForm({name:"",email:"",phone:"",company:"",interest:"",message:""}); }}
                  className="btn-outline">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-flat space-y-4">
                <div>
                  <h3 className="mb-1">Send Us a Message</h3>
                  <p className="text-gray-500 text-lg mb-5">ส่งข้อความถึงเรา — เราจะติดต่อกลับภายใน 1 วันทำการ</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input type="text" required className="form-input" placeholder="Your name"
                      value={form.name} onChange={e => update("name",e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input type="email" required className="form-input" placeholder="you@email.com"
                      value={form.email} onChange={e => update("email",e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" placeholder="08x-xxx-xxxx"
                      value={form.phone} onChange={e => update("phone",e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Company</label>
                    <input type="text" className="form-input" placeholder="Company name"
                      value={form.company} onChange={e => update("company",e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Interested In</label>
                  <select className="form-input" value={form.interest} onChange={e => update("interest",e.target.value)}>
                    <option value="">— Please select —</option>
                    {["Premium Gifts / ของพรีเมียม","Corporate Souvenirs / ของที่ระลึก","New Year Packages / ชุดของขวัญปีใหม่","Custom Branding / งานพิมพ์แบรนด์","OEM Manufacturing / การผลิต OEM","Other / อื่นๆ"].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea required rows={5} className="form-input resize-none"
                    placeholder="Tell us about your project — quantity, deadline, budget, any special requirements…"
                    value={form.message} onChange={e => update("message",e.target.value)} />
                </div>
                <button type="submit" disabled={status==="loading"} className="btn-primary w-full justify-center btn-lg">
                  {status==="loading" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
