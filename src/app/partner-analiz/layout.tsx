import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner Analizi | Şu Anki Partnerini Analiz Et',
  description: 'Partnerinin özelliklerini bass seviyesiyle değerlendir. AI ile analiz al, ilişki tavsiyeleri ve destek önerileri kazan.',
  openGraph: {
    title: 'Partner Analizi | Şu Anki Partnerini Analiz Et',
    description: 'Partnerini AI ile analiz et, ilişki tavsiyeleri al.',
  },
};

export default function PartnerAnalizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
