'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Loader2, Sparkles, Layers, X, Search, ShoppingBag, Store } from 'lucide-react';

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

interface NavLinksProps {
  mobile?: boolean;
  onClose?: () => void;
  onOpenSearch?: () => void;
  cartItemCount?: number;
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

export function NavLinks({ mobile, onClose, onOpenSearch, cartItemCount = 0 }: NavLinksProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=0&per_page=20`
        );
        if (res.ok) {
          const data: WPCategory[] = await res.json();
          const filtered = data.filter(
            (cat) => cat.slug.toLowerCase() !== 'uncategorized' && cat.name.toLowerCase() !== 'uncategorized'
          );
          setCategories(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCats(false);
      }
    }
    fetchCategories();
  }, []);

  if (loadingCats) {
    return (
      <div className={cn('flex gap-2', mobile ? 'fixed inset-0 z-50 w-screen h-screen bg-white p-5 flex-col overflow-y-auto' : 'items-center')}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={cn('rounded-xl bg-slate-100 animate-pulse', mobile ? 'h-12 w-full' : 'h-10 w-10 rounded-full')} />
        ))}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Full-Screen Mobile Sidebar View
  // ─────────────────────────────────────────────────────────────────────────
  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen min-h-screen bg-white flex flex-col p-4 sm:p-6 overflow-y-auto animate-in fade-in-0 duration-200">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Menu & Categories</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* Shop All Dropdown / Accordion Item for Mobile */}
        <div className="flex flex-col gap-2.5 pb-3 border-b border-slate-100 mb-3">
          <ShopAllDropdownItem
            categories={categories}
            mobile={mobile}
            onClose={onClose}
            isActive={pathname === '/shop' && !activeCategory}
          />

          {/* Dynamic WP Categories */}
          {categories.map((cat) => (
            <CategoryDropdownItem
              key={cat.id}
              category={cat}
              mobile={mobile}
              onClose={onClose}
              isActive={activeCategory === cat.slug}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Desktop Navigation View (Shop All Dropdown + Categories)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-1.5">
      {/* Shop All Dropdown Button */}
      <ShopAllDropdownItem
        categories={categories}
        mobile={mobile}
        onClose={onClose}
        isActive={pathname === '/shop' && !activeCategory}
      />

      <div className="w-[1px] h-5 bg-slate-200 mx-1" />

      {categories.map((cat) => (
        <CategoryDropdownItem
          key={cat.id}
          category={cat}
          mobile={mobile}
          onClose={onClose}
          isActive={activeCategory === cat.slug}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shop All Dropdown Item Component (Main Menu Dropdown with All Categories)
───────────────────────────────────────────────────────────────────────────── */
function ShopAllDropdownItem({
  categories,
  mobile,
  onClose,
  isActive,
}: {
  categories: WPCategory[];
  mobile?: boolean;
  onClose?: () => void;
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (mobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (mobile) return;
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  if (mobile) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-[#f2f2f3] hover:bg-[#e8e8e9] transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-8 h-8 shrink-0 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center text-slate-700">
              <Store size={16} />
            </div>
            <Link
              href="/shop"
              onClick={onClose}
              className={cn(
                'text-slate-800 font-bold text-sm sm:text-base flex-1 text-left line-clamp-1',
                isActive && 'text-red-600'
              )}
            >
              Shop All
            </Link>
          </div>

          {categories.length > 0 && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-1 -mr-1 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
              aria-label="Toggle Shop All categories"
            >
              <ChevronRight
                size={18}
                className={cn(
                  'text-slate-600 transition-transform duration-200 stroke-[2.5]',
                  isOpen && 'rotate-90 text-red-600'
                )}
              />
            </button>
          )}
        </div>

        {isOpen && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-2 p-2 mt-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <Link
              href="/shop"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm transition-all text-left"
            >
              <span className="text-xs font-bold text-red-600">Browse Complete Catalog &rarr;</span>
            </Link>
            {categories.map((cat) => {
              const imageUrl = getCategoryImageUrl(cat);
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-9 h-9 shrink-0 rounded-md overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={cat.name} fill className="object-contain p-1" />
                      ) : (
                        <Layers size={16} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">{cat.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/shop"
        onClick={onClose}
        className={cn(
          'px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
          isActive || isOpen
            ? 'bg-red-500 text-white shadow-sm'
            : 'text-slate-600 hover:text-red-600 hover:bg-red-100/80'
        )}
      >
        <Store size={15} />
        <span>Shop All</span>
      </Link>

      {isOpen && (
        <div className="fixed left-1/2 -translate-x-1/2 top-20 w-[92vw] max-w-4xl z-50 pt-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="relative rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(220,38,38,0.12)] p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-red-50/80 border border-red-100/60 text-red-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={13} className="text-red-500" />
                  All Store Categories
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Explore our complete collection of products
                </span>
              </div>
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-900 hover:text-red-600 transition-colors underline-offset-4 hover:underline"
              >
                View All Products &rarr;
              </Link>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const imageUrl = getCategoryImageUrl(cat);

                  return (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="group/sub flex items-center justify-between p-3 rounded-2xl border border-slate-200/60 bg-white/60 hover:bg-white hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={cat.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1.5 group-hover/sub:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <Layers size={18} className="text-slate-400" />
                          )}
                        </div>

                        <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover/sub:text-red-600 transition-colors line-clamp-1">
                          {cat.name}
                        </span>
                      </div>

                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 group-hover/sub:text-red-600 group-hover/sub:bg-red-50 transition-all shrink-0 ml-2">
                        <ChevronRight size={15} className="transition-transform group-hover/sub:translate-x-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-slate-500">
                No categories available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Category Dropdown Item Component (Icon Trigger with Expanding Side Text & Glassmorphism)
───────────────────────────────────────────────────────────────────────────── */
function CategoryDropdownItem({
  category,
  mobile,
  onClose,
  isActive,
}: {
  category: WPCategory;
  mobile?: boolean;
  onClose?: () => void;
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<WPCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSubcategories = async () => {
   if (fetched) return;
    setLoading(true);
    try {
      // Debug what ID is being queried
      console.log(`Fetching subcategories for category ID: ${category.id} (${category.name})`);

      const res = await fetch(
        `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=${category.id}&per_page=20`
      );

      if (res.ok) {
        const data: WPCategory[] = await res.json();
        console.log(`Received subcategories for ${category.name}:`, data);
        
        const filteredSubs = data.filter(
          (sub) => sub.slug.toLowerCase() !== 'uncategorized' && sub.name.toLowerCase() !== 'uncategorized'
        );
        setSubcategories(filteredSubs);
      }
    } catch (error) {
      console.error(`Failed to fetch subcategories for ${category.name}:`, error);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  useEffect(() => {
    if (mobile) {
      fetchSubcategories();
    }
  }, [mobile]);

  const handleMouseEnter = () => {
    if (mobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
    fetchSubcategories();
  };

  const handleMouseLeave = () => {
    if (mobile) return;
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const categoryHref = `/shop?category=${category.slug}`;
  const categoryImageUrl = getCategoryImageUrl(category);

  if (mobile) {
    const hasSubcats = subcategories.length > 0;

    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-[#f2f2f3] hover:bg-[#e8e8e9] transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-8 h-8 shrink-0 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
              {categoryImageUrl ? (
                <Image src={categoryImageUrl} alt={category.name} fill className="object-contain p-1" />
              ) : (
                <Layers size={15} className="text-slate-500" />
              )}
            </div>
            <Link
              href={categoryHref}
              onClick={onClose}
              className={cn(
                'text-slate-800 font-bold text-sm sm:text-base flex-1 text-left line-clamp-1',
                isActive && 'text-red-600'
              )}
            >
              {category.name}
            </Link>
          </div>

          {hasSubcats && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-1 -mr-1 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
              aria-label={`Toggle ${category.name} subcategories`}
            >
              <ChevronRight
                size={18}
                className={cn(
                  'text-slate-600 transition-transform duration-200 stroke-[2.5]',
                  isOpen && 'rotate-90 text-red-600'
                )}
              />
            </button>
          )}
        </div>

        {isOpen && hasSubcats && (
          <div className="grid grid-cols-1 gap-2 p-2 mt-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
            {subcategories.map((sub) => {
              const imageUrl = getCategoryImageUrl(sub);
              return (
                <Link
                  key={sub.id}
                  href={`/shop?category=${sub.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-9 h-9 shrink-0 rounded-md overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={sub.name} fill className="object-contain p-1" />
                      ) : (
                        <Layers size={16} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">{sub.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={categoryHref}
        onClick={onClose}
        className={cn(
          'relative group p-2 rounded-full transition-all duration-300 flex items-center gap-0 hover:gap-2.5 cursor-pointer max-w-[40px] hover:max-w-[200px] overflow-hidden whitespace-nowrap',
          isActive || isOpen
            ? 'bg-slate-100 text-slate-900 border border-slate-200 shadow-sm max-w-[200px] px-3'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:px-3'
        )}
      >
        <div className="relative w-7 h-7 shrink-0 flex items-center justify-center overflow-hidden">
          {categoryImageUrl ? (
            <Image
              src={categoryImageUrl}
              alt={category.name}
              fill
              sizes="20px"
              className="object-contain"
            />
          ) : (
            <Layers size={16} />
          )}
        </div>

        {/* Expanding Text Label on Hover */}
        <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate">
          {category.name}
        </span>
      </Link>

      {isOpen && (
        <div className="fixed left-1/2 -translate-x-1/2 top-20 w-[92vw] max-w-4xl z-50 pt-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="relative rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(220,38,38,0.12)] p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-red-50/80 border border-red-100/60 text-red-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={13} className="text-red-500" />
                  {category.name}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Select a subcategory to explore items
                </span>
              </div>
              <Link
                href={categoryHref}
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-900 hover:text-red-600 transition-colors underline-offset-4 hover:underline"
              >
                Browse All {category.name} &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-slate-500">
                <Loader2 size={20} className="animate-spin text-red-600" />
                <span className="text-xs font-medium">Loading subcategories...</span>
              </div>
            ) : subcategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {subcategories.map((sub) => {
                  const imageUrl = getCategoryImageUrl(sub);

                  return (
                    <Link
                      key={sub.id}
                      href={`/shop?category=${sub.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="group/sub flex items-center justify-between p-3 rounded-2xl border border-slate-200/60 bg-white/60 hover:bg-white hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={sub.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1.5 group-hover/sub:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <Layers size={18} className="text-slate-400" />
                          )}
                        </div>

                        <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover/sub:text-red-600 transition-colors line-clamp-1">
                          {sub.name}
                        </span>
                      </div>

                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 group-hover/sub:text-red-600 group-hover/sub:bg-red-50 transition-all shrink-0 ml-2">
                        <ChevronRight size={15} className="transition-transform group-hover/sub:translate-x-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-slate-500">
                No subcategories found for {category.name}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}