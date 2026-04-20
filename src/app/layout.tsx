import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default:  "SP — Siam Premium Product",
    template: "%s — SP Siam Premium",
  },
  description: "Total Premiums & Promotion Solution. Premium corporate gifts, souvenirs, and branded merchandise.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
