'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import Image from 'next/image';

const navItems = [
  { name: 'Amaç ve Kapsam', href: '#amac-kapsam' },
  { name: 'Etik İlkeler ve Yayın Politikası', href: '#etik-ilkeler' },
  { name: 'Makale Çağrıları', href: '#makale-cagrilari' },
  { name: 'Sayılar', href: '#sayilar' },
  { name: 'İletişim', href: '#iletisim' },
  { name: 'İdeal Erkek', href: '/ideal-erkek' },
];

// Home icon component with green color
const HomeIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={Math.round(size * 0.875)}
    viewBox="0 0 24 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 10L12 2L21 10"
      stroke="#A8B95E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 8.5V18C5 18.5523 5.44772 19 6 19H9V14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14V19H18C18.5523 19 19 18.5523 19 18V8.5"
      stroke="#A8B95E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Email/Message icon component
const MessageIcon = () => (
  <svg
    width="22"
    height="18"
    viewBox="0 0 22 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 1H3C1.89543 1 1 1.89543 1 3V15C1 16.1046 1.89543 17 3 17H19C20.1046 17 21 16.1046 21 15V3C21 1.89543 20.1046 1 19 1Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 4L12.5 10C11.6 10.6 10.4 10.6 9.5 10L1 4"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Smooth scroll function
const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (href.startsWith('#')) {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerHeight = 135; // Header height for desktop
      const mobileHeaderHeight = 80; // Header height for mobile
      const isMobile = window.innerWidth < 1024;
      const offset = isMobile ? mobileHeaderHeight : headerHeight;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleSmoothScroll(e, href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="w-full relative bg-white sticky top-0 z-50 hidden lg:block" style={{ height: '135px', boxShadow: '0 5px 15px rgba(136,136,136,0.25)' }}>
        {/* Left Blue Rectangle - Logo Area */}
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width: '381px',
            backgroundColor: '#273D89',
            zIndex: 10,
            borderRadius: '0 90px 0 0'
          }}
        />

        {/* Top Dark Blue Bar with curved cutout */}
        <div
          className="absolute top-0 right-0 h-[44px] overflow-hidden"
          style={{ left: '328px', zIndex: 5 }}
        >
          <div className="relative w-full h-full">
            {/* Main dark blue background */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: '#081542', }}
            />
            {/* Circular cutout effect */}
            <div
              className="absolute"
              style={{
                width: '183px',
                height: '186px',
                borderRadius: '54%',
                backgroundColor: 'white',
                left: '-110px',
                top: '-8px'
              }}
            />
          </div>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="absolute flex items-center"
          style={{
            left: '32px',
            top: '22px',
            zIndex: 20
          }}
        >
          <Image
            src="/img/logo-white.svg"
            alt="Profuture Logo"
            width={250}
            height={64}
            className="h-auto w-auto max-h-[90px]"
            style={{ maxWidth: '250px' }}
            priority
          />
        </Link>

        {/* Top Bar Content - Email */}
        <div
          className="absolute hidden xl:flex items-center gap-[14px]"
          style={{
            left: '396px',
            top: '12px',
            zIndex: 20
          }}
        >
          <MessageIcon />
          <span className="text-[16px]" style={{ color: '#676A73' }}>
            <a
              href="mailto:profuture@gmail.com"
              className="font-bold leading-[20px] sm:leading-[22px] hover:underline"
            >
              profuture@gmail.com
            </a>
          </span>
        </div>

        {/* Top Bar Content - Right side info */}
        <div
          className="absolute flex items-center gap-5"
          style={{
            top: '11px',
            right: '50px',
            zIndex: 20
          }}
        >
          <span className="text-white text-[16px]">ISSN: <strong>345-255</strong></span>
          <span className="text-white text-[16px]">Başlangıç <strong>2025</strong></span>
          <span className="text-white text-[16px]">Periyot: <strong>Yılda 2 Sayı</strong></span>
        </div>

        {/* Main Navigation Area - Desktop */}
        <div
          className="absolute flex items-center justify-between"
          style={{
            left: '410px',
            top: '60px',
            right: '50px',
            height: '55px',
            zIndex: 20
          }}
        >
          {/* Left side - Home icon and Menu Items */}
          <div className="flex items-center justify-between w-full">
            {/* Home Icon */}
            <a
              href="#hero"
              onClick={(e) => handleSmoothScroll(e, '#hero')}
              className="flex items-center justify-center mr-6 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <HomeIcon size={24} />
            </a>

            {/* Menu Items */}
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="text-[13px] font-normal transition-colors hover:text-[#273D89] whitespace-nowrap px-[10px] first:pl-0 cursor-pointer"
                  style={{ color: '#2A2C31' }}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-[5px]" style={{ marginLeft: '20px' }}>
            {/* Dergi Kurulu Button */}
            <Link
              href="/"
              className="flex items-center gap-[10px] text-white rounded-[50px] font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: '#273D89',
                padding: '0 15px',
                fontSize: '14px',
                height: '48px',
                width: '150px'
              }}
            >
              <Icon name="kurul" size={18} className="invert" />
              <span className='whitespace-nowrap'>Dergi Kurulu</span>
            </Link>

            {/* Yazar Rehberi Button */}
            <Link
              href="/"
              className="flex items-center gap-[10px] text-white rounded-[50px] font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: '#A8B95E',
                padding: '0 15px',
                fontSize: '14px',
                height: '48px',
                width: '150px'
              }}
            >
              <Icon name="author" size={18} className="invert" />
              <span className='whitespace-nowrap'>Yazar Rehberi</span>
            </Link>

            {/* Search Button */}
            <button
              className="flex items-center cursor-pointer justify-center rounded-full transition-all hover:border-[#273D89]"
              style={{
                padding: '15px',
                border: '1px solid #ACB1C6',
                backgroundColor: 'transparent'
              }}
            >
              <Icon name="search" size={17} className='min-w-4 min-h-4' />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="w-full sticky top-0 z-50 lg:hidden bg-[#273D89]" style={{ height: '80px', boxShadow: '0 5px 15px rgba(136,136,136,0.25)' }}>
        {/* Logo */}
        <Link
          href="/"
          className="absolute flex items-center left-4 top-1/2 -translate-y-1/2"
          style={{ zIndex: 20 }}
        >
          <Image
            src="/img/logo-white.svg"
            alt="Profuture Logo"
            width={140}
            height={40}
            className="h-auto w-auto"
            style={{ maxWidth: '140px', maxHeight: '50px' }}
            priority
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
          style={{ zIndex: 30 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Icon name="menu" size={24} className="invert" />
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[80px] bg-white animate-fade-in overflow-y-auto" style={{ zIndex: 50 }}>
            <div className="container py-6 flex flex-col gap-2">
              <a
                href="#hero"
                className="text-[#2A2C31] hover:text-[#273D89] py-3 font-medium text-base border-b border-gray-100 flex items-center gap-3 cursor-pointer"
                onClick={(e) => handleMobileClick(e, '#hero')}
              >
                <HomeIcon size={20} />
                Anasayfa
              </a>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[#2A2C31] hover:text-[#273D89] py-3 font-medium text-base border-b border-gray-100 cursor-pointer"
                  onClick={(e) => handleMobileClick(e, item.href)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-6">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-3 bg-[#273D89] text-white px-6 py-4 rounded-full text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="kurul" size={20} className="invert" />
                  Dergi Kurulu
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-3 bg-[#A8B95E] text-white px-6 py-4 rounded-full text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="author" size={20} className="invert" />
                  Yazar Rehberi
                </Link>
              </div>

              {/* Mobile Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg width="18" height="14" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 1H3C1.89543 1 1 1.89543 1 3V15C1 16.1046 1.89543 17 3 17H19C20.1046 17 21 16.1046 21 15V3C21 1.89543 20.1046 1 19 1Z" stroke="#273D89" strokeWidth="1.5" />
                    <path d="M21 4L12.5 10C11.6 10.6 10.4 10.6 9.5 10L1 4" stroke="#273D89" strokeWidth="1.5" />
                  </svg>
                  <span className="text-[14px] text-[#676A73]">profuture@gmail.com</span>
                </div>
                <div className="flex flex-wrap gap-4 text-[13px] text-[#676A73]">
                  <span>ISSN: <strong>345-255</strong></span>
                  <span>Başlangıç: <strong>2025</strong></span>
                  <span>Periyot: <strong>Yılda 2 Sayı</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
