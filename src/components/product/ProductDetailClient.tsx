'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Check,
  RotateCcw,
  ShieldCheck,
  Truck,
  CreditCard
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, stripHtml } from '@/lib/utils';
import type { WCProduct } from '@/types/product';

export interface WCVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  stock_quantity: number | null;
  image?: { id: number; src: string; alt: string };
  attributes: { name: string; option: string; slug?: string }[];
}

interface ProductDetailClientProps {
  product: WCProduct & { 
    shortDescription?: string; 
    content?: string; 
    desc?: string; 
    categories?: { id: number; name: string; slug: string }[] 
  };
  variations?: WCVariation[];
}

function normalize(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .replace(/^attribute_/, '')
    .replace(/^pa_/, '')
    .replace(/[^a-z0-9]/g, '');
}

export function ProductDetailClient({ product, variations = [] }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCart, clearCart } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const rawShortDesc = product.short_description || product.shortDescription || '';
  const rawMainDesc = product.description || product.content || product.desc || rawShortDesc;

  const shortDescriptionText = stripHtml(rawShortDesc).trim();
  const mainDescriptionText = stripHtml(rawMainDesc).trim();

  const hasShortDesc = shortDescriptionText.length > 0;
  const hasMainDesc = mainDescriptionText.length > 0;

  const ratingValue = parseFloat(product.average_rating || '0');
  const ratingCount = product.rating_count || 0;

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.attributes?.forEach((attr) => {
      if (attr.options?.[0]) {
        initial[attr.name] = attr.options[0];
      }
    });
    return initial;
  });

  const matchedVariation = useMemo(() => {
    if (!variations.length) return null;

    return variations.find((variation) => {
      if (!variation.attributes?.length) return false;

      return variation.attributes.every((varAttr) => {
        if (!varAttr.option) return true;

        const normalizedVarAttr = normalize(varAttr.name);
        const normalizedVarOption = normalize(varAttr.option);
        const normalizedVarSlug = normalize(varAttr.slug);

        const stateKey = Object.keys(selectedAttributes).find(
          (key) => normalize(key) === normalizedVarAttr
        );

        if (!stateKey) return false;

        const selectedValue = selectedAttributes[stateKey];
        if (!selectedValue) return false;

        const normalizedSelectedVal = normalize(selectedValue);

        return (
          normalizedSelectedVal === normalizedVarOption ||
          (normalizedVarSlug !== '' && normalizedSelectedVal === normalizedVarSlug)
        );
      });
    });
  }, [variations, selectedAttributes]);

  const currentPrice = matchedVariation?.price || product.price;
  const currentRegularPrice = matchedVariation?.regular_price || product.regular_price;
  const isOnSale = matchedVariation ? matchedVariation.on_sale : product.on_sale;

  useEffect(() => {
    if (matchedVariation?.image?.src) {
      const idx = product.images.findIndex((img) => img.src === matchedVariation.image?.src);
      if (idx !== -1) setSelectedImage(idx);
    }
  }, [matchedVariation, product.images]);

  const handleAttributeSelect = (attrName: string, option: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attrName]: option,
    }));
  };

  const activeImageSrc =
    product.images[selectedImage]?.src ??
    matchedVariation?.image?.src ??
    product.images[0]?.src ??
    '/placeholder-product.jpg';

  const selectedOptionsSummary = Object.values(selectedAttributes).filter(Boolean).join(', ');

  const handleAddToCart = () => {
    const itemData = {
      item_key: `${product.id}-${matchedVariation?.id || 'base'}-${Object.values(selectedAttributes).join('-')}`,
      id: matchedVariation?.id || product.id,
      name: selectedOptionsSummary ? `${product.name} (${selectedOptionsSummary})` : product.name,
      price: currentPrice,
      quantity: 1,
      image: activeImageSrc,
      slug: product.slug,
    };

    addItem(itemData);
    setIsAdding(true);
    if (openCart) openCart();
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleBuyNow = () => {
    if (clearCart) clearCart();
    
    addItem({
      item_key: `${product.id}-${matchedVariation?.id || 'base'}-${Object.values(selectedAttributes).join('-')}`,
      id: matchedVariation?.id || product.id,
      name: selectedOptionsSummary ? `${product.name} (${selectedOptionsSummary})` : product.name,
      price: currentPrice,
      quantity: 1,
      image: activeImageSrc,
      slug: product.slug,
    });

    router.push('/checkout');
  };

  const policies = [
    { title: '7 Days', subtitle: 'Replacement', icon: RotateCcw },
    { title: '1 Year', subtitle: 'Warranty', icon: ShieldCheck },
    { title: 'Free', subtitle: 'Shipping', icon: Truck },
    { title: 'Secure', subtitle: 'Payment', icon: CreditCard },
  ];

  return (
    <section className="w-screen max-w-full min-h-screen bg-slate-50 px-4 md:px-8 lg:px-12 py-6">
      <div className="w-full space-y-8">
        
        {/* Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-2xl border border-slate-200/80 p-6 md:p-10 shadow-sm w-full">
          
          {/* Gallery - 7 Columns */}
          <div className="lg:col-span-7 flex flex-col justify-between items-center relative bg-slate-50/50 rounded-xl p-6 border border-slate-100 min-h-[500px]">
            <button
              type="button"
              onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-700 hover:text-black transition-colors cursor-pointer bg-white/80 p-2 rounded-full shadow-sm hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="relative w-full aspect-[4/3] max-h-[600px] my-auto">
              <Image
                src={activeImageSrc}
                alt={product?.images?.[selectedImage]?.alt || product?.name || 'Product Image'}
                fill
                priority
                className="object-contain"
                // Serve full width on mobile, half width on tablet/desktop, capped at 600px
                sizes="(max-width: 768px) 100vw, 50vw"  
                // Prevents optimization issues on external WordPress URLs
                unoptimized={typeof activeImageSrc === 'string' && activeImageSrc.startsWith('http')}
              />
            </div>

            <button
              type="button"
              onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-slate-700 hover:text-black transition-colors cursor-pointer bg-white/80 p-2 rounded-full shadow-sm hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>

            {product.images && product.images.length > 1 && (
              <div
                ref={thumbnailContainerRef}
                className="flex items-center justify-center gap-3 overflow-x-auto w-full pt-4"
              >
                {product.images.map((img, idx) => {
                  const isSelected = selectedImage === idx;
                  return (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-slate-800 ring-1 ring-slate-800/20 shadow-sm'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt || `${product.name} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details - 5 Columns */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <nav className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                <span>Home</span>
                <span>&gt;</span>
                <span>{product.categories?.[0]?.name || 'Category'}</span>
                <span>&gt;</span>
                <span className="font-semibold text-slate-800">{product.name}</span>
              </nav>

              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 uppercase tracking-tight">
                  {product.name}
                </h1>

                {/* Rating Breakdown */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={`${
                          star <= Math.round(ratingValue)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-800">{ratingValue.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({ratingCount} reviews)</span>
                </div>

                {hasShortDesc && (
                  <div 
                    className="text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: rawShortDesc }}
                  />
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl md:text-5xl font-extrabold text-slate-900">
                    {formatPrice(currentPrice)}
                  </span>
                  {isOnSale && currentRegularPrice && currentRegularPrice !== currentPrice && (
                    <span className="text-xl font-extrabold text-slate-400 line-through">
                      {formatPrice(currentRegularPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Attributes */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="space-y-3 pt-2">
                  {product.attributes.map((attr) => (
                    <div key={attr.id || attr.name} className="space-y-2">
                      <p className="text-xs text-slate-600 font-medium">
                        {attr.name}: <span className="font-bold text-slate-900">{selectedAttributes[attr.name]}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        {attr.options.map((option) => {
                          const isSelected = selectedAttributes[attr.name] === option;
                          const optionVar = variations.find(v => 
                            v.attributes.some(a => normalize(a.option) === normalize(option))
                          );
                          const varImgSrc = optionVar?.image?.src || activeImageSrc;

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleAttributeSelect(attr.name, option)}
                              className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-blue-600 ring-2 ring-blue-600/30'
                                  : 'border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              <Image
                                src={varImgSrc}
                                alt={option}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

             {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Red Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag size={20} /> Buy Now
                </button>

                {/* Add to Cart Glass Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 border font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] backdrop-blur-md ${
                    isAdding 
                      ? 'border-green-500 text-green-600 bg-green-50/50 dark:bg-green-950/30' 
                      : 'border-slate-600 dark:border-slate-700 hover:border-slate-800 dark:hover:border-slate-400 bg-black text-white'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check size={18} className="text-green-600 dark:text-green-400" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <span className="text-lg">+</span> Add to cart
                    </>
                  )}
                </button>
              </div>
              {/* Modern Thin-Black-Border Policy Container with Smooth Hover Effects */}
              <div className="border border-black rounded-xl p-4 md:p-5 transition-all duration-300 hover:shadow-md bg-white">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {policies.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={index} 
                        className="group flex items-center gap-3 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        <div className="text-black shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-black">
                          <Icon size={30} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold text-black leading-tight group-hover:font-bold transition-all">
                            {item.title}
                          </span>
                          <span className="text-xs font-semibold text-black leading-tight group-hover:font-bold transition-all">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Full-Width Description Section */}
        <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
            Product Description
          </h2>
          <div className="prose prose-slate max-w-none text-slate-600 text-base leading-relaxed">
            {hasMainDesc ? (
              <div dangerouslySetInnerHTML={{ __html: rawMainDesc }} />
            ) : (
              <p className="text-slate-400 italic">No detailed description available.</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}