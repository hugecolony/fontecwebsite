'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';

// Hydrates cart from localStorage on mount (Zustand persist handles this,
// but we keep this provider for future server-sync logic).
export function CartProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      // Trigger Zustand persist rehydration
      useCartStore.persist.rehydrate();
    }
  }, []);

  return <>{children}</>;
}
