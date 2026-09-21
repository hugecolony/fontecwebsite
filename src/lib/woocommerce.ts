import type { WCProduct, WCProductCategory } from '@/types/product';
import type { WCOrder, CreateOrderPayload } from '@/types/order';

// Fall back to your WordPress domain if process.env.NEXT_PUBLIC_WP_URL is undefined
const WP_HOST = (process.env.NEXT_PUBLIC_WP_URL || 'https://fontecmobiles.com').replace(/\/$/, '');
const WC_BASE = `${WP_HOST}/wp-json/wc/v3`;

const FETCH_TIMEOUT_MS = 8000; // 8 second timeout threshold

function wcAuthHeader(): HeadersInit {
  const credentials = Buffer.from(
    `${process.env.WC_CONSUMER_KEY || ''}:${process.env.WC_CONSUMER_SECRET || ''}`
  ).toString('base64');
  return {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };
}

// ─── Centralized Safe Fetch Helper ──────────────────────────────────────────

async function wcFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  const url = `${WC_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      // Aborts fetch if WooCommerce takes longer than 8 seconds
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        ...wcAuthHeader(),
        ...options.headers,
      },
    });

    if (!res.ok) {
      console.warn(`[WC] Fetch failed for ${endpoint}: ${res.status} ${res.statusText}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.warn(`[WC Timeout] Request to ${endpoint} exceeded ${FETCH_TIMEOUT_MS}ms threshold.`);
    } else {
      console.warn(`[WC Error] Fetch failed for ${endpoint}:`, error?.message || error);
    }
    return null;
  }
}

// ─── Variations ──────────────────────────────────────────────────────────────

export async function getProductVariations(productId: number) {
  const data = await wcFetch<any[]>(`/products/${productId}/variations?per_page=100`, {
    next: { revalidate: 60 },
  });
  return data ?? [];
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

  const data = await wcFetch<WCProduct[]>(`/products?${query}`, {
    next: { revalidate: 60 },
  });

  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const data = await wcFetch<WCProduct[]>(`/products?slug=${slug}`, {
    next: { revalidate: 60 },
  });

  if (!data || !Array.isArray(data)) return null;
  return data[0] ?? null;
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  return wcFetch<WCProduct>(`/products/${id}`, {
    next: { revalidate: 60 },
  });
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
  const data = await wcFetch<WCProductCategory[]>(
    `/products/categories?per_page=50&hide_empty=true`,
    {
      next: { revalidate: 3600 },
    }
  );

  return data ?? [];
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function createOrder(payload: CreateOrderPayload): Promise<WCOrder> {
  try {
    const res = await fetch(`${WC_BASE}/orders`, {
      method: 'POST',
      headers: wcAuthHeader(),
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
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
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error('Order submission timed out. Please try again.');
    }
    throw error;
  }
}

export async function getOrder(id: number): Promise<WCOrder> {
  try {
    const res = await fetch(`${WC_BASE}/orders/${id}`, {
      headers: wcAuthHeader(),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
    return res.json();
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error('Fetching order timed out.');
    }
    throw error;
  }
}