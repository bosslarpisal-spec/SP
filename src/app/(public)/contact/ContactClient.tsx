"use client";
import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { IconPhone, IconMail, IconClock, IconMapPin, IconCheckCircle, IconLock } from "@/lib/icons";
import GoldDivider from "@/components/ui/GoldDivider";

/* ── Inline social icon SVGs ─────────────────────────────── */
function IconFacebook({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function IconInstagram({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}
function IconLineApp({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );
}

/* ── style helpers ───────────────────────────────────────── */
type BS = Record<string, string>;

function gs(obj: Record<string, BS>, key: string, def: BS): BS {
  const ov = obj[key] ?? {};
  return { color: ov.color ?? def.color, fontSize: ov.fontSize ?? def.fontSize };
}

const inputBase: React.CSSProperties = {
  background: "#F8F6F1", border: "1px solid rgba(13,30,61,0.15)",
  borderRadius: 8, padding: "10px 16px", fontSize: 16, color: "#0D1E3D", width: "100%", outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, textTransform: "uppercase",
  letterSpacing: "0.08em", color: "#4A5568", marginBottom: 6,
};
function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "#1C2951";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(28,41,81,0.08)";
}
function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "rgba(13,30,61,0.15)";
  e.currentTarget.style.boxShadow = "none";
}
function GoldLine({ width = 24 }: { width?: number }) {
  return <span style={{ width, height: 1, background: "#E8D5A3", display: "inline-block", flexShrink: 0 }} />;
}

/* ── Props ───────────────────────────────────────────────── */
interface ContactClientProps {
  heroBadge: string;
  heroHeading: string;
  heroSubtextTh: string;
  heroDescription: string;
  heroStylesJson: string;
  phone1: string;
  phone2: string;
  mobile: string;
  email: string;
  address: string;
  addressTh: string;
  hours: string;
  hoursTh: string;
  infoStylesJson: string;
  facebook: string;
  instagram: string;
  line: string;
  mapBadge: string;
  mapHeading: string;
  mapBtn: string;
  mapStylesJson: string;
}

/* ── Component ───────────────────────────────────────────── */
export default function ContactClient({
  heroBadge, heroHeading, heroSubtextTh, heroDescription, heroStylesJson,
  phone1, phone2, mobile, email, address, addressTh, hours, hoursTh, infoStylesJson,
  facebook, instagram, line,
  mapBadge, mapHeading, mapBtn, mapStylesJson,
}: ContactClientProps) {
  const { lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", interest: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setStatus(res.ok ? "ok" : "err");
    } catch { setStatus("err"); }
  }

  /* ── Resolve styles ─── */
  const heroSt: Record<string, BS> = (() => { try { return JSON.parse(heroStylesJson); } catch { return {}; } })();
  const infoSt: Record<string, BS> = (() => { try { return JSON.parse(infoStylesJson); } catch { return {}; } })();
  const mapSt:  Record<string, BS> = (() => { try { return JSON.parse(mapStylesJson);  } catch { return {}; } })();

  const hBadge = gs(heroSt, "badge",       { color: "#E8D5A3",                fontSize: "10px" });
  const hHead  = gs(heroSt, "heading",     { color: "#FFFFFF",                fontSize: "48px" });
  const hSubTh = gs(heroSt, "subtext_th",  { color: "rgba(255,255,255,0.7)",  fontSize: "13px" });
  const hDesc  = gs(heroSt, "description", { color: "rgba(255,255,255,0.90)", fontSize: "14px" });

  const iPhone = gs(infoSt, "phone_value",   { color: "#0D1E3D", fontSize: "14px" });
  const iEmail = gs(infoSt, "email_value",   { color: "#0D1E3D", fontSize: "14px" });
  const iHours = gs(infoSt, "hours_value",   { color: "#0D1E3D", fontSize: "14px" });
  const iAddr  = gs(infoSt, "address_value", { color: "#0D1E3D", fontSize: "14px" });

  const mBadge = gs(mapSt, "badge",   { color: "#F0DC9A",  fontSize: "10px" });
  const mHead  = gs(mapSt, "heading", { color: "#FFFFFF",  fontSize: "30px" });
  const mBtn   = gs(mapSt, "btn",     { color: "#E8D5A3",  fontSize: "14px" });

  const displayAddress = lang === "th" && addressTh ? addressTh : address;
  const displayHours   = lang === "th" && hoursTh   ? hoursTh   : hours;

  const INFO = [
    { icon: <IconPhone className="w-5 h-5" />,  label: "PHONE",   lines: [phone1, phone2, mobile].filter(Boolean), itemStyle: iPhone },
    { icon: <IconMail className="w-5 h-5" />,   label: "EMAIL",   lines: [email].filter(Boolean),                  itemStyle: iEmail },
    { icon: <IconClock className="w-5 h-5" />,  label: "HOURS",   lines: [displayHours].filter(Boolean),           itemStyle: iHours },
    { icon: <IconMapPin className="w-5 h-5" />, label: "ADDRESS", lines: [displayAddress].filter(Boolean),         itemStyle: iAddr  },
  ];

  const SOCIALS = [
    { label: "Facebook",  href: facebook,  Icon: IconFacebook  },
    { label: "Instagram", href: instagram, Icon: IconInstagram },
    { label: "LINE",      href: line,      Icon: IconLineApp   },
  ].filter(s => s.href);

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div style={{ background: "#1C2951" }}>
      <style>{`
        @media (max-width: 767px) {
          .contact-hero-h1 { font-size: clamp(26px, 8vw, 38px) !important; }
          .contact-form-card { padding: 20px !important; }
        }
      `}</style>

      {/* § HERO ──────────────────────────────────── */}
      <section className="relative flex items-center justify-center"
        style={{ minHeight: "45vh", background: "#1C2951", backgroundImage: "radial-gradient(rgba(232,213,163,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }}>
        <div className="relative z-10 text-center px-6 pb-20 max-w-3xl mx-auto" style={{ paddingTop: "120px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
            <div style={{ width: "24px", height: "1.5px", background: "#E8D5A3", flexShrink: 0 }} />
            <span style={{ letterSpacing: "0.18em", textTransform: "uppercase", color: hBadge.color, fontSize: hBadge.fontSize }}>{heroBadge}</span>
          </div>
          <h1 className="mb-4 contact-hero-h1" style={{ fontFamily: "Georgia, serif", fontWeight: 400, lineHeight: 1.1, color: hHead.color, fontSize: hHead.fontSize }}>
            <span style={{ position: "relative", display: "inline-block", marginBottom: "4px" }}>
              {heroHeading}
              <span style={{ position: "absolute", bottom: "-4px", left: 0, height: "2px", width: "100%", background: "linear-gradient(to right, #E8D5A3, transparent)", display: "block" }} />
            </span>
          </h1>
          {lang === "th" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} className="mb-2">
              <span style={{ width: "16px", height: "1px", background: "#E8D5A3", opacity: 0.4, flexShrink: 0, display: "block" }} />
              <span style={{ fontSize: hSubTh.fontSize, color: hSubTh.color }}>{heroSubtextTh}</span>
            </div>
          )}
          <p className="mb-8" style={{ color: hDesc.color, fontSize: hDesc.fontSize }}>{heroDescription}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Response within 1 business day", "Free consultation"].map(pill => (
              <span key={pill} className="text-sm px-4 py-1.5 rounded-full" style={{ border: "1px solid rgba(232,213,163,0.3)", color: "#E8D5A3" }}>{pill}</span>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* § MAIN CONTENT ───────────────────────────── */}
      <section className="py-16" style={{ background: "#F8F6F1" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-[2fr_3fr] gap-12 items-start">

            {/* LEFT: Contact Details */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <GoldLine width={24} />
                <span className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: "#8A6E00" }}>Contact Details</span>
              </div>
              <h2 className="text-2xl mb-3" style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: "#0D1E3D" }}>
                Let&apos;s Talk About Your Next Project
              </h2>
              <p className="text-sm mb-8" style={{ color: "#2C3E50" }}>
                Our team is ready to assist you with premium gifting solutions tailored to your brand.
              </p>
              {INFO.map((item, i) => (
                <div key={i} className="flex gap-4 items-start pb-5 mb-5" style={{ borderBottom: "1px solid rgba(13,30,61,0.08)" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(13,30,61,0.06)", border: "1px solid rgba(13,30,61,0.12)", color: "#8A6E00" }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "#8A6E00" }}>{item.label}</div>
                    {item.lines.map((line, j) => (
                      <div key={j} className="leading-relaxed" style={{ color: item.itemStyle.color, fontSize: item.itemStyle.fontSize }}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}
              {SOCIALS.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs tracking-widest uppercase mb-3" style={{ color: "#8A6E00" }}>Follow Us</div>
                  <div className="flex gap-2">
                    {SOCIALS.map(({ label, href, Icon }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "rgba(13,30,61,0.06)", border: "1px solid rgba(13,30,61,0.12)", color: "#0D1E3D" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(13,30,61,0.12)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(13,30,61,0.06)")}>
                        <Icon />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Contact Form */}
            <div>
              {status === "ok" ? (
                <div className="contact-form-card rounded-2xl p-10 text-center" style={{ background: "#fff", boxShadow: "0 4px 40px rgba(0,0,0,0.25)" }}>
                  <div className="flex justify-center mb-4"><IconCheckCircle className="w-14 h-14 text-green-500" /></div>
                  <h3 className="text-xl mb-2" style={{ fontFamily: "Georgia, serif", color: "#1C2951" }}>Message Sent!</h3>
                  <p className="text-sm mb-6" style={{ color: "#4A5568" }}>
                    Thank you! We&apos;ll get back to you within 1 business day.<br />
                    ขอบคุณที่ติดต่อเรา เราจะตอบกลับภายใน 1 วันทำการ
                  </p>
                  <button onClick={() => { setStatus("idle"); setForm({ name:"",email:"",phone:"",company:"",interest:"",message:"" }); }}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ border: "1px solid rgba(13,30,61,0.25)", color: "#0D1E3D", background: "transparent" }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="contact-form-card rounded-2xl p-8" style={{ background: "#fff", boxShadow: "0 4px 40px rgba(0,0,0,0.25)" }}>
                  <h3 className="text-xl font-medium" style={{ fontFamily: "Georgia, serif", color: "#1C2951" }}>Send Us a Message</h3>
                  <p className="text-sm mt-1" style={{ color: "#4A5568" }}>ส่งข้อความถึงเรา — เราจะติดต่อกลับภายใน 1 วันทำการ</p>
                  <div className="mt-4 mb-6" style={{ borderTop: "1px solid rgba(13,30,61,0.1)" }} />
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input type="text" required placeholder="Your name" value={form.name} onChange={e => update("name", e.target.value)} style={inputBase} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                      <div>
                        <label style={labelStyle}>Email *</label>
                        <input type="email" required placeholder="you@email.com" value={form.email} onChange={e => update("email", e.target.value)} style={inputBase} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Phone</label>
                        <input type="tel" placeholder="08x-xxx-xxxx" value={form.phone} onChange={e => update("phone", e.target.value)} style={inputBase} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                      <div>
                        <label style={labelStyle}>Company</label>
                        <input type="text" placeholder="Company name" value={form.company} onChange={e => update("company", e.target.value)} style={inputBase} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Interested In</label>
                      <select value={form.interest} onChange={e => update("interest", e.target.value)} style={inputBase} onFocus={handleFocus} onBlur={handleBlur}>
                        <option value="">— Please select —</option>
                        {["Premium Gifts / ของพรีเมียม","Corporate Souvenirs / ของที่ระลึก","New Year Packages / ชุดของขวัญปีใหม่","Custom Branding / งานพิมพ์แบรนด์","OEM Manufacturing / การผลิต OEM","Other / อื่นๆ"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Message *</label>
                      <textarea required rows={5} placeholder="Tell us about your project — quantity, deadline, budget, any special requirements…"
                        value={form.message} onChange={e => update("message", e.target.value)}
                        style={{ ...inputBase, minHeight: 120, resize: "none" }} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <button type="submit" disabled={status === "loading"} className="w-full rounded-lg font-semibold hover:opacity-80 transition-opacity"
                      style={{ background: "#1C2951", color: "#E8D5A3", fontSize: 14, padding: "14px", opacity: status === "loading" ? 0.7 : 1, cursor: status === "loading" ? "not-allowed" : "pointer" }}>
                      {status === "loading" ? "Sending…" : "Send Message →"}
                    </button>
                    {status === "err" && <p style={{ fontSize: "13px", color: "#DC2626", textAlign: "center", margin: "0" }}>Something went wrong. Please try again or email us directly.</p>}
                    <div className="flex items-center justify-center gap-1.5">
                      <IconLock className="w-3.5 h-3.5 text-[#B0A898]" />
                      <span className="text-xs" style={{ color: "#B0A898" }}>Your information is kept confidential</span>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <GoldDivider />

      {/* § FOOTER CTA ───────────────────────────────── */}
      <section className="py-16" style={{ background: "#1C2951" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <GoldLine width={24} />
            <span className="tracking-[0.2em] uppercase font-medium" style={{ color: mBadge.color, fontSize: mBadge.fontSize }}>{mapBadge}</span>
            <GoldLine width={24} />
          </div>
          <h2 className="mb-3" style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: mHead.color, fontSize: mHead.fontSize }}>{mapHeading}</h2>
          <p className="mb-6" style={{ color: "rgba(255,255,255,0.90)", fontSize: "14px" }}>{displayAddress}</p>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-opacity hover:opacity-80 mb-10"
            style={{ border: "1px solid rgba(232,213,163,0.5)", color: mBtn.color, fontSize: mBtn.fontSize }}>
            {mapBtn}
          </a>
          <div className="rounded-xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            <iframe width="100%" height="300" style={{ border: "none", display: "block" }} src={embedUrl}
              title="Office Location" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      <GoldDivider />
    </div>
  );
}
