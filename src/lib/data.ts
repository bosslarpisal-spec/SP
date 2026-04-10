// ============================================================
//  src/lib/data.ts
//  ⭐ Edit this file to change content, products, colors, etc.
// ============================================================

// ── Brand ──────────────────────────────────────────────────
export const BRAND = {
  name:      "SP",
  fullName:  "Siam Premium Product",
  tagline:   "Total Premiums & Promotion Solution",
  taglineTH: "ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชั่นครบวงจร",
  email:     "info@siampremium.com",
  phone1:    "02 555 1234",
  phone2:    "02 555 5678",
  mobile:    "086 999 0000",
  address:   "88 Sukhumvit Road, Khlong Toei, Bangkok 10110",
  addressTH: "88 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพมหานคร 10110",
  hours:     "Mon – Fri  09.00 – 18.00",
  social: {
    facebook:  "https://facebook.com",
    instagram: "https://instagram.com",
    line:      "https://line.me",
    youtube:   "https://youtube.com",
    tiktok:    "https://tiktok.com",
    twitter:   "https://twitter.com",
  },
};

// ── Navigation ─────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home",     href: "/home"     },
  { label: "About",    href: "/about"    },
  { label: "Services", href: "/services" },
  { label: "Catalog",  href: "/catalog"  },
  { label: "Our Work", href: "/work"     },
  { label: "Contact",  href: "/contact"  },
];

// ── Product categories (add/remove as needed) ──────────────
export const CATEGORIES = [
  "All",
  "IT Gadgets",
  "Bags",
  "Premium Sets",
  "Drinkware",
  "Stationery",
  "Souvenirs",
  "Packaging",
];

// ── Products ───────────────────────────────────────────────
export type Product = {
  id:       number;
  name:     string;
  nameTH:   string;
  category: string;
  desc:     string;
  descTH:   string;
  image:    string;
  isNew?:   boolean;
  tags:     string[];
};

// To add a product: copy one block below, change values, save.
export const PRODUCTS: Product[] = [
  {
    id: 1, name: "Eco Water Bottle", nameTH: "กระบอกน้ำรักษ์โลก",
    category: "Drinkware",
    desc: "Stainless steel insulated bottle with custom laser engraving. Keeps cold 24hrs, hot 12hrs.",
    descTH: "กระบอกน้ำสแตนเลสพร้อมแกะสลักเลเซอร์ตามสั่ง เก็บความเย็น 24 ชม. ความร้อน 12 ชม.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    tags: ["eco", "custom"],
  },
  {
    id: 2, name: "Luxury Gift Box Set", nameTH: "ชุดกล่องของขวัญหรู",
    category: "Premium Sets",
    desc: "Premium kraft box with ribbon, custom insert card, and tissue paper wrapping.",
    descTH: "กล่องคราฟต์พรีเมียมพร้อมริบบิ้น การ์ดอินเสิร์ตกำหนดเอง และกระดาษทิชชูห่อ",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80",
    isNew: true, tags: ["luxury", "gift", "new-year"],
  },
  {
    id: 3, name: "Branded Backpack", nameTH: "กระเป๋าเป้แบรนด์",
    category: "Bags",
    desc: "Water-resistant polyester backpack with padded laptop sleeve and logo embroidery.",
    descTH: "กระเป๋าเป้โพลีเอสเตอร์กันน้ำพร้อมช่องใส่แล็ปท็อปและปักโลโก้",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    tags: ["bag", "corporate"],
  },
  {
    id: 4, name: "Wireless Earbuds", nameTH: "หูฟังไร้สาย",
    category: "IT Gadgets",
    desc: "TWS earbuds in custom branded charging case. BT 5.3, 6hr battery + 24hr case.",
    descTH: "หูฟัง TWS พร้อมเคสชาร์จแบรนด์กำหนดเอง BT 5.3 แบตเตอรี่ 6+24 ชม.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    isNew: true, tags: ["tech", "gadget"],
  },
  {
    id: 5, name: "Notebook & Pen Set", nameTH: "ชุดสมุดและปากกา",
    category: "Stationery",
    desc: "A5 hardcover notebook with metal ballpoint pen in a magnetic gift sleeve.",
    descTH: "สมุดปกแข็ง A5 พร้อมปากกาลูกลื่นโลหะในซองของขวัญแม่เหล็ก",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80",
    tags: ["stationery", "office"],
  },
  {
    id: 6, name: "Smart Power Bank", nameTH: "พาวเวอร์แบงค์อัจฉริยะ",
    category: "IT Gadgets",
    desc: "10,000mAh slim power bank with USB-C PD & wireless charging pad on top.",
    descTH: "พาวเวอร์แบงค์สลิม 10,000mAh พร้อม USB-C PD และแผ่นชาร์จไร้สายด้านบน",
    image: "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=600&q=80",
    tags: ["tech", "gadget"],
  },
  {
    id: 7, name: "Ceramic Mug Set", nameTH: "ชุดแก้วเซรามิก",
    category: "Drinkware",
    desc: "Set of 2 hand-painted ceramic mugs with custom message printing.",
    descTH: "แก้วเซรามิกทาสีมือ 2 ใบพร้อมพิมพ์ข้อความกำหนดเอง",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    tags: ["drinkware", "gift"],
  },
  {
    id: 8, name: "Canvas Tote Bag", nameTH: "กระเป๋าผ้าแคนวาส",
    category: "Bags",
    desc: "Eco-friendly 12oz cotton canvas tote with full-colour screen print.",
    descTH: "กระเป๋าผ้าแคนวาสฝ้าย 12oz รักษ์โลกพร้อมพิมพ์สกรีนสีเต็ม",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
    tags: ["eco", "bag"],
  },
  {
    id: 9, name: "Bamboo Desk Organiser", nameTH: "ที่จัดระเบียบโต๊ะไม้ไผ่",
    category: "Stationery",
    desc: "Sustainable bamboo desk organiser with 4 compartments and laser-engraved logo.",
    descTH: "ที่จัดระเบียบโต๊ะไม้ไผ่ยั่งยืน 4 ช่องพร้อมแกะสลักโลโก้เลเซอร์",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    isNew: true, tags: ["eco", "office"],
  },
  {
    id: 10, name: "Gift Hamper", nameTH: "แฮมเปอร์ของขวัญ",
    category: "Premium Sets",
    desc: "Curated hamper with artisan snacks, scented candle, and branded accessories.",
    descTH: "แฮมเปอร์คัดสรรพร้อมขนมอาร์ติซาน เทียนหอม และของแต่งแบรนด์",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    tags: ["luxury", "gift", "new-year"],
  },
  {
    id: 11, name: "Custom Rigid Box", nameTH: "กล่องแข็งกำหนดเอง",
    category: "Packaging",
    desc: "Two-piece rigid box with hot-stamp foil lid and magnetic closure.",
    descTH: "กล่องแข็งสองชิ้นพร้อมฝาปั๊มฟอยล์และแม่เหล็กล็อค",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
    tags: ["packaging"],
  },
  {
    id: 12, name: "USB Flash Drive", nameTH: "แฟลชไดรฟ์ USB",
    category: "IT Gadgets",
    desc: "32GB metal USB 3.0 flash drive with custom laser engraving in gift tin.",
    descTH: "แฟลชไดรฟ์โลหะ USB 3.0 32GB พร้อมแกะสลักเลเซอร์ในกล่องดีบุกของขวัญ",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=600&q=80",
    tags: ["tech", "gadget"],
  },
];

