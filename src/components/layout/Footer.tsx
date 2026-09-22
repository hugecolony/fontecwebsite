'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const WP_BASE_URL = 'https://fontecmobiles.com';

interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

interface WPPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
}

// Helper to sanitize HTML entities returned by WP REST API (e.g. &amp; -> &)
function decodeHtmlEntities(str: string) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export function Footer() {
  const [shopLinks, setShopLinks] = useState<{ href: string; label: string }[]>([]);
  const [companyLinks, setCompanyLinks] = useState<{ href: string; label: string }[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Care / Support navigation links
  const careLinks = [
    { href: '/complaint', label: 'Register a Complaint' },
    { href: '/track-order', label: 'Track Your Order' },
    { href: '/payments', label: 'Modes Of Payments' },
    { href: '/warranty', label: 'Warranty Policy' },
    { href: '/returns', label: 'Exchange and Refund Policy' },
    { href: '/shipping', label: 'Shipping Policy' },
    { href: '/express-delivery', label: 'Express Delivery' },
  ];

  useEffect(() => {
    async function fetchFooterData() {
      try {
        // 1. Fetch Categories
        const catRes = await fetch(
          `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=0&per_page=20`
        );
        if (catRes.ok) {
          const data: WPCategory[] = await catRes.json();
          const filtered = data
            .filter((cat) => cat.slug.toLowerCase() !== 'uncategorized')
            .map((cat) => ({
              href: `/shop?category=${cat.slug}`,
              label: decodeHtmlEntities(cat.name),
            }));
          setShopLinks(filtered);
        }

        // 2. Fetch Pages
        const pagesRes = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/pages?per_page=6`);
        if (pagesRes.ok) {
          const pages: WPPage[] = await pagesRes.json();
          const formattedPages = pages.map((page) => ({
            href: `/${page.slug}`,
            label: decodeHtmlEntities(page.title?.rendered || 'Page'),
          }));
          setCompanyLinks(formattedPages);
        }
      } catch (error) {
        console.error('Failed to load footer data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  const DEFAULT_LOGO = 'https://fontecmobiles.com/wp-content/uploads/2023/11/fontec-logo1.png';

  return (
    <footer className="w-full px-3 sm:px-6 lg:px-8 pt-10 pb-6 bg-[#f4f4f6] text-red-100 font-sans antialiased">
      {/* Main Outer Rounded Box */}
      <div className="max-w-screen mx-auto bg-gradient-to-br from-red-600 via-red-600 to-red-700 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 bg-red-600/60 backdrop-blur-sm flex items-center justify-center z-20 transition-all">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* 1. SHOP SECTION (Columns 1-4) */}
          <div className="lg:col-span-4">
            <h3 className="text-white text-sm sm:text-base font-bold tracking-wider uppercase mb-5 pb-1 border-b border-white/20 inline-block">
              Shop Categories
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm font-medium text-red-100/90">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white hover:translate-x-0.5 inline-block transition-all duration-150"
                >
                  All Products
                </Link>
              </li>
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-0.5 transition-all duration-150 truncate block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. COMPANY SECTION (Columns 5-7) */}
          <div className="lg:col-span-3">
            <h3 className="text-white text-sm sm:text-base font-bold tracking-wider uppercase mb-5 pb-1 border-b border-white/20 inline-block">
              Company
            </h3>
            <ul className="grid grid-cols-1 gap-y-2.5 text-sm font-medium text-red-100/90">
              {companyLinks.length > 0 ? (
                companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white hover:translate-x-0.5 transition-all duration-150 truncate block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/about" className="hover:text-white hover:translate-x-0.5 transition-all duration-150 inline-block">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white hover:translate-x-0.5 transition-all duration-150 inline-block">
                      Contact Us
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* 3. CARE SECTION (Columns 8-9) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-sm sm:text-base font-bold tracking-wider uppercase mb-5 pb-1 border-b border-white/20 inline-block">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-sm font-medium text-red-100/90">
              {careLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-0.5 transition-all duration-150 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. BRAND & NEWSLETTER SECTION (Columns 10-12) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand Logo */}
              <div className="flex items-center justify-between sm:justify-start gap-6 mb-4">
              <Image
                  src={DEFAULT_LOGO}
                  alt="Fontec Logo"
                  width={140}
                  height={45}
                  className="w-[140px] h-auto object-contain brightness-0 invert drop-shadow"
                />
              </div>

              {/* Social SVG Icons */}
              <div className="flex items-center gap-2 text-red-100 my-4">
                <a
                  href="#"
                  className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-red-600 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-red-600 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-red-600 transition-all duration-200"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-red-600 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>

              {/* Direct Support Info */}
              <div className="space-y-2 text-xs sm:text-sm text-red-50 mt-4 font-medium">
                <p className="font-bold text-white text-sm">We're here to help.</p>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 shrink-0 fill-none stroke-currentColor stroke-2 text-white" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <a href="tel:03463994434" className="hover:text-white transition-colors">0346 3994434</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 shrink-0 fill-none stroke-currentColor stroke-2 text-white" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <a href="mailto:services@fontecmobiles.com" className="hover:text-white transition-colors truncate">services@fontecmobiles.com</a>
                </div>
              </div>
            </div>

            {/* Newsletter Input Box */}
            <div className="pt-2">
              <p className="text-xs sm:text-sm font-bold text-white mb-2.5">
                Get exclusive offers & updates
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center w-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-red-800/60 text-white text-sm rounded-full py-3.5 pl-5 pr-14 outline-none border border-red-400/50 focus:border-white focus:bg-red-800/90 transition-all placeholder:text-red-200/80 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 p-2.5 bg-white text-red-600 rounded-full hover:bg-red-50 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  aria-label="Subscribe"
                >
                  <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-3">
        <p>© {new Date().getFullYear()} Fontec Mobiles. All Rights Reserved.</p>
        
        {/* Payment Badges Indicator */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white rounded-md shadow-xs border border-slate-200 text-slate-700 font-semibold">
            Cash on Delivery
          </span>
          <span className="px-3 py-1 bg-white rounded-md shadow-xs border border-slate-200 text-slate-700 font-semibold">
            Debit / Credit Card
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;