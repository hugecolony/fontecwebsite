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
        // Queries media by slug 'fontec-logo1' via WP REST API
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
          'fixed top-10 inset-x-0 z-50 transition-all duration-300',
          scrolled ? 'glass-light ' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Dynamic Logo */}
           <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              {/* Adjust w-32 (width) and h-9 (height) as needed */}
              <div className="relative w-32 h-9 flex items-center justify-center">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="GearCell Logo"
                    fill
                    sizes="128px"
                    className="object-contain object-left"
                    priority
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
                className="p-2.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag size={20} />
                <CartCount />
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="lg:hidden p-2.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="lg:hidden glass-dark border-t border-white/5 animate-fade-in">
            <nav className="flex flex-col px-4 py-4 gap-1">
              <NavLinks mobile onClose={() => setMenuOpen(false)} />
            </nav>
          </div>
        )}
      </header>

      {/* Header spacer */}
      <div className="h-16 lg:h-18" />
    </>
  );
}