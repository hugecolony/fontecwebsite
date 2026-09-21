// components/cart/CartCount.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

export function CartCount() {
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = useCartStore((state) => state.itemCount);

  // Prevent SSR/hydration mismatch with persisted local storage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const count = itemCount();

  if (count <= 0) {
    return null;
  }

  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in">
      {count > 99 ? '99+' : count}
    </span>
  );
}