'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const WP_BASE_URL = 'https://fontecmobiles.com';

export interface DynamicCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
}

interface CategoriesSectionProps {
  categories?: any[];
}

// Helper function to normalize category objects from server or WP REST API
function formatCategories(wcCats: any[]): DynamicCategory[] {
  if (!Array.isArray(wcCats)) return [];

  const filteredWcCats = wcCats.filter((wcMatch) => {
    const slug = (wcMatch?.slug || '').toLowerCase();
    const name = (wcMatch?.name || '').toLowerCase();
    return slug !== 'uncategorized' && name !== 'uncategorized';
  });

  return filteredWcCats.map((wcMatch) => {
    let imageUrl: string | null = null;
    const img = wcMatch?.image ?? null;

    if (typeof img === 'string' && img.startsWith('http')) {
      imageUrl = img;
    } else if (img?.src) {
      imageUrl = img.src;
    } else if (img?.thumbnail) {
      imageUrl = img.thumbnail;
    } else if (Array.isArray(wcMatch?.images) && wcMatch.images[0]?.src) {
      imageUrl = wcMatch.images[0].src;
    } else if (wcMatch?.thumbnail) {
      imageUrl = wcMatch.thumbnail;
    } else if (wcMatch?.imageUrl) {
      imageUrl = wcMatch.imageUrl;
    }

    return {
      id: wcMatch.id,
      name: wcMatch.name,
      slug: wcMatch.slug,
      imageUrl,
    };
  });
}

export function CategoriesSection({ categories: initialCategories }: CategoriesSectionProps) {
  const [categories, setCategories] = useState<DynamicCategory[]>(() => {
    return initialCategories && initialCategories.length > 0
      ? formatCategories(initialCategories)
      : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    return !initialCategories || initialCategories.length === 0;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(formatCategories(initialCategories));
      setLoading(false);
      return;
    }

    async function fetchDynamicCategories() {
      try {
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=0&per_page=24`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const wcCats: any[] = await res.json();
        setCategories(formatCategories(wcCats));
      } catch (error) {
        console.error('Error loading WordPress categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDynamicCategories();
  }, [initialCategories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mt-12 px-4 md:px-8" aria-labelledby="category-heading">
      <div className="max-w-screen mx-auto">
        {/* Centered Header Section matching screenshot */}
        <div className="mb-10 text-center relative">
          <h2
            id="category-heading"
            className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider uppercase inline-flex items-center gap-2"
          >
            EXPLORE BY <span className="text-red-500">CATEGORIES</span>
          </h2>

          {/* Navigation Controls positioned on the sides or top-right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
            {/* View All Categories Button */}
            <Link
              href="/categories"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/40 dark:bg-red-800/400 backdrop-blur-xl border border-white/60 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-red-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 pt-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-[180px] sm:w-[220px] shrink-0 text-center snap-start">
                <div className="w-[180px] sm:w-[220px] aspect-square rounded-full bg-slate-100 animate-pulse mx-auto border border-red-200" />
                <div className="h-5 w-3/4 bg-slate-200 rounded mx-auto mt-4 animate-pulse" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none scroll-smooth pb-6 pt-2 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-[180px] sm:w-[220px] shrink-0 text-center snap-start"
              >
                {/* Uppercase Category Label */}
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full"
                >
                  {/* Larger Circular Image Container with red Ring & Soft Shadow */}
                  <div className="w-[180px] sm:w-[220px] aspect-square rounded-full overflow-hidden mx-auto relative bg-transparent border-2 border-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.15)] group-hover:border-red-500 group-hover:shadow-[0_6px_25px_rgba(239,68,68,0.3)] transition-all duration-300 p-5 flex items-center justify-center">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 font-medium text-xs text-center">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Uppercase Category Label */}
                  <div className="mt-4">
                    <h3 className="text-slate-800 text-base sm:text-lg font-black uppercase tracking-wider group-hover:text-red-600 transition-colors truncate px-1">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-slate-500">
            No categories found.
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-6 flex sm:hidden justify-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors group"
          >
            View All Categories
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}