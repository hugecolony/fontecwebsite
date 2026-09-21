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
  badge?: string; // Optional custom badge support
}

export function ProductCard({ product, className, badge }: ProductCardProps) {
  const router = useRouter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cardTransform, setCardTransform] = useState(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  );

  const images = product.images.length > 0 ? product.images : [{ src: '/placeholder-product.jpg', alt: product.name }];
  const currentImage = images[activeImageIndex]?.src ?? images[0].src;
  const imageAlt = images[activeImageIndex]?.alt || product.name;

  const discount = product.on_sale
    ? getDiscountPercent(product.regular_price, product.sale_price)
    : 0;

  const rating = product.rating_count > 0 ? parseFloat(product.average_rating) : 0;
  const filledStars = Math.round(rating);

  // Extract clean text from short description (or fallback to regular description / specs)
  const rawDescription = product.short_description || product.description || '';
  const subtitle = stripHtml(rawDescription).split('\n')[0] || '';

  const calculateTilt = (clientX: number, clientY: number, currentTarget: HTMLElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setCardTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateTilt(e.clientX, e.clientY, e.currentTarget);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      calculateTilt(touch.clientX, touch.clientY, e.currentTarget);
    }
  };

  const handleMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product.slug}`);
  };

  return (
    <div
      className={cn('flex flex-col relative box-border cursor-pointer group', className)}
      style={{
        maxWidth: '100%',
        height: '475px',
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
        href={`/product/${product.slug}`}
        className="relative block h-full w-full transition-transform duration-100 ease-out"
        style={{
          transform: cardTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Mobile Responsive Vertical Badge */}
        {(badge || (product.on_sale && discount > 0)) && (
          <div className="absolute left-2 sm:-left-3.5 top-24 z-40">
            <span className="block -rotate-90 origin-left whitespace-nowrap rounded-r-md bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-2.5 py-0.5 text-[7px] sm:text-[8px] font-black tracking-widest text-white shadow-md shadow-purple-500/30">
              {badge || `-${discount}% OFF`}
            </span>
          </div>
        )}

        {/* Product Card Main Container */}
        <div className="relative flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white/60 p-5 rounded-[24px] shadow-lg shadow-slate-200/50 transition-shadow duration-300 group-hover:bg-white group-hover:shadow-indigo-500/25 group-hover:border-indigo-500/60 box-border">
          
          {/* Image Area with Invisible Hover Zones & Gallery Dots */}
          <div
            className="relative mb-3 overflow-hidden flex items-center justify-center rounded-2xl bg-slate-50/50 border border-slate-100"
            style={{
              width: '100%',
              height: '400px',
            }}
          >
            {/* Invisible Hover Zones for multi-image switching */}
            {images.length > 1 && (
              <div className="absolute inset-0 z-20 flex">
                {images.map((_, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="h-full flex-1"
                    onMouseEnter={() => setActiveImageIndex(imgIdx)}
                  />
                ))}
              </div>
            )}

            {/* Main Image Display */}
           <div className="relative flex shrink-0 overflow-hidden items-center justify-center w-full h-full p-2">
  <Image
    src={currentImage}
    alt={imageAlt || 'Product image'}
    fill
    sizes="(max-width: 768px) 85vw, 300px"
    // Safe fallback for placeholders, local files, and external WordPress URLs
    unoptimized={
      currentImage.includes('placehold.co') || 
      currentImage.includes('.local') || 
      currentImage.startsWith('http')
    }
    // REMOVED 'relative' from className so 'fill' works correctly
    className="z-10 object-contain transition-transform duration-500 group-hover:scale-110 pointer-events-none"
    // Add 'priority' if this image is visible above the fold on initial page load
    // priority
  />
</div>

            {/* Gallery Thumbnail Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {images.map((_, imgIdx) => (
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
                        ? 'w-3 bg-blue-600'
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
            {product.name}
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
            <span className="text-[11px] font-semibold text-slate-600">
              {rating > 0 ? rating.toFixed(1) : ''}
            </span>
          </div>

          {/* Divider Line */}
          <div className="my-3 h-[1px] w-full bg-slate-200/80" />

          {/* Pricing and Action Button */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-black text-[#464646]">
                {formatPrice(product.price)}
              </span>
              {product.on_sale && product.regular_price && (
                <span className="text-[11px] font-semibold text-slate-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock_status === 'outofstock'}
              className={cn(
                'flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer',
                product.stock_status === 'instock'
                  ? 'bg-[#6387ff] shadow-blue-500/20 hover:bg-[#5275ef]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              )}
              aria-label={`Buy ${product.name}`}
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              {product.stock_status === 'instock' ? 'Buy Now' : 'Sold out'}
            </button>
          </div>

        </div>
      </Link>
    </div>
  );
}