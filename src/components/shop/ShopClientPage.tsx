'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { cn } from '@/lib/utils';
import type { WCProduct, WCProductCategory } from '@/types/product';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const FALLBACK_CATEGORIES = [
  { id: 0, name: 'All', slug: '' },
  { id: 1, name: 'Cases', slug: 'cases' },
  { id: 2, name: 'Chargers', slug: 'chargers' },
  { id: 3, name: 'Earbuds', slug: 'earbuds' },
  { id: 4, name: 'Cables', slug: 'cables' },
  { id: 5, name: 'Screen Protectors', slug: 'screen-protectors' },
  { id: 6, name: 'Power Banks', slug: 'power-banks' },
];

interface ShopClientPageProps {
  initialProducts: WCProduct[];
  categories: WCProductCategory[];
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
}

export function ShopClientPage({
  initialProducts,
  categories,
  currentCategory,
  currentSearch,
  currentSort,
}: ShopClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filterOpen, setFilterOpen] = useState(false);

  const displayCategories =
    categories.length > 0
      ? [{ id: 0, name: 'All', slug: '' } as WCProductCategory, ...categories]
      : FALLBACK_CATEGORIES;

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val) params.set(key, val);
      else params.delete(key);
    });
    startTransition(() => router.push(`/shop?${params.toString()}`));
  }

  const totalActive = [currentCategory, currentSearch, currentSort].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-1">
          Mobile Accessories
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {currentSearch
            ? `Results for "${currentSearch}"`
            : currentCategory
            ? displayCategories.find((c) => c.slug === currentCategory)?.name ?? 'Shop'
            : 'All Products'}
        </h1>
        <p className="text-muted text-sm mt-1">
          {initialProducts.length} product{initialProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        {/* Category pills — desktop */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap flex-1">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ category: cat.slug || undefined })}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                (currentCategory ?? '') === cat.slug
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'glass glass-hover text-muted hover:text-foreground'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={cn(
            'sm:hidden flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-sm font-medium',
            filterOpen ? 'text-accent border-accent/40' : 'text-muted'
          )}
        >
          <SlidersHorizontal size={16} />
          Filters
          {totalActive > 0 && (
            <span className="ml-1 min-w-[18px] h-[18px] bg-accent text-white text-xs rounded-full flex items-center justify-center">
              {totalActive}
            </span>
          )}
        </button>

        {/* Sort dropdown */}
        <div className="relative ml-auto">
          <select
            value={currentSort ?? ''}
            onChange={(e) => navigate({ sort: e.target.value || undefined })}
            className="appearance-none glass border border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm text-foreground bg-transparent focus:outline-none focus:border-accent cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-surface text-foreground">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        </div>
      </div>

      {/* Mobile filter panel */}
      {filterOpen && (
        <div className="sm:hidden mb-6 glass-card p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Categories</p>
            <button onClick={() => setFilterOpen(false)}>
              <X size={16} className="text-muted" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  navigate({ category: cat.slug || undefined });
                  setFilterOpen(false);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  (currentCategory ?? '') === cat.slug
                    ? 'bg-accent text-white'
                    : 'glass text-muted hover:text-foreground'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filters */}
      {(currentSearch || currentCategory) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-muted">Active filters:</span>
          {currentCategory && (
            <button
              onClick={() => navigate({ category: undefined })}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium hover:bg-accent/25 transition-colors"
            >
              {displayCategories.find((c) => c.slug === currentCategory)?.name}
              <X size={11} />
            </button>
          )}
          {currentSearch && (
            <button
              onClick={() => navigate({ search: undefined })}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium hover:bg-accent/25 transition-colors"
            >
              &ldquo;{currentSearch}&rdquo;
              <X size={11} />
            </button>
          )}
          <button
            onClick={() => navigate({ category: undefined, search: undefined, sort: undefined })}
            className="text-xs text-muted hover:text-foreground transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product grid */}
      <ProductGrid products={initialProducts} loading={isPending} />
    </div>
  );
}
