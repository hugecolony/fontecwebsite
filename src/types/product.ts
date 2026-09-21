export interface WCImage {
  id: number;
  src: string;
  alt: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCAttribute {
  id: number;
  name: string;
  options: string[];
}

export interface WCDimensions {
  length: string;
  width: string;
  height: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  manage_stock: boolean;
  images: WCImage[];
  categories: WCCategory[];
  tags: { id: number; name: string; slug: string }[];
  attributes: WCAttribute[];
  dimensions: WCDimensions;
  weight: string;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
}

export interface WCProductCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: WCImage | null;
  count: number;
}
