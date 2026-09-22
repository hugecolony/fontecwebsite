'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ShoppingBag, Search, Menu, X, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { NavLinks } from './NavLinks';
import { SearchBar } from './SearchBar';
import { CartCount } from '@/components/cart/CartCount';

const WP_BASE_URL = 'https://fontecmobiles.com';
const DEFAULT_LOGO = 'https://www.fontecmobiles.com/wp-content/uploads/2023/11/fontec-logo1.png';

export function Header() {
  const openCart = useCartStore((state) => state.openCart);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO);
  const [logoLoading, setLogoLoading] = useState(true);

  // Fetch logo dynamically from WordPress REST API
  useEffect(() => {
    async function fetchWPLogo() {
      try {
        const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/media?slug=fontec-logo1`);
        if (res.ok) {
          const data = await res.json();
          if (data && data[0]?.source_url) {
            setLogoUrl(data[0].source_url);
          }
        }
      } catch (error) {
        console.error('Failed to fetch WordPress logo:', error);
      } finally {
        setLogoLoading(false);
      }
    }

    fetchWPLogo();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-16 inset-x-4 max-w-7xl mx-auto z-50 transition-all duration-500 rounded-4xl',
          'backdrop-blur-xl border border-white/5 dark:border-white/5',
          'shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]',
          scrolled
            ? 'bg-white/5 dark:bg-slate-100/5 py-1'
            : 'bg-white/5 dark:bg-slate-100/5 py-0'
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Dynamic Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              <div className="relative w-auto h-auto flex items-center justify-center">
                {logoUrl ? (
                  <Image
                    src={DEFAULT_LOGO}
                    alt="Fontec Logo"
                    width={140}
                    height={45}
                    className="w-[140px] h-auto object-contain  drop-shadow"
                  />
                ) : (
                  <Zap size={20} className="text-accent" />
                )}
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLinks />
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2.5 rounded-xl text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2.5 rounded-xl text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag size={20} />
                <CartCount />
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="lg:hidden p-2.5 rounded-xl text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in border-t border-black/5 dark:border-white/10 pt-3">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 rounded-b-3xl animate-fade-in">
            <nav className="flex flex-col px-4 py-4 gap-1">
              <NavLinks mobile onClose={() => setMenuOpen(false)} />
            </nav>
          </div>
        )}
      </header>

      {/* Header spacer to prevent page content overlap */}
      <div className="h-24 lg:h-28" />
    </>
  );
}