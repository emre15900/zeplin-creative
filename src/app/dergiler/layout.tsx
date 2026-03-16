import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dergiler',
  description: 'İdeal Erkek ve Partner Analizi uygulaması.',
};

export default function DergilerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
