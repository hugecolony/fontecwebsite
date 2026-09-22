'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import type { WCProduct } from '@/types/product';

interface ProductCardProps {
  product: WCProduct;
  className?: string;
  badge?: string;
}

export function ProductCard({ product, className, badge }: ProductCardProps) {
  const router = useRouter();

  const rawImages =
    product?.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [{ src: '/placeholder-product.jpg', alt: product?.name || 'Product Image' }];

  const currentImage = rawImages[0]?.src ?? '/placeholder-product.jpg';
  const imageAlt = rawImages[0]?.alt || product?.name || 'Product Image';

  const productSlug = product?.slug || product?.id?.toString() || 'product';

  const regularPrice = parseFloat(product?.regular_price || product?.price || '0');
  const salePrice = parseFloat(product?.sale_price || product?.price || '0');
  const discountPercent =
    product?.on_sale && regularPrice > 0 && salePrice < regularPrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;

  const rating = product?.rating_count ? parseFloat(product.average_rating || '0') : 0;
  const filledStars = Math.round(rating);

  // Extract the first line/sentence of the description
  const getFirstLineDescription = () => {
    const rawDesc = product?.short_description || product?.description || '';
    const cleanText = rawDesc.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return 'High quality power bank with fast charging capabilities.';
    const firstSentence = cleanText.split(/[\.\n]/)[0];
    return firstSentence ? `${firstSentence}.` : cleanText;
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${productSlug}`);
  };

  return (
    <div
      className={cn('flex flex-col relative box-border cursor-pointer group w-full pt-28 sm:pt-36', className)}
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <Link href={`/product/${productSlug}`} className="relative block w-full no-underline">
        
        {/* Main White Card Body */}
        <div
          className="relative flex flex-col justify-between bg-white pb-4 px-4 sm:px-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]"
          style={{
            borderRadius: '2.5rem',
          }}
        >
          {/* Floating Product Image (Larger size popping out above card top edge) */}
          <div className="relative w-full z-20 flex items-center justify-center -mt-28 sm:-mt-36 mb-2">
            <div className="relative w-full aspect-square max-w-[240px] sm:max-w-[300px] md:max-w-[340px] flex items-center justify-center p-2 transition-transform duration-500 group-hover:scale-105">
              <Image
                src={currentImage}
                alt={imageAlt}
                fill
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 33vw"
                className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)]"
                priority
              />
            </div>
          </div>

          {/* Ribbon Badge */}
          {(badge || (product?.on_sale && discountPercent > 0)) && (
            <div className="absolute right-0 top-12 z-30">
              <span className="block rotate-90 origin-right whitespace-nowrap rounded-l-md bg-[#ffe600] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black tracking-widest text-slate-900 shadow-sm">
                {badge || `${discountPercent}% OFF`}
              </span>
            </div>
          )}

          <div>
            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 line-clamp-1 mb-1 pr-4">
              {product?.name || 'Unnamed Product'}
            </h3>

            {/* Rating Row */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 20 20"
                    className={cn(
                      'h-3.5 w-3.5',
                      i < filledStars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                    )}
                  >
                    <path d="M10 1.5l2.6 5.53 6.03.62-4.53 4.06 1.26 5.94L10 14.9l-5.36 2.75 1.26-5.94L1.37 7.65l6.03-.62L10 1.5z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {rating > 0 ? rating.toFixed(1) : '0.0'}
              </span>
            </div>

            {/* 1st Line Description */}
            <p className="text-xs text-slate-500 line-clamp-2 leading-tight mb-4 min-h-[2rem]">
              {getFirstLineDescription()}
            </p>
          </div>

          {/* Pricing & Buy Button Footer Row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {formatPrice(product?.price || product?.regular_price || '0')}
              </span>
              {product?.on_sale && product?.regular_price && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product?.stock_status === 'outofstock'}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm',
                product?.stock_status === 'outofstock'
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-black hover:bg-red-600 text-white'
              )}
              aria-label={`Buy ${product?.name || 'Product'}`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{product?.stock_status === 'outofstock' ? 'Sold out' : 'Buy Now'}</span>
            </button>
          </div>

        </div>
      </Link>
    </div>
  );
}