import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  item_key: string;
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  buyNowItem: CartItem | null;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (item_key: string) => void;
  updateQuantity: (item_key: string, quantity: number) => void;
  clearCart: () => void;
  setBuyNowItem: (item: CartItem | null) => void;
  clearBuyNow: () => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      buyNowItem: null,
      isOpen: false,

      addItem: (newItem) => {
        const currentItems = get().items;
        // Fix: Compare unique item_key instead of product ID to support variations
        const existingIndex = currentItems.findIndex(
          (item) => item.item_key === newItem.item_key
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + newItem.quantity,
          };
          set({ items: updated });
        } else {
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (item_key) => {
        set({ items: get().items.filter((i) => i.item_key !== item_key) });
      },

      updateQuantity: (item_key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(item_key);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.item_key === item_key ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      setBuyNowItem: (item) => set({ buyNowItem: item }),

      clearBuyNow: () => set({ buyNowItem: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      subtotal: () =>
        get().items.reduce(
          (acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      // Fix: Persist buyNowItem so direct checkout state persists on refresh
      partialize: (state) => ({ 
        items: state.items,
        buyNowItem: state.buyNowItem 
      }),
    }
  )
);