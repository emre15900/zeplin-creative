import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İdeal Erkek | Profilini Oluştur',
  description: 'Karakteristik özelliklerin bass seviyesini 0-10 arası ayarla, ideal erkek profilini oluştur. AI ile öneriler al, grafiği indir.',
  openGraph: {
    title: 'İdeal Erkek | Profilini Oluştur',
    description: 'İdeal erkek profilini oluştur, özelliklerin bass seviyesini ayarla.',
  },
};

export default function IdealErkekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
