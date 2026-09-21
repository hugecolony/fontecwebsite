'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import { formatPrice, getDiscountPercent, stripHtml, cn } from '@/lib/utils';
import type { WCProduct } from '@/types/product';

interface ProductCardProps {
  product: WCProduct;
  className?: string;
  badge?: string;
}

export function ProductCard({ product, className, badge }: ProductCardProps) {
  const router = useRouter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cardTransform, setCardTransform] = useState(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  );

  // Safe image fallback check
  const rawImages = product?.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [{ src: '/placeholder-product.jpg', alt: product?.name || 'Product Image' }];

  const currentImage = rawImages[activeImageIndex]?.src ?? rawImages[0]?.src ?? '/placeholder-product.jpg';
  const imageAlt = rawImages[activeImageIndex]?.alt || product?.name || 'Product Image';

  // Safe slug check (falls back to ID or 'product')
  const productSlug = product?.slug || product?.id?.toString() || 'product';

  const discount = product?.on_sale
    ? getDiscountPercent(product.regular_price, product.sale_price)
    : 0;

  const rating = product?.rating_count ? parseFloat(product.average_rating || '0') : 0;
  const filledStars = Math.round(rating);

  const rawDescription = product?.short_description || product?.description || '';
  const subtitle = stripHtml(rawDescription).split('\n')[0] || '';

  const calculateTilt = (clientX: number, clientY: number, currentTarget: HTMLElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setCardTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateTilt(e.clientX, e.clientY, e.currentTarget);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      calculateTilt(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    }
  };

  const handleMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${productSlug}`);
  };

  return (
    <div
      className={cn('flex flex-col relative box-border cursor-pointer group h-[520px] w-full', className)}
      style={{
        color: '#464646',
        fontFamily: '"Inter", sans-serif',
        fontSize: '14px',
        lineHeight: '20px',
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
    >
      <Link
        href={`/product/${productSlug}`}
        className="relative block h-full w-full transition-transform duration-100 ease-out"
        style={{
          transform: cardTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Mobile Responsive Vertical Badge */}
        {(badge || (product?.on_sale && discount > 0)) && (
          <div className="absolute left-2 sm:-left-3.5 top-6 z-40">
            <span className="block -rotate-90 origin-left whitespace-nowrap rounded-r-md bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-2.5 py-0.5 text-[8px] font-black tracking-widest text-white shadow-md shadow-purple-500/30">
              {badge || `-${discount}% OFF`}
            </span>
          </div>
        )}

        {/* Product Card Main Container */}
        <div className="relative flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white/60 p-4 sm:p-5 rounded-[24px] shadow-lg shadow-slate-200/50 transition-all duration-300 group-hover:bg-white group-hover:shadow-indigo-500/25 group-hover:border-indigo-500/60 box-border overflow-hidden">
          
          {/* Fixed Responsive Image Container (Aspect Square / Fixed Height) */}
          <div className="relative mb-3 overflow-hidden flex items-center justify-center rounded-2xl bg-slate-50/50 border border-slate-100 h-[240px] w-full shrink-0">
            
            {/* Multi-Image Hover Zones */}
            {rawImages.length > 1 && (
              <div className="absolute inset-0 z-20 flex">
                {rawImages.map((_, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="h-full flex-1"
                    onMouseEnter={() => setActiveImageIndex(imgIdx)}
                  />
                ))}
              </div>
            )}

            {/* Image Renderer */}
            <div className="relative w-full h-full p-3 flex items-center justify-center">
              <Image
                src={currentImage}
                alt={imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="z-10 object-contain p-2 transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              />
            </div>

            {/* Gallery Thumbnail Dots */}
            {rawImages.length > 1 && (
              <div className="absolute bottom-2 inset-x-0 z-30 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {rawImages.map((_, imgIdx) => (
                  <button
                    key={imgIdx}
                    type="button"
                    onMouseEnter={() => setActiveImageIndex(imgIdx)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveImageIndex(imgIdx);
                    }}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      activeImageIndex === imgIdx
                        ? 'w-3 bg-indigo-600'
                        : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                    )}
                    aria-label={`Switch to image ${imgIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-extrabold tracking-wide text-[#464646] uppercase truncate">
            {product?.name || 'Unnamed Product'}
          </h3>

          {/* Subtitle / Description */}
          {subtitle && (
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 line-clamp-1 leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Rating Row */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 20 20"
                  className={cn('h-3 w-3', i < filledStars ? 'text-amber-400' : 'text-gray-300')}
                  fill="currentColor"
                >
                  <path d="M10 1.5l2.6 5.53 6.03.62-4.53 4.06 1.26 5.94L10 14.9l-5.36 2.75 1.26-5.94L1.37 7.65l6.03-.62L10 1.5z" />
                </svg>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-[11px] font-semibold text-slate-600">
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Divider Line */}
          <div className="my-3 h-[1px] w-full bg-slate-200/80" />

          {/* Pricing and Action Button */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-black text-[#464646]">
                {formatPrice(product?.price || product?.regular_price || '0')}
              </span>
              {product?.on_sale && product?.regular_price && (
                <span className="text-[11px] font-semibold text-slate-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product?.stock_status === 'outofstock'}
              className={cn(
                'flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer',
                product?.stock_status === 'instock' || !product?.stock_status
                  ? 'bg-[#6387ff] shadow-blue-500/20 hover:bg-[#5275ef]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              )}
              aria-label={`Buy ${product?.name || 'Product'}`}
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              {product?.stock_status === 'outofstock' ? 'Sold out' : 'Buy Now'}
            </button>
          </div>

        </div>
      </Link>
    </div>
  );
}