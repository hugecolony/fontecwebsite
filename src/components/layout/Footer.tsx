'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, MapPin, Mail, Phone, Loader2, Layers, ChevronRight } from 'lucide-react';

const WP_BASE_URL = 'https://fontecmobiles.com';

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count?: number;
  image?: {
    src?: string;
    thumbnail?: string;
  } | string | null;
  images?: Array<{ src: string }>;
  thumbnail?: string;
}

interface WPPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
}

function getCategoryImageUrl(cat: WPCategory): string | null {
  if (!cat) return null;

  if (typeof cat.image === 'object' && cat.image !== null) {
    if (cat.image.src) return cat.image.src;
    if (cat.image.thumbnail) return cat.image.thumbnail;
  }

  if (typeof cat.image === 'string' && cat.image.startsWith('http')) {
    return cat.image;
  }

  if (Array.isArray(cat.images) && cat.images[0]?.src) {
    return cat.images[0].src;
  }

  if (cat.thumbnail) return cat.thumbnail;

  return null;
}

export function Footer() {
  const [shopLinks, setShopLinks] = useState<{ href: string; label: string; image?: string | null }[]>([]);
  const [aboutLinks, setAboutLinks] = useState<{ href: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Static support links remain consistent
  const supportLinks = [
    { href: '/faq', label: 'Help Center' },
    { href: '/track-order', label: 'Track Your Order' },
    { href: '/shipping', label: 'Shipping Information' },
    { href: '/returns', label: 'Returns & Refunds' },
    { href: '/contact', label: 'Contact Support' },
  ];

  useEffect(() => {
    async function fetchFooterData() {
      try {
        // 1. Fetch parent categories from WooCommerce Store API (matching main menu NavLinks component)
        const catRes = await fetch(
          `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=0&per_page=20`
        );
        
        if (catRes.ok) {
          const data: WPCategory[] = await catRes.json();
          const filtered = data.filter(
            (cat) => cat.slug.toLowerCase() !== 'uncategorized' && cat.name.toLowerCase() !== 'uncategorized'
          );
          
          const formattedShopLinks = filtered.map((cat) => ({
            href: `/shop?category=${cat.slug}`,
            label: cat.name,
            image: getCategoryImageUrl(cat),
          }));
          
          setShopLinks(formattedShopLinks);
        }

        // 2. Fetch WordPress Pages (for About/Company footer section)
        const pagesRes = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/pages?per_page=5`);
        
        if (pagesRes.ok) {
          const pages: WPPage[] = await pagesRes.json();
          
          const formattedPages = pages.map((page) => ({
            href: `/${page.slug}`,
            label: page.title?.rendered || 'Page',
          }));
          
          setAboutLinks(formattedPages);
        }
      } catch (error) {
        console.error('Failed to load dynamic footer data from WP REST API:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  const DEFAULT_LOGO = 'https://fontecmobiles.com/wp-content/uploads/2023/11/fontec-logo1.png';

  return (
    <footer className="bg-transparent rounded-4xl text-slate-900 border-t border-slate-200 mt-24">
      {/* Newsletter Section */}
      {/* <div className="bg-white py-8 px-4 md:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center justify-between gap-6">
          <div className="max-w-sm">
            <h3 className="text-slate-900 text-lg font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Get early access to new arrivals, special offers, and exclusive deals.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white max-w-sm w-full ml-auto flex p-1 border border-slate-300 rounded-md focus-within:border-red-600 focus-within:bg-transparent transition-all"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="text-slate-900 text-sm w-full bg-transparent px-3 outline-none"
            />
            <button
              type="submit"
              className="py-2.5 px-4 text-sm rounded-md font-semibold text-nowrap cursor-pointer tracking-wide text-white border border-red-600 bg-red-600 hover:bg-red-700 transition-all focus:outline-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div> */}

      {/* Main Footer Links & Brand Section */}
      <div className="bg-transparent  rounded-6xl pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-y-12 gap-x-8">
            
            {/* Brand & Contact Info Column */}
            <div className="max-w-sm lg:col-span-1">
              <Image src={DEFAULT_LOGO} alt="Fontec Logo" width={150} height={48} className="object-contain" />

              <div className="mt-4">
                <p className="text-slate-600 leading-relaxed text-sm">
                  Your one-stop shop for quality mobile accessories at fair prices. Carefully curated collections, secure checkout, and fast delivery you can trust.
                </p>
              </div>

              {/* Direct Contact Details */}
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <span>B17, First Floor Time Center, Saddar Cantt, Peshawar</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={18} className="text-red-600 shrink-0" />
                  <a href="mailto:services@fontecmobiles.com" className="hover:text-slate-900 transition-colors">
                    services@fontecmobiles.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={18} className="text-red-600 shrink-0" />
                  <a href="tel:03463994434" className="hover:text-slate-900 transition-colors">
                    (0346) 3994-434
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation Links Columns */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 sm:gap-x-8 relative">
              {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-red-600 size-6" />
                </div>
              )}

              {/* Dynamic Shop Categories (Matched with Main Menu Categories) */}
              <div>
                <h3 className="text-slate-900 text-sm font-semibold mb-6">Shop Categories</h3>
                <ul className="space-y-4 text-slate-600 text-sm font-normal">
                  <li>
                    <Link href="/shop" className="hover:text-red-600 transition-all font-medium text-slate-900 flex items-center gap-1.5">
                      <span>Shop All</span>
                    </Link>
                  </li>
                  {shopLinks.length > 0 ? (
                    shopLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="hover:text-red-600 transition-all flex items-center gap-2">
                          {link.label}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 text-xs">No categories found</li>
                  )}
                </ul>
              </div>

              {/* Customer Support */}
              <div>
                <h3 className="text-slate-900 text-sm font-semibold mb-6">Customer Support</h3>
                <ul className="space-y-4 text-slate-600 text-sm font-normal">
                  {supportLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-red-600 transition-all">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic WordPress Pages */}
              <div>
                <h3 className="text-slate-900 text-sm font-semibold mb-6">About Us</h3>
                <ul className="space-y-4 text-slate-600 text-sm font-normal">
                  {aboutLinks.length > 0 ? (
                    aboutLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="hover:text-red-600 transition-all">
                          {link.label}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 text-xs">No pages found</li>
                  )}
                </ul>
              </div>
            </div>

          </div>

          <hr className="border-slate-300 mt-16 mb-8" />

          {/* Copyright & Payment Badges */}
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <p className="text-slate-600 text-sm">© {new Date().getFullYear()} Fontec. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 mr-2">💳 Cash on Delivery & Cards Accepted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}