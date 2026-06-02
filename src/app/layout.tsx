import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body style={{ margin: 0, padding: 0, width: '100%' }}>
        {children}
      </body>
    </html>
  );
}