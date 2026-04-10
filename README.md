# SP — Siam Premium Product (Next.js)

Full-featured e-commerce website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **NextAuth**, and **Zustand**.

---

## 🚀 Quick Start (3 steps)

### Step 1 — Install dependencies
Open a terminal in VS Code, `cd` into the project folder, then run:
```bash
npm install
```

### Step 2 — Set up environment variables
Edit `.env.local` (already in the project):
```env
NEXTAUTH_SECRET=any-long-random-string-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id      # optional
GOOGLE_CLIENT_SECRET=your-google-client-secret  # optional
```
> **Google OAuth is optional.** The site works without it — just leave the Google values empty and the Google button won't work, but email/password login will.

### Step 3 — Run the dev server
```bash
npm run dev
```
Open **http://localhost:3000** — it redirects to `/home` automatically.

---

## 🔑 Demo Login

| Field    | Value         |
|----------|---------------|
| Email    | demo@sp.com   |
| Password | password      |

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── (auth)/          Login, Register, Forgot Password, Reset Password
│   ├── (public)/        Home, About, Services, Catalog, Our Work, Contact
│   ├── (dashboard)/     Profile, Wishlist, Cart, Checkout, Orders
│   └── api/             NextAuth, Register, Newsletter
├── components/
│   └── public/          Navbar (with cart/wishlist count), Footer (with social links)
└── lib/
    ├── data.ts           ⭐ All products, services, content — edit here
    └── store.ts          Zustand cart + wishlist (persisted in localStorage)
```

---

## ✏️ How to Edit Content

### Change products
Open `src/lib/data.ts` → find `PRODUCTS` array → add/edit/remove objects.
Each product has: `id`, `name`, `nameTH`, `category`, `price`, `image`, `rating`, etc.

### Change categories
In `src/lib/data.ts` → edit `CATEGORIES` array. New category = new filter button in catalog automatically.

### Change colors
In `src/app/globals.css` → edit the `:root` block:
```css
:root {
  --primary:      #316FC5;   /* Blue buttons/highlights */
  --accent:       #FFF4DD;   /* Cream backgrounds */
  --primary-dark: #1e4f9a;   /* Hover state */
}
```
Also in `tailwind.config.ts` → `colors.primary` and `colors.accent`.

### Change company info / social links
In `src/lib/data.ts` → edit `BRAND` object at the top.

### Change nav links
In `src/lib/data.ts` → edit `NAV_LINKS` array.

---

## 🌐 Pages & URLs

| URL | Page |
|-----|------|
| `/home` | Homepage |
| `/about` | About Us |
| `/services` | Our Services |
| `/catalog` | Product Catalog (search + filter) |
| `/catalog/[id]` | Product Detail |
| `/work` | Our Work / Portfolio |
| `/contact` | Contact Us |
| `/login` | Sign In |
| `/register` | Create Account |
| `/forgot-password` | Forgot Password |
| `/profile` | My Profile (auth required) |
| `/orders` | My Orders (auth required) |
| `/orders/[id]` | Order Detail + Tracking |
| `/wishlist` | Wishlist (auth required) |
| `/cart` | Shopping Cart (auth required) |
| `/checkout` | Checkout (auth required) |

---

## 🔐 Google OAuth Setup (optional)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Credentials** → **OAuth 2.0 Client ID**
3. Set **Authorised redirect URI** to: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret into `.env.local`

---

## 🗄️ Connecting a Real Database (future)

All mock data lives in `src/lib/data.ts`. To connect a real database:
1. Add Prisma or Drizzle: `npm install prisma`
2. Replace `MOCK_USERS` lookups in `src/app/api/auth/[...nextauth]/route.ts`
3. Replace `MOCK_ORDERS` in order pages with DB queries
4. Replace `src/app/api/register/route.ts` with a real DB insert + bcrypt hash

---

## 📦 Deploy

This is a standard Next.js app — deploy anywhere:
- **Vercel**: Push to GitHub → connect on vercel.com (one click)
- **Cloudflare Pages**: `npm run build` → deploy `.next` folder
- **Railway / Render**: Works out of the box with `npm run build && npm start`
