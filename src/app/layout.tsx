import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "İdeal Erkek | Partner Analizi",
  description: "İdeal erkek profilini oluştur, özelliklerin bass seviyesini ayarla. Partnerini analiz et, AI ile ilişki tavsiyeleri al.",
  keywords: ["ideal erkek", "partner analizi", "ilişki", "bass seviyesi", "AI analiz", "ilişki tavsiyesi", "erkek profili"],
  authors: [{ name: "İdeal Erkek" }],
  openGraph: {
    title: "İdeal Erkek | Partner Analizi",
    description: "İdeal erkek profilini oluştur, partnerini AI ile analiz et.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased font-inter" suppressHydrationWarning>
        <ScrollToTop />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
