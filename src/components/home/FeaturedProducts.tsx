'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import type { WCProduct } from '@/types/product';

const MOCK_PRODUCTS: WCProduct[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: [
    'MagSafe Compatible Case – iPhone 15 Pro',
    '65W GaN Fast Charger',
    'ANC Pro Earbuds',
    'Braided USB-C Cable 2m',
    'Tempered Glass Screen Protector',
    '20000mAh Slim Power Bank',
    'Wireless Charging Pad',
    'Phone Ring Holder & Stand',
  ][i],
  slug: `product-${i + 1}`,
  permalink: '#',
  type: 'simple',
  status: 'publish',
  description: '',
  short_description: 'Premium quality mobile accessory',
  sku: `SKU-00${i + 1}`,
  price: ['29.99', '49.99', '89.99', '14.99', '12.99', '59.99', '34.99', '9.99'][i],
  regular_price: ['39.99', '59.99', '109.99', '19.99', '17.99', '79.99', '44.99', '14.99'][i],
  sale_price: ['29.99', '49.99', '89.99', '14.99', '12.99', '59.99', '34.99', '9.99'][i],
  on_sale: i % 2 === 0,
  purchasable: true,
  total_sales: 100,
  stock_status: 'instock',
  stock_quantity: 50,
  manage_stock: false,
  images: [
    {
      id: i,
      src: `https://placehold.co/400x400/1a1a26/6c63ff.png?text=${encodeURIComponent(['Case', 'Charger', 'Earbuds', 'Cable', 'Glass', 'Powerbank', 'Pad', 'Ring'][i])}`,
      alt: 'Product image',
    },
  ],
  categories: [
    {
      id: 1,
      name: ['Cases', 'Chargers', 'Earbuds', 'Cables', 'Screen Protectors', 'Power Banks', 'Chargers', 'Accessories'][i],
      slug: ['cases', 'chargers', 'earbuds', 'cables', 'screen-protectors', 'power-banks', 'chargers', 'accessories'][i],
    },
  ],
  tags: [],
  attributes: [],
  dimensions: { length: '', width: '', height: '' },
  weight: '',
  average_rating: (4 + Math.random()).toFixed(1),
  rating_count: Math.floor(Math.random() * 200) + 10,
  related_ids: [],
}));

interface FeaturedProductsProps {
  products: WCProduct[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS;
  const duplicatedProducts = [...displayProducts, ...displayProducts]; // Double array for smooth infinite loop
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scrolling ticker effect matching the categories section with IntersectionObserver check
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || displayProducts.length === 0) return;

    let animationFrameId: number;
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

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [displayProducts, isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      <div className="max-w-screen mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-0.5 bg-red-600 block rounded-full"></span>
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Top Quality Collection
              </span>
            </div>
            <h2
              id="featured-heading"
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
            >
              Featured Products
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold tracking-wide uppercase hover:bg-red-600 transition-colors duration-300 shadow-sm"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Auto-Scrolling Motion Container */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-hidden pb-6 pt-2 select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="w-[280px] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold tracking-wide uppercase hover:bg-red-600 transition-colors duration-300 shadow-sm"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}