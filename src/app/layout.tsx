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
  title: "Profuture | Teknoloji Dergisi",
  description: "Türkiye'nin önde gelen hakemli akademik teknoloji dergisi. Dijital dönüşüm, yapay zeka, büyük veri ve siber güvenlik alanlarında özgün araştırmalar.",
  keywords: ["teknoloji dergisi", "akademik dergi", "dijital dönüşüm", "yapay zeka", "büyük veri", "siber güvenlik", "Türkiye", "Profuture"],
  authors: [{ name: "Profuture" }],
  openGraph: {
    title: "Profuture Teknoloji Dergisi",
    description: "Türkiye'nin önde gelen hakemli akademik teknoloji dergisi",
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
