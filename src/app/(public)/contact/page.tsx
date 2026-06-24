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
      heroStylesJson ={gv(rows, "hero",   "_styles",     "{}")}
      phone1         ={gv(rows, "info",   "phone1",      "02 555 1234")}
      phone2         ={gv(rows, "info",   "phone2",      "02 555 5678")}
      mobile         ={gv(rows, "info",   "mobile",      "086 999 0000")}
      email          ={gv(rows, "info",   "email",       "spproduce.dist@gmail.com")}
      address        ={gv(rows, "info",   "address",     "88 Sukhumvit Road, Khlong Toei, Bangkok 10110")}
      addressTh      ={gv(rows, "info",   "address_th",  "88 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพมหานคร 10110")}
      hours          ={gv(rows, "info",   "hours",       "Mon – Fri  09.00 – 18.00")}
      hoursTh        ={gv(rows, "info",   "hours_th",    "จ–ศ  09.00 – 18.00")}
      infoStylesJson ={gv(rows, "info",   "_styles",     "{}")}
      facebook       ={gv(rows, "social", "facebook",    "https://facebook.com")}
      instagram      ={gv(rows, "social", "instagram",   "https://instagram.com")}
      line           ={gv(rows, "social", "line",        "https://line.me")}
      mapBadge       ={gv(rows, "map",    "badge",       "FIND US")}
      mapHeading     ={gv(rows, "map",    "heading",     "Visit Our Office")}
      mapBtn         ={gv(rows, "map",    "btn_label",   "Get Directions →")}
      mapStylesJson  ={gv(rows, "map",    "_styles",     "{}")}
    />
  );
}

