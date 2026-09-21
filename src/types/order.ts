export interface BillingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface OrderLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  subtotal: string;
  total: string;
  sku: string;
  price: number;
  image?: { src: string };
}

export interface WCOrder {
  id: number;
  number: string;
  order_key: string;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
  line_items: OrderLineItem[];
  shipping_lines: unknown[];
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  subtotal: string;
  total: string;
  total_tax: string;
  customer_note: string;
}

export interface CreateOrderPayload {
  payment_method: 'cod';
  payment_method_title: string;
  set_paid: boolean;
  billing: BillingAddress;
  shipping: ShippingAddress;
  line_items: { product_id: number; quantity: number }[];
  shipping_lines: { method_id: string; method_title: string; total: string }[];
  customer_note?: string;
}
