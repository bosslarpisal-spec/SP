import { createSupabaseServiceClient } from "@/lib/supabase-server";
import ServicesContent from "./ServicesContent";
import type { SvcItem, WhyItem, ProcItem } from "./ServicesContent";

export const metadata = { title: "Our Services" };
export const revalidate = 3600;

type ContentRow = { section: string; key: string; value: string };
function gv(rows: ContentRow[], section: string, key: string, fallback: string): string {
  return rows.find(r => r.section === section && r.key === key)?.value ?? fallback;
}
function ga<T>(rows: ContentRow[], section: string, key: string, fallback: T[]): T[] {
  const raw = rows.find(r => r.section === section && r.key === key)?.value;
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T[]; } catch { return fallback; }
}

const DEFAULT_SERVICES: SvcItem[] = [
  { n:"01", feat:true,  icon:"ti-gift",    title:"Premium Gifts",        th:"ของพรีเมียม",         desc:"Custom premium gifts from concept to delivery. We handle design, production, and packaging." },
  { n:"02", feat:false, icon:"ti-award",   title:"Corporate Souvenirs",  th:"ของที่ระลึกองค์กร",   desc:"High-quality branded souvenirs for events, exhibitions, and giveaways." },
  { n:"03", feat:false, icon:"ti-package", title:"New Year Packages",    th:"ชุดของขวัญปีใหม่",    desc:"Beautifully curated new-year gift sets that leave a lasting impression." },
  { n:"04", feat:false, icon:"ti-pencil",  title:"Custom Branding",      th:"งานพิมพ์แบรนด์",      desc:"Logo print, screen print, laser engraving, and full-colour embroidery." },
  { n:"05", feat:false, icon:"ti-settings",title:"OEM Manufacturing",    th:"การผลิต OEM",          desc:"End-to-end OEM product manufacturing with strict quality control." },
  { n:"06", feat:true,  icon:"ti-truck",   title:"Logistics & Delivery", th:"โลจิสติกส์และจัดส่ง", desc:"Reliable shipping to 30+ countries with real-time tracking and customs support." },
];
const DEFAULT_WHY: WhyItem[] = [
  { n:"01", icon:"ti-clock",  title:"20+ Years of Experience",  desc:"Decades of know-how delivering premium solutions across all sectors." },
  { n:"02", icon:"ti-pencil", title:"Custom Design Team",       desc:"In-house designers who bring your brand vision to life from concept to product." },
  { n:"03", icon:"ti-check",  title:"Strict Quality Control",   desc:"Multi-stage quality checks before every shipment leaves our facility." },
  { n:"04", icon:"ti-world",  title:"Global Export Capability", desc:"Exporting to 30+ countries with full logistics and customs support." },
];
const DEFAULT_PROCESS: ProcItem[] = [
  { n:"01", icon:"ti-message",  title:"Consultation",    desc:"We discuss your needs, target audience, and budget.",           active:false },
  { n:"02", icon:"ti-pencil",   title:"Design & Sample", desc:"Our team creates designs and sends physical samples.",           active:true  },
  { n:"03", icon:"ti-settings", title:"Production",      desc:"Full-scale manufacturing with quality control at every step.",  active:false },
  { n:"04", icon:"ti-truck",    title:"Delivery",        desc:"On-time delivery worldwide with full tracking support.",         active:false },
];

export default async function ServicesPage() {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase.from("page_content").select("section, key, value").eq("page", "services");
  const rows: ContentRow[] = data ?? [];

  return (
    <ServicesContent
      heroBadge      ={gv(rows, "hero",    "badge",          "WHAT WE OFFER")}
      heroHeading    ={gv(rows, "hero",    "heading",        "Our Core")}
      heroHeadingIt  ={gv(rows, "hero",    "heading_italic", "Services")}
      heroSubtextTh  ={gv(rows, "hero",    "subtext_th",     "บริการหลักของเรา")}
      heroDescription={gv(rows, "hero",    "description",    "From concept to delivery, SP manages every step. Our in-house design team, manufacturing partners, and logistics network ensure your premium products arrive on time, every time.")}
      heroStylesJson ={gv(rows, "hero",    "_styles",        "{}")}
      whyBadge       ={gv(rows, "why",     "badge",          "WHY CHOOSE US")}
      whyHeading     ={gv(rows, "why",     "heading",        "Why SP?")}
      whyStylesJson  ={gv(rows, "why",     "_styles",        "{}")}
      procBadge      ={gv(rows, "process", "badge",          "HOW IT WORKS")}
      procHeading    ={gv(rows, "process", "heading",        "Our Production Process")}
      procStylesJson ={gv(rows, "process", "_styles",        "{}")}
      serviceImage1  ={gv(rows, "services", "image1_url", "")}
      serviceImage2  ={gv(rows, "services", "image2_url", "")}
      services       ={ga<SvcItem> (rows, "services", "items", DEFAULT_SERVICES)}
      why            ={ga<WhyItem> (rows, "why",       "items", DEFAULT_WHY)}
      process        ={ga<ProcItem>(rows, "process",   "items", DEFAULT_PROCESS)}
    />
  );
}