// ── Stats ──────────────────────────────────────────────────
export const STATS = [
  { number: "3,000+",  label: "Satisfied Clients",  labelTH: "ลูกค้าที่พึงพอใจ" },
  { number: "50,000+", label: "Projects Done",      labelTH: "โปรเจกต์สำเร็จ"   },
  { number: "20+",     label: "Years Experience",   labelTH: "ปีประสบการณ์"      },
  { number: "30+",     label: "Export Countries",   labelTH: "ประเทศที่ส่งออก"   },
];

// ── Services ───────────────────────────────────────────────
export const SERVICES = [
  { icon: "gift",     title: "Premium Gifts",        titleTH: "ของพรีเมียม",           desc: "Custom premium gifts designed to impress clients and strengthen brand loyalty.", descTH: "ของพรีเมียมออกแบบพิเศษเพื่อสร้างความประทับใจ" },
  { icon: "souvenir", title: "Corporate Souvenirs",  titleTH: "ของที่ระลึกองค์กร",     desc: "High-quality branded souvenirs for events, exhibitions, and giveaways.",       descTH: "ของที่ระลึกแบรนด์คุณภาพสูงสำหรับงานอีเวนต์" },
  { icon: "package",  title: "New Year Packages",    titleTH: "ชุดของขวัญปีใหม่",      desc: "Beautifully curated new-year gift sets that leave a lasting impression.",       descTH: "ชุดของขวัญปีใหม่ที่คัดสรรอย่างสวยงาม" },
  { icon: "branding", title: "Custom Branding",      titleTH: "งานพิมพ์แบรนด์",        desc: "Logo printing, screen print, laser engraving, and full-colour embroidery.",     descTH: "บริการแบรนด์ครบวงจร — พิมพ์โลโก้ สกรีน แกะสลักเลเซอร์" },
  { icon: "factory",  title: "OEM Manufacturing",    titleTH: "การผลิต OEM",            desc: "End-to-end OEM product manufacturing with strict quality control.",             descTH: "การผลิต OEM ครบวงจรพร้อมมาตรฐานการควบคุมคุณภาพ" },
  { icon: "truck",    title: "Logistics & Delivery", titleTH: "โลจิสติกส์และจัดส่ง",  desc: "Reliable nationwide and international shipping with real-time tracking.",       descTH: "การจัดส่งทั่วประเทศและต่างประเทศพร้อมติดตามเรียลไทม์" },
];

// ── Testimonials ───────────────────────────────────────────
export const TESTIMONIALS = [
  { name: "Satchaporn W.", role: "Buyer & Purchases Ops", company: "P&G Thailand",   text: "พนักงานมี Service Mind ใจเย็น รับฟัง Flexible และมีความเข้าใจถึง Business Need แสดงให้เห็นถึงความยินดีที่จะให้บริการกับลูกค้าอย่างเต็มที่", stars: 5 },
  { name: "Prawit K.",      role: "Marketing Manager",    company: "Acer Thailand",   text: "SP always delivers on time and quality exceeds expectations. They understood our brief immediately and produced outstanding results.", stars: 5 },
  { name: "Nattawan S.",    role: "Brand Executive",      company: "Oral-B Thailand", text: "Excellent attention to detail. Their team suggested improvements we hadn't thought of — the final products looked amazing at our event.", stars: 5 },
];

export const CLIENTS = ["P&G", "Acer", "Oral-B", "Ambipur", "Absolute You", "VSTECS"];
