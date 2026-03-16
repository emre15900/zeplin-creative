'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type LayoutShellProps = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const hideHeaderFooter =
    normalizedPath === '/ideal-erkek' ||
    normalizedPath.startsWith('/ideal-erkek/') ||
    normalizedPath === '/partner-analiz' ||
    normalizedPath.startsWith('/partner-analiz/');

  if (hideHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <>
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </>
  );
}
