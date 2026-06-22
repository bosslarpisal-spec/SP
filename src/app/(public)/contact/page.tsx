import { createSupabaseServiceClient } from "@/lib/supabase-server";
import ContactClient from "./ContactClient";

export const metadata = { title: "Contact Us" };
export const revalidate = 3600;

type CR = { section: string; key: string; value: string };
function gv(rows: CR[], section: string, key: string, fb: string) {
  return rows.find(r => r.section === section && r.key === key)?.value ?? fb;
}

export default async function ContactPage() {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase.from("page_content").select("section, key, value").eq("page", "contact");
  const rows: CR[] = data ?? [];

  return (
    <ContactClient
      heroBadge      ={gv(rows, "hero",   "badge",       "Get In Touch")}
      heroHeading    ={gv(rows, "hero",   "heading",     "Contact Us")}
      heroSubtextTh  ={gv(rows, "hero",   "subtext_th",  "ติดต่อเราเพื่อรับคำปรึกษาและใบเสนอราคาฟรี")}
      heroDescription={gv(rows, "hero",   "description", "We're here to help you create the perfect premium experience for your brand.")}
      phone1         ={gv(rows, "info",   "phone1",      "02 555 1234")}
      phone2         ={gv(rows, "info",   "phone2",      "02 555 5678")}
      mobile         ={gv(rows, "info",   "mobile",      "086 999 0000")}
      email          ={gv(rows, "info",   "email",       "info@siampremium.com")}
      address        ={gv(rows, "info",   "address",     "88 Sukhumvit Road, Khlong Toei, Bangkok 10110")}
      addressTh      ={gv(rows, "info",   "address_th",  "88 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพมหานคร 10110")}
      hours          ={gv(rows, "info",   "hours",       "Mon – Fri  09.00 – 18.00")}
      facebook       ={gv(rows, "social", "facebook",    "https://facebook.com")}
      instagram      ={gv(rows, "social", "instagram",   "https://instagram.com")}
      line           ={gv(rows, "social", "line",        "https://line.me")}
    />
  );
}

