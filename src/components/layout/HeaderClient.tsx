'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://fontecmobiles.com';
interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface NavItem {
  href: string;
  label: string;
}

interface NavLinksProps {
  mobile?: boolean;
  onClose?: () => void;
}

const staticLinks: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
];

export function NavLinks({ mobile, onClose }: NavLinksProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [navItems, setNavItems] = useState<NavItem[]>(staticLinks);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Fetch WooCommerce product categories via WP REST API taxonomy endpoint
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/product_cat?per_page=10&hide_empty=true`
        );

        if (res.ok) {
          const categories: WPCategory[] = await res.json();
          const categoryLinks: NavItem[] = categories.map((cat) => ({
            href: `/shop?category=${cat.slug}`,
            label: cat.name,
          }));

          setNavItems([...staticLinks, ...categoryLinks]);
        }
      } catch (error) {
        console.error('Failed to fetch categories from WP:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Full URL representation for matching query parameters
  const activeCategory = searchParams.get('category');

  if (loading) {
    return (
      <div className={cn('flex gap-2', mobile ? 'flex-col w-full' : 'items-center')}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={cn(
              'skeleton',
              mobile ? 'h-10 w-full' : 'h-8 w-16'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {navItems.map((link) => {
        // Active calculation taking care of query params
        let isActive = false;

        if (link.href === '/') {
          isActive = pathname === '/';
        } else if (link.href === '/shop') {
          isActive = pathname === '/shop' && !activeCategory;
        } else {
          isActive = link.href === `${pathname}?category=${activeCategory}`;
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              mobile ? 'text-base w-full block' : '',
              isActive
                ? 'bg-accent/10 text-accent font-semibold'
                : 'text-muted hover:text-foreground hover:bg-white/5'
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}