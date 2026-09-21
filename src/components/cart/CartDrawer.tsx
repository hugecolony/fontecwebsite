'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, cn } from '@/lib/utils';

export function CartDrawer() {
  const [isMounted, setIsMounted] = useState(false);

  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
  } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentItems = isMounted ? items : [];
  const count = currentItems.reduce((acc, item) => acc + item.quantity, 0);
  const total = currentItems.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity,
    0
  );

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeCart]);

  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={cn(
          'fixed inset-0 z-50 bg-black/30 backdrop-blur-xs transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md z-50 flex flex-col bg-[#F3F3F3] text-slate-800 transition-transform duration-300 ease-in-out font-sans shadow-2xl',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Cart</h2>
            {count > 0 && (
              <span className="w-6 h-6 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <p className="font-medium text-slate-500 text-base">Your cart is empty</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 text-sm font-semibold underline underline-offset-4 text-slate-800 hover:text-slate-600 cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentItems.map((item) => {
                const itemPriceNum = parseFloat(item.price) || 0;
                const itemTotal = itemPriceNum * item.quantity;

                return (
                  <div
                    key={item.item_key}
                    className="bg-white rounded-2xl p-4 shadow-xs flex gap-3.5 items-start relative"
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeCart}
                      className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center mt-1"
                    >
                      <Image
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="text-base font-bold text-slate-900 line-clamp-1 hover:opacity-80 transition-opacity"
                      >
                        {item.name}
                      </Link>

                      {/* Quantity Controls & Total Pricing */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-slate-300 rounded-md bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.item_key, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.item_key, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <span className="text-base font-bold text-slate-900">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Icon */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.item_key)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        {currentItems.length > 0 && (
          <div className="px-6 pb-6 pt-2 space-y-4">
            {/* Discount Accordion Bar */}
            {/* <div className="py-3 border-y border-slate-200/80 flex items-center justify-between text-slate-700 cursor-pointer">
              <span className="text-sm font-medium">Discount</span>
              <Plus size={16} className="text-slate-500" />
            </div> */}

            {/* Total Summary */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-800">Estimated total</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Taxes and shipping calculated at checkout.
              </p>
            </div>

            {/* Check out CTA Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 bg-[#EFEFEF] hover:bg-[#E5E5E5] text-slate-900 font-semibold text-sm rounded-full flex items-center justify-center transition-all border border-slate-300/80 cursor-pointer shadow-2xs active:scale-[0.99]"
            >
              Check out
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}