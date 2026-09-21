export interface CartItemImage {
  src: string;
  alt?: string;
}

export interface CartItem {
  item_key: string;
  id: number;
  name: string;
  title: string;
  price: string;
  quantity: {
    value: number;
    min_purchase: number;
    max_purchase: number;
  };
  totals: {
    subtotal: string;
    subtotal_tax: string;
    fee_subtotal: string;
    fee_subtotal_tax: string;
    total: string;
    tax: string;
    fees_tax: string;
    fees_total: string;
    discount: string;
    discount_tax: string;
  };
  slug: string;
  meta: {
    product_type: string;
    sku: string;
    dimensions: { length: string; width: string; height: string; unit: string };
    weight: number;
    variation: Record<string, string>;
  };
  cart_item_data: Record<string, unknown>;
  featured_image: string;
}

export interface CartTotals {
  subtotal: string;
  subtotal_tax: string;
  fee_total: string;
  fee_tax: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  total: string;
  tax_total: string;
  taxes: Record<string, string>;
}

export interface Cart {
  cart_key: string;
  customer: {
    billing_address: Record<string, string>;
    shipping_address: Record<string, string>;
  };
  items: CartItem[];
  item_count: number;
  items_weight: number;
  coupons: unknown[];
  needs_payment: boolean;
  needs_shipping: boolean;
  shipping: unknown;
  fees: unknown[];
  taxes: Record<string, string>;
  totals: CartTotals;
  removed_items: unknown[];
  cross_sells: unknown[];
  notices: unknown[];
}
