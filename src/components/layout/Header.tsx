'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, Suspense } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { NavLinks } from './NavLinks';
import { SearchBar } from './SearchBar';

const DEFAULT_LOGO = 'https://www.fontecmobiles.com/wp-content/uploads/2023/11/fontec-logo1.png';

export function Header() {
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore(
    (state) => state.items?.reduce((total, item) => total + (item.quantity ?? 0), 0) || 0
  );

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Hide on scroll down, show on scroll up states
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Track if background styling should change
      setScrolled(currentScrollY > 20);

      // Hide navbar when scrolling down past 80px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile/tablet menu on route changes
  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-12 sm:top-14 lg:top-16 inset-x-3 sm:inset-x-6 lg:inset-x-4 w-[85%] max-w-[320px] sm:max-w-md lg:max-w-[1680px] mx-auto z-40 transition-all duration-300 ease-in-out rounded-3xl sm:rounded-4xl',
          
          'backdrop-blur-xl border border-white/5 dark:border-white/5',
          'shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]',
          scrolled
            ? 'bg-white/5 dark:bg-slate-100/5 py-0.5 sm:py-1'
            : 'bg-white/5 dark:bg-slate-100/5 py-0',
          showNavbar ? 'translate-y-0' : '-translate-y-28 opacity-0 pointer-events-none'
        )}
      >
        <div className="px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-12 lg:h-14">
            
            {/* 1. Left Section: Menu Toggle / Desktop Logo */}
            <div className="flex items-center lg:w-1/3">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="lg:hidden p-2 rounded-xl text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link
                href="/"
                className="hidden lg:flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity"
              >
                <div className="relative w-auto h-auto flex items-center justify-center">
                  <Image
                    src={DEFAULT_LOGO}
                    alt="Fontec Logo"
                    width={90}
                    height={90}
                    priority
                    className="w-[90px] h-auto object-contain drop-shadow"
                  />
                </div>
              </Link>
            </div>

            {/* 2. Center Section: Mobile/Tablet Logo / Desktop Nav Links */}
            <div className="flex items-center justify-center lg:w-1/3">
              <Link
                href="/"
                className="lg:hidden flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Image
                  src={DEFAULT_LOGO}
                  alt="Fontec Logo"
                  width={70}
                  height={70}
                  priority
                  className="w-[70px] h-auto object-contain drop-shadow"
                />
              </Link>

              <nav className="hidden lg:flex items-center justify-center gap-1">
                <Suspense fallback={null}>
                  <NavLinks />
                </Suspense>
              </nav>
            </div>

            {/* 3. Right Actions */}
            <div className="flex items-center justify-end gap-1 lg:w-1/3">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 sm:p-2.5 rounded-xl text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <button
                type="button"
                onClick={openCart}
                className="relative p-2 sm:p-2.5 rounded-xl text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Open cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

          </div>

          {searchOpen && (
            <div className="pb-4 animate-fade-in border-t border-black/5 dark:border-white/10 pt-3">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        {/* Mobile & Tablet nav dropdown */}
        {menuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 rounded-b-3xl animate-fade-in">
            <nav className="flex flex-col px-4 py-4 gap-1">
              <Suspense fallback={null}>
                <NavLinks mobile onClose={() => setMenuOpen(false)} />
              </Suspense>
            </nav>
          </div>
        )}
      </header>

      <div className="h-20 sm:h-24 lg:h-28" />
    </>
  );
}