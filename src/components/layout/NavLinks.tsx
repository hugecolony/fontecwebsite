'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  Loader2,
  Sparkles,
  Layers,
  X,
  Store,
  Tag,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

const WP_BASE_URL = 'https://fontecmobiles.com';

/* ─────────────────────────────────────────────────────────────────────────────
   Interfaces & Types
───────────────────────────────────────────────────────────────────────────── */
interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
  image?: {
    src?: string;
    thumbnail?: string;
  } | string | null;
  images?: Array<{ src: string }>;
  thumbnail?: string;
}

interface WPProduct {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  short_description?: string;
  images?: Array<{ src: string }>;
  on_sale?: boolean;
  prices?: {
    price?: string;
    regular_price?: string;
    sale_price?: string;
    currency_symbol?: string;
    currency_minor_unit?: number;
  };
}

interface NavLinksProps {
  mobile?: boolean;
  onClose?: () => void;
  onOpenSearch?: () => void;
  cartItemCount?: number;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helper Functions
───────────────────────────────────────────────────────────────────────────── */
function getCategoryImageUrl(cat?: WPCategory | null): string | null {
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

function formatProductPrice(product: WPProduct): string {
  if (!product.prices?.price) return '';
  const minorUnits = product.prices.currency_minor_unit ?? 2;
  const rawPrice = parseFloat(product.prices.price);
  const amount = rawPrice / Math.pow(10, minorUnits);
  const symbol = product.prices.currency_symbol || 'Rs ';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function formatRegularPrice(product: WPProduct): string {
  if (!product.prices?.regular_price) return '';
  const minorUnits = product.prices.currency_minor_unit ?? 2;
  const rawPrice = parseFloat(product.prices.regular_price);
  const amount = rawPrice / Math.pow(10, minorUnits);
  const symbol = product.prices.currency_symbol || 'Rs ';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function getDiscountPercent(product: WPProduct): number | null {
  const price = product.prices?.price ? parseFloat(product.prices.price) : null;
  const regular = product.prices?.regular_price ? parseFloat(product.prices.regular_price) : null;
  if (!price || !regular || regular <= price) return null;
  return Math.round(((regular - price) / regular) * 100);
}

function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shared: Product List Panel (Scrollable)
───────────────────────────────────────────────────────────────────────────── */
function ProductListPanel({
  products,
  loading,
  onNavigate,
}: {
  products: WPProduct[];
  loading?: boolean;
  onNavigate?: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-600/70 text-sm font-semibold font-sans">
        <Loader2 size={20} className="animate-spin mr-2 text-red-500" />
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 text-slate-600/50 font-sans">
        <ShoppingBag size={32} className="mb-2 text-slate-600/30" />
        <p className="text-sm font-semibold">No products found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[440px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent font-sans">
      {products.map((prod) => {
        const price = formatProductPrice(prod);
        const regularPrice = formatRegularPrice(prod);
        const discount = getDiscountPercent(prod);
        const blurb = stripHtml(prod.short_description);
        const imgUrl = prod.images?.[0]?.src;

        return (
          <Link
            key={prod.id}
            href={`/product/${prod.slug}`}
            onClick={onNavigate}
            className="group flex items-start gap-3.5 text-left p-3 rounded-2xl transition-all duration-200 bg-white/70 hover:bg-white shadow-sm hover:shadow border border-slate-200/80 hover:border-slate-300"
          >
            <div className="relative w-16 h-16 shrink-0 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={prod.name}
                  fill
                  sizes="64px"
                  className="object-contain p-1.5 group-hover:scale-105 transition-transform"
                />
              ) : (
                <ShoppingBag size={24} className="text-slate-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-sm sm:text-base font-bold text-slate-600 group-hover:text-red-600 truncate transition-colors leading-snug">
                {prod.name}
              </span>
              {blurb && (
                <p className="text-xs leading-snug text-slate-600 line-clamp-2 mt-0.5 font-medium">
                  {blurb}
                </p>
              )}
              {discount !== null && (
                <span className="inline-block text-xs font-black text-lime-600 mt-1 uppercase tracking-wide">
                  {discount}% OFF
                </span>
              )}
              <div className="flex items-baseline gap-2 mt-0.5">
                {price && <span className="text-sm sm:text-base font-black text-slate-600">{price}</span>}
                {regularPrice && discount !== null && (
                  <span className="text-xs font-bold text-slate-400 line-through">{regularPrice}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shared: Scrollable Bento Card Grid Panel (Frosted Look)
───────────────────────────────────────────────────────────────────────────── */
function SubcategoryBentoTile({
  subcategory,
  onNavigate,
  onHover,
}: {
  subcategory: WPCategory;
  onNavigate?: () => void;
  onHover?: () => void;
}) {
  const imageUrl = getCategoryImageUrl(subcategory);
  const description = stripHtml(subcategory.description) || 'Explore our latest collection of items curated just for you.';

  return (
    <Link
      href={`/shop?category=${subcategory.slug}`}
      onClick={onNavigate}
      onMouseEnter={onHover}
      className="group relative block rounded-3xl bg-white/70 overflow-hidden border border-slate-200/80 hover:border-red-500/70 transition-all duration-300 font-sans shrink-0 shadow-md"
    >
      {imageUrl ? (
        <Image
          alt={subcategory.name}
          src={imageUrl}
          fill
          sizes="(max-width: 1200px) 50vw, 33vw"
          className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-60"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <Layers size={40} className="text-slate-400" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

      <div className="relative p-5 sm:p-6 lg:p-8 flex flex-col justify-between h-full min-h-[210px]">
        <div>
          <p className="text-xs font-bold tracking-widest text-red-400 uppercase drop-shadow">Subcategory</p>
          <p className="text-lg sm:text-xl font-black text-white mt-1 drop-shadow-md line-clamp-2">{subcategory.name}</p>
        </div>

        <div className="mt-8 sm:mt-12 lg:mt-16">
          <div className="translate-y-8 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-xs sm:text-sm text-white/90 line-clamp-2 font-medium drop-shadow">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SubcategoryBentoGridPanel({
  subcategories,
  loading,
  onNavigate,
  onHoverSub,
  emptyLabel,
}: {
  subcategories: WPCategory[];
  loading?: boolean;
  onNavigate?: () => void;
  onHoverSub?: (sub: WPCategory) => void;
  emptyLabel?: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[380px] text-slate-600/70 text-sm font-semibold font-sans">
        <Loader2 size={22} className="animate-spin mr-2 text-red-500" />
        Loading subcategories...
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center text-slate-600/50 font-sans">
        <Layers size={36} className="mb-2 text-slate-400" />
        <p className="text-sm font-semibold">{emptyLabel || 'No subcategories found.'}</p>
      </div>
    );
  }

  return (
    <div className="max-h-[440px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
        {subcategories.map((sub) => (
          <SubcategoryBentoTile
            key={sub.id}
            subcategory={sub}
            onNavigate={onNavigate}
            onHover={onHoverSub ? () => onHoverSub(sub) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function NavLinks({ mobile, onClose }: NavLinksProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get('category');

  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Prevent background website scrolling when mobile drawer is open
  useEffect(() => {
    if (mobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [mobile]);

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
    if (mobile) {
      return (
        <div className="fixed inset-x-0 top-0 bottom-0 z-50 w-full h-[100dvh] bg-white/95 backdrop-blur-3xl backdrop-saturate-200 text-slate-600 flex flex-col p-4 sm:p-6 overflow-y-auto font-sans">
          {/* Mirrors the exact close button area of the loaded state */}
          <div className="flex items-center justify-end pb-3 mb-3 shrink-0">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-2xl text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer ml-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            )}
          </div>
          
          {/* Mirrors the exact gap and padding of the loaded categories */}
          <div className="flex flex-col gap-3 pb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="h-12 w-full rounded-2xl bg-slate-200/60 animate-pulse border border-slate-200/80 shrink-0" 
              />
            ))}
          </div>
        </div>
      );
    }

    // Desktop Loading State
    return (
      <div className="relative inline-flex items-center gap-2 p-1.5 rounded-3xl font-sans">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="h-11 w-11 rounded-3xl bg-slate-200/60 animate-pulse border border-slate-200/80 shrink-0" 
          />
        ))}
      </div>
    );
  }

  // Mobile Sidebar View
  if (mobile) {
    return (
      <div className="fixed inset-x-0 top-0 bottom-0 z-50 w-full h-[100dvh] bg-white/95 backdrop-blur-3xl backdrop-saturate-200 text-slate-600 flex flex-col p-4 sm:p-6 overflow-y-auto animate-in fade-in-0 duration-200 font-sans">
        <div className="flex items-center justify-end pb-3 mb-3 shrink-0">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-2xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer ml-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 pb-6">
          <ShopAllDropdownItem
            categories={categories}
            mobile={mobile}
            onClose={onClose}
            isActive={pathname === '/shop' && !activeCategory}
          />

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

  // Desktop Navigation View
  return (
    <div className="relative inline-flex items-center gap-2 p-1.5 rounded-3xl text-slate-900 font-sans">
      <ShopAllDropdownItem
        categories={categories}
        mobile={mobile}
        onClose={onClose}
        isActive={pathname === '/shop' && !activeCategory}
      />

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
   Shop All Dropdown Component
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
  const [hoveredCat, setHoveredCat] = useState<WPCategory | null>(categories[0] || null);
  const [subcategories, setSubcategories] = useState<WPCategory[]>([]);
  const [hoveredSubcat, setHoveredSubcat] = useState<WPCategory | null>(null);
  const [products, setProducts] = useState<WPProduct[]>([]);

  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loadingProds, setLoadingProds] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (categories.length > 0 && !hoveredCat) {
      setHoveredCat(categories[0]);
    }
  }, [categories, hoveredCat]);

  useEffect(() => {
    if (!hoveredCat) return;

    async function fetchSubcategories() {
      setLoadingSubs(true);
      try {
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=${hoveredCat?.id}&per_page=20`
        );
        if (res.ok) {
          const data: WPCategory[] = await res.json();
          const filtered = data.filter(
            (c) => c.slug.toLowerCase() !== 'uncategorized' && c.name.toLowerCase() !== 'uncategorized'
          );
          setSubcategories(filtered);
          setHoveredSubcat(filtered[0] || null);
        } else {
          setSubcategories([]);
          setHoveredSubcat(null);
        }
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setSubcategories([]);
        setHoveredSubcat(null);
      } finally {
        setLoadingSubs(false);
      }
    }

    fetchSubcategories();
  }, [hoveredCat]);

  useEffect(() => {
    const targetCatId = hoveredSubcat ? hoveredSubcat.id : hoveredCat?.id;
    if (!targetCatId) {
      setProducts([]);
      return;
    }

    async function fetchProducts() {
      setLoadingProds(true);
      try {
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wc/store/v1/products?category=${targetCatId}&per_page=6`
        );
        if (res.ok) {
          const data: WPProduct[] = await res.json();
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoadingProds(false);
      }
    }

    fetchProducts();
  }, [hoveredSubcat, hoveredCat]);

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
      <div className="w-full font-sans">
        <div className="flex items-center justify-between w-full px-5 h-12 rounded-2xl bg-white/70 border border-slate-200/80 backdrop-blur-md transition-colors hover:bg-white shadow-sm">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-8 h-8 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <Store size={16} />
            </div>
            <Link
              href="/shop"
              onClick={onClose}
              className={cn(
                'text-slate-700 font-black text-base sm:text-lg flex-1 text-left line-clamp-1 tracking-wide',
                isActive && 'text-red-600'
              )}
            >
              Shop All
            </Link>
          </div>

          {categories.length > 0 && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-1 -mr-1 text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle Shop All categories"
            >
              <ChevronRight
                size={20}
                className={cn('transition-transform duration-200 stroke-[3]', isOpen && 'rotate-90 text-red-600')}
              />
            </button>
          )}
        </div>

        {isOpen && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-2 p-2 mt-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg">
            <Link
              href="/shop"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-slate-200 text-left hover:bg-white transition"
            >
              <span className="text-sm font-extrabold text-red-600 uppercase tracking-wider">Browse Complete Catalog &rarr;</span>
            </Link>
            {categories.map((cat) => {
              const imageUrl = getCategoryImageUrl(cat);
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-slate-200 text-left hover:bg-white transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={cat.name} fill className="object-contain p-1" />
                      ) : (
                        <Layers size={18} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-700 line-clamp-1">{cat.name}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative font-sans" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
          href="/shop"
          onClick={onClose}
          className={cn(
            'group relative px-3 py-2 h-11 rounded-3xl text-sm sm:text-base font-extrabold tracking-wide transition-all duration-300 ease-out whitespace-nowrap flex items-center cursor-pointer bg-transparent',
            isActive || isOpen
              ? 'text-red-600 border-red-200 bg-white/50'
              : 'text-slate-700 border-transparent hover:border-slate-300'
          )}
        >
          <Store size={18} className="shrink-0 text-slate-600 group-hover:text-red-600 transition-colors" />

          <div className="flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-out max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2.5 group-hover:pr-1">
            <span>Shop All</span>
          </div>
      </Link>

      {isOpen && (
        <div className="fixed left-1/2 -translate-x-1/2 top-12 w-[98vw] max-w-[85rem] z-50 pt-2 animate-in fade-in-0 slide-in-from-top-2 duration-200 px-4">
          <div className="relative overflow-hidden rounded-3xl bg-white/45 backdrop-saturate-200 border border-slate-200/90 backdrop-blur-3xl text-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.12)] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-slate-200/80 bg-white/60 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-black flex items-center gap-2 tracking-wider uppercase shadow-sm">
                  <Sparkles size={15} className="text-red-500" />
                  Full Product Store
                </span>
              </div>
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="text-xs sm:text-sm font-extrabold text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1.5"
              >
                Browse Complete Catalog <ArrowRight size={15} />
              </Link>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:divide-x divide-y lg:divide-y-0 divide-slate-200/80 overflow-y-auto lg:overflow-hidden lg:min-h-[500px]">
              {/* Left Column: Products */}
              <div className="w-full lg:col-span-4 p-5 lg:p-6 bg-slate-50/60 backdrop-blur-xl flex flex-col order-2 lg:order-1">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <span className="text-xs font-black tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
                    <Tag size={14} className="text-red-500" />
                    Featured Products
                  </span>
                </div>
                <div className="flex-1 min-h-0">
                  <ProductListPanel
                    products={products}
                    loading={loadingProds}
                    onNavigate={() => setIsOpen(false)}
                  />
                </div>
              </div>

              {/* Middle Column: Category Links */}
              <div className="w-full lg:col-span-3 p-5 bg-white/40 backdrop-blur-xl flex flex-col justify-between order-1 lg:order-2">
                <div>
                  <span className="text-xs font-black tracking-widest text-slate-500 uppercase block mb-3 px-2">
                    Categories
                  </span>
                  <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    {categories.map((cat) => {
                      const isHovered = hoveredCat?.id === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onMouseEnter={() => setHoveredCat(cat)}
                          className={cn(
                            'group/cat flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-150',
                            isHovered ? 'bg-white shadow-sm border border-slate-200/60' : 'hover:bg-white/50'
                          )}
                        >
                          <Link
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'font-extrabold text-sm sm:text-base flex-1 truncate transition-colors',
                              isHovered ? 'text-red-600' : 'text-slate-700 hover:text-slate-900'
                            )}
                          >
                            {cat.name}
                          </Link>
                          <ChevronRight
                            size={16}
                            className={cn(
                              'transition-transform shrink-0 ml-1.5',
                              isHovered ? 'text-red-500 translate-x-0.5' : 'text-slate-300 group-hover/cat:text-slate-500'
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block text-center py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:border-red-500/60 text-xs sm:text-sm font-black text-slate-800 hover:bg-slate-50 transition uppercase tracking-wider shadow-sm"
                >
                  View All &rarr;
                </Link>
              </div>

              {/* Right Column: Subcategory Bento Cards */}
              <div className="w-full lg:col-span-5 p-5 lg:p-6 bg-white/40 backdrop-blur-xl order-3 lg:order-3">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <span className="text-xs font-black tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
                    <Layers size={14} className="text-red-500" />
                    {hoveredCat?.name ? `${hoveredCat.name} Subcategories` : 'Subcategories'}
                  </span>
                </div>
                <SubcategoryBentoGridPanel
                  subcategories={subcategories}
                  loading={loadingSubs}
                  onNavigate={() => setIsOpen(false)}
                  onHoverSub={(sub) => setHoveredSubcat(sub)}
                  emptyLabel={hoveredCat?.name ? `No subcategories in ${hoveredCat.name} yet.` : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Category Dropdown Item Component
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
  const [products, setProducts] = useState<WPProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCategoryData = async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const subRes = await fetch(
        `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=${category.id}&per_page=20`
      );

      if (subRes.ok) {
        const subData: WPCategory[] = await subRes.json();
        const filteredSubs = subData.filter(
          (sub) => sub.slug.toLowerCase() !== 'uncategorized' && sub.name.toLowerCase() !== 'uncategorized'
        );
        setSubcategories(filteredSubs);
      }

      const prodRes = await fetch(
        `${WP_BASE_URL}/wp-json/wc/store/v1/products?category=${category.id}&per_page=6`
      );
      if (prodRes.ok) {
        const prodData: WPProduct[] = await prodRes.json();
        setProducts(prodData);
      }
    } catch (error) {
      console.error(`Failed to fetch data for ${category.name}:`, error);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  useEffect(() => {
    if (mobile) {
      fetchCategoryData();
    }
  }, [mobile]);

  const handleMouseEnter = () => {
    if (mobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
    fetchCategoryData();
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
      <div className="w-full font-sans">
        <div className="flex items-center justify-between w-full px-5 h-12 rounded-2xl bg-white/70 border border-slate-200/80 backdrop-blur-md transition-colors hover:bg-white shadow-sm">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-8 h-8 shrink-0 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              {categoryImageUrl ? (
                <Image src={categoryImageUrl} alt={category.name} fill className="object-contain p-1" />
              ) : (
                <Layers size={16} className="text-slate-400" />
              )}
            </div>
            <Link
              href={categoryHref}
              onClick={onClose}
              className={cn(
                'text-slate-700 font-black text-base sm:text-lg flex-1 text-left line-clamp-1 tracking-wide',
                isActive && 'text-red-600'
              )}
            >
              {category.name}
            </Link>
          </div>

          {hasSubcats && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-1 -mr-1 text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
              aria-label={`Toggle ${category.name} subcategories`}
            >
              <ChevronRight
                size={20}
                className={cn('transition-transform duration-200 stroke-[3]', isOpen && 'rotate-90 text-red-600')}
              />
            </button>
          )}
        </div>

        {isOpen && hasSubcats && (
          <div className="grid grid-cols-1 gap-2 p-2 mt-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-lg">
            {subcategories.map((sub) => {
              const imageUrl = getCategoryImageUrl(sub);
              return (
                <Link
                  key={sub.id}
                  href={`/shop?category=${sub.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-slate-200 text-left hover:bg-white transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={sub.name} fill className="object-contain p-1" />
                      ) : (
                        <Layers size={18} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-700 line-clamp-1">{sub.name}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative font-sans" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        href={categoryHref}
        onClick={onClose}
        className={cn(
          'group relative px-2.5 py-2 h-11 rounded-3xl text-sm sm:text-base font-extrabold transition-all duration-300 ease-out flex items-center cursor-pointer',
          isActive || isOpen
            ? 'bg-white/80 text-slate-900 shadow-sm backdrop-blur-md'
            : 'text-slate-600 hover:bg-white/40'
        )}
      >
        <div className="relative w-7 h-7 shrink-0 flex items-center justify-center overflow-hidden">
          {categoryImageUrl ? (
            <Image src={categoryImageUrl} alt={category.name} fill sizes="28px" className="object-contain" />
          ) : (
            <Layers size={18} />
          )}
        </div>

        <div className="flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-out max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2.5 group-hover:pr-1">
          <span className="truncate text-slate-900 font-extrabold">{category.name}</span>
        </div>
      </Link>

      {isOpen && (
        <div className="fixed left-1/2 -translate-x-1/2 top-12 w-[93vw] max-w-[98rem] z-40 pt-3 animate-in fade-in-0 slide-in-from-top-2 duration-200 px-4">
          <div className="relative rounded-3xl bg-white/45 backdrop-saturate-200 backdrop-blur-3xl border border-slate-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden text-slate-700 max-h-[85vh] flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-slate-500 min-h-[380px]">
                <Loader2 size={24} className="animate-spin text-red-500" />
                <span className="text-sm font-semibold tracking-wide">Loading {category.name}...</span>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-slate-200/80 bg-white/60 backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-black flex items-center gap-2 tracking-wider uppercase shadow-sm">
                      <Sparkles size={15} className="text-red-500" />
                      {category.name}
                    </span>
                  </div>
                  <Link
                    href={categoryHref}
                    onClick={() => setIsOpen(false)}
                    className="text-xs sm:text-sm font-extrabold text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1.5"
                  >
                    View All {category.name} <ArrowRight size={15} />
                  </Link>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:divide-x divide-y lg:divide-y-0 divide-slate-200/80 overflow-y-auto lg:overflow-hidden lg:min-h-[480px]">
                  <div className="w-full lg:col-span-5 p-5 lg:p-6 bg-slate-50/60 backdrop-blur-xl flex flex-col order-2 lg:order-1">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <span className="text-xs font-black tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
                        <Tag size={14} className="text-red-500" />
                        Top {category.name}
                      </span>
                    </div>
                    <div className="flex-1 min-h-0">
                      <ProductListPanel
                        products={products}
                        loading={loading}
                        onNavigate={() => setIsOpen(false)}
                      />
                    </div>
                  </div>

                  <div className="w-full lg:col-span-7 p-5 lg:p-6 bg-white/40 backdrop-blur-xl order-1 lg:order-2">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <span className="text-xs font-black tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
                        <Layers size={14} className="text-red-500" />
                        Subcategories
                      </span>
                    </div>
                    <SubcategoryBentoGridPanel
                      subcategories={subcategories}
                      loading={loading}
                      onNavigate={() => setIsOpen(false)}
                      emptyLabel={`No subcategories found in ${category.name}.`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}