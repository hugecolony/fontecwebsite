import { cache } from 'react';
import type { WCProduct, WCProductCategory } from '@/types/product';
import type { WCOrder, CreateOrderPayload } from '@/types/order';

// Fall back to your WordPress domain if process.env.NEXT_PUBLIC_WP_URL is undefined
const WP_HOST = (process.env.NEXT_PUBLIC_WP_URL || 'https://fontecmobiles.com').replace(/\/$/, '');
const WC_BASE = `${WP_HOST}/wp-json/wc/v3`;

// Reduced timeout threshold from 15s to 8s to prevent hanging requests on slow WordPress hosts
const FETCH_TIMEOUT_MS = 8000;

function wcAuthHeader(): HeadersInit {
  const key = process.env.WC_CONSUMER_KEY || '';
  const secret = process.env.WC_CONSUMER_SECRET || '';

  if (!key || !secret) {
    console.warn('[WC Warning] WC_CONSUMER_KEY or WC_CONSUMER_SECRET is missing in .env.local');
  }

  const credentials = Buffer.from(`${key}:${secret}`).toString('base64');
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
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        ...wcAuthHeader(),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.warn(`[WC Error] ${endpoint} returned status ${res.status}: ${res.statusText}`, errorText);
      return null;
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.warn(`[WC Timeout] Request to ${endpoint} exceeded ${FETCH_TIMEOUT_MS}ms threshold.`);
    } else {
      console.warn(`[WC Exception] Fetch failed for ${endpoint}:`, error?.message || error);
    }
    return null;
  }
}

// ─── Variations ──────────────────────────────────────────────────────────────

export const getProductVariations = cache(async (productId: number) => {
  const data = await wcFetch<any[]>(`/products/${productId}/variations?per_page=100`, {
    next: { revalidate: 300 },
  });
  return data ?? [];
});

// ─── Products ────────────────────────────────────────────────────────────────

export const getProducts = cache(async (
  params: Record<string, string> = {}
): Promise<WCProduct[]> => {
  const query = new URLSearchParams({
    per_page: '24',
    status: 'publish',
    ...params,
  }).toString();

  const data = await wcFetch<WCProduct[]>(`/products?${query}`, {
    next: { revalidate: 300 },
  });

  return data ?? [];
});

export const getProductBySlug = cache(async (slug: string): Promise<WCProduct | null> => {
  const encodedSlug = encodeURIComponent(slug);
  const data = await wcFetch<WCProduct[]>(`/products?slug=${encodedSlug}`, {
    next: { revalidate: 300 },
  });

  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return data[0] ?? null;
});

export const getProductById = cache(async (id: number): Promise<WCProduct | null> => {
  return wcFetch<WCProduct>(`/products/${id}`, {
    next: { revalidate: 300 },
  });
});

// Fallback: If no featured products are marked in WordPress, return recent published products
export const getFeaturedProducts = cache(async (limit = 8): Promise<WCProduct[]> => {
  const featured = await getProducts({ featured: 'true', per_page: String(limit) });
  
  if (featured.length === 0) {
    console.warn('[WC Info] No products starred as "featured" in WordPress. Fetching standard products fallback.');
    return getProducts({ per_page: String(limit) });
  }

  return featured;
});

export const getRelatedProducts = cache(async (ids: number[]): Promise<WCProduct[]> => {
  if (!ids || !ids.length) return [];
  return getProducts({ include: ids.slice(0, 4).join(','), per_page: '4' });
});

// ─── Categories ──────────────────────────────────────────────────────────────

export const getCategories = cache(async (): Promise<WCProductCategory[]> => {
  const data = await wcFetch<WCProductCategory[]>(
    `/products/categories?per_page=50&hide_empty=true`,
    {
      next: { revalidate: 3600 },
    }
  );

  return data ?? [];
});

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