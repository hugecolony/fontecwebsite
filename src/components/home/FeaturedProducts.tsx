'use client';

import { useRef } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      // Scrolls by container width on click of arrows
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -clientWidth : clientWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 w-full px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-1.5 bg-gradient-to-b from- red-600 via- red-600 to- red-600 rounded-full" />
          <h2 id="category-heading" className="text-2xl md:text-4xl font-extrabold text-slate-600 tracking-tight">
            Featured Products <span className="bg-gradient-to-r from- red-600 via- red-600 to- red-600 bg-clip-text text-transparent"></span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text- red-600 transition-colors font-medium"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Horizontal Scrollable Slider Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4"
      >
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-20px)] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobile view all link */}
      <div className="sm:hidden mt-6 text-center">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text- red-600 hover:text- red-700"
        >
          View All Products
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}