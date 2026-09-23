'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const WP_BASE_URL = 'https://fontecmobiles.com';

export interface DynamicCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  count?: number;
}

interface CategoriesSectionProps {
  categories?: any[];
}

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
      count: wcMatch?.count ?? 0,
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
          `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=0&per_page=12`
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

  // Robust Smooth Auto-Scroll Ticker Logic with IntersectionObserver check
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || categories.length === 0) return;

    let animationFrameId: number;
    let isPaused = false;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const scrollStep = () => {
      if (!isPaused && isVisible && container) {
        container.scrollLeft += 0.8;

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scrollStep);
    }, 1000);

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [categories]);

  // Duplicate categories array once to create a seamless infinite scrolling illusion
  const duplicatedCategories = [...categories, ...categories];

  return (
    <section className="mt-16 px-4 md:px-8 overflow-hidden" aria-labelledby="category-heading">
      <div className="max-w-screen-h  mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-0.5 bg-red-600 block rounded-full"></span>
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              Browse by Category
            </span>
          </div>
          <h2
            id="category-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Explore Now
          </h2>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-hidden pb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-[300px] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] h-56 rounded-3xl bg-slate-100 animate-pulse border border-slate-200/60 shrink-0"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-hidden pb-6 pt-2 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedCategories.map((cat, index) => (
              <div
                key={`${cat.id}-${index}`}
                className="w-[300px] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] snap-start shrink-0"
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group relative flex items-center justify-between p-7 bg-gradient-to-br from-white via-white to-slate-50/80 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.08)] hover:border-red-500/30 transition-all duration-500 h-56 block transform hover:-translate-y-1.5"
                >
                  {/* Product Count Badge Top Right */}
                  {cat.count !== undefined && cat.count > 0 && (
                    <span className="absolute top-4 right-5 px-2.5 py-1 text-[11px] bg-slate-100/80 backdrop-blur-md text-slate-600 font-semibold rounded-full border border-slate-200/60">
                      {cat.count} Items
                    </span>
                  )}

                  {/* Left Side: Modern Larger Image Showcase */}
                  <div className="relative w-32 h-32 shrink-0 flex items-center justify-center p-2">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="128px"
                        className="object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-md"
                        unoptimized
                      />
                    ) : (
                      <div className="text-xs text-slate-400 font-medium">No Image</div>
                    )}
                  </div>

                  {/* Right Side: Title & Action Arrow */}
                  <div className="flex flex-col justify-between h-full pl-3 flex-1">
                    <div className="mt-8">
                      <span className="text-[11px] uppercase tracking-wider text-red-600 font-bold block mb-1">
                        Explore
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        {cat.name}
                      </h3>
                    </div>

                    <div className="flex justify-end">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-red-600 group-hover:text-white text-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:rotate-[-10deg]">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {/* Special "View All Categories" Modern Dark Card */}
            <div className="w-[300px] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] snap-start shrink-0">
              <Link
                href="/categories"
                className="group relative flex flex-col justify-between p-7 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl border border-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 h-56 text-white block transform hover:-translate-y-1.5"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.2),transparent_50%)] rounded-3xl pointer-events-none"></div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-red-400 font-bold block mb-1">
                    Directory
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                    View All <br /> Categories
                  </h3>
                </div>

                <div className="flex justify-end relative z-10">
                  <div className="w-11 h-11 rounded-2xl bg-white text-slate-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-slate-500">
            No categories found.
          </div>
        )}
      </div>
    </section>
  );
}