import type { WCProduct, WCProductCategory } from '@/types/product';
import type { WCOrder, CreateOrderPayload } from '@/types/order';

const WC_BASE = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3`;

function wcAuthHeader(): HeadersInit {
  const credentials = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString('base64');
  return {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };
}

// ─── Variations ──────────────────────────────────────────────────────────────

export async function getProductVariations(productId: number) {
  const res = await fetch(`${WC_BASE}/products/${productId}/variations?per_page=100`, {
    headers: wcAuthHeader(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.warn(`[WC] getProductVariations failed for ID ${productId}: ${res.status} ${res.statusText}`);
    return [];
  }
  return res.json();
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(
  params: Record<string, string> = {}
): Promise<WCProduct[]> {
  const query = new URLSearchParams({
    per_page: '24',
    status: 'publish',
    ...params,
  }).toString();

  const res = await fetch(`${WC_BASE}/products?${query}`, {
    headers: wcAuthHeader(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.warn(`[WC] getProducts failed: ${res.status} ${res.statusText}`);
    return [];
  }
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const res = await fetch(`${WC_BASE}/products?slug=${slug}`, {
    headers: wcAuthHeader(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const products: WCProduct[] = await res.json();
  return products[0] ?? null;
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  const res = await fetch(`${WC_BASE}/products/${id}`, {
    headers: wcAuthHeader(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getFeaturedProducts(limit = 8): Promise<WCProduct[]> {
  return getProducts({ featured: 'true', per_page: String(limit) });
}

export async function getRelatedProducts(ids: number[]): Promise<WCProduct[]> {
  if (!ids.length) return [];
  return getProducts({ include: ids.slice(0, 4).join(','), per_page: '4' });
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<WCProductCategory[]> {
  const res = await fetch(
    `${WC_BASE}/products/categories?per_page=50&hide_empty=true`,
    {
      headers: wcAuthHeader(),
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) {
    console.warn(`[WC] getCategories failed: ${res.status} ${res.statusText}`);
    return [];
  }
  return res.json();
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function createOrder(payload: CreateOrderPayload): Promise<WCOrder> {
  const res = await fetch(`${WC_BASE}/orders`, {
    method: 'POST',
    headers: wcAuthHeader(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `Order creation failed: ${res.status}`;
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res.json();
}

export async function getOrder(id: number): Promise<WCOrder> {
  const res = await fetch(`${WC_BASE}/orders/${id}`, {
    headers: wcAuthHeader(),
  });
  if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
  return res.json();
}