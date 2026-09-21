import { Suspense } from 'react';
import { ShopClientPage } from '@/components/shop/ShopClientPage';
import { getProducts, getCategories } from '@/lib/woocommerce';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our full range of premium mobile accessories.',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const wcParams: Record<string, string> = {
    per_page: '50', // Fetch more products so client-side switching feels instant
    status: 'publish',
  };

  if (params.search) wcParams.search = params.search;
  
  // If a category slug is provided, we can fetch its numeric ID or handle it client-side.
  // Assuming getCategories() returns categories with ids, slugs, etc.
  const categories = await getCategories().catch(() => []);

  if (params.category && params.category !== 'all') {
    const matchedCat = categories.find((c: any) => c.slug === params.category);
    if (matchedCat) {
      wcParams.category = String(matchedCat.id);
    }
  }

  if (params.sort) {
    const sortMap: Record<string, { orderby: string; order: string }> = {
      price_asc: { orderby: 'price', order: 'asc' },
      price_desc: { orderby: 'price', order: 'desc' },
      newest: { orderby: 'date', order: 'desc' },
      popular: { orderby: 'popularity', order: 'desc' },
      rating: { orderby: 'rating', order: 'desc' },
    };
    const s = sortMap[params.sort];
    if (s) {
      wcParams.orderby = s.orderby;
      wcParams.order = s.order;
    }
  }

  const products = await getProducts(wcParams).catch(() => []);

  return (
    <Suspense fallback={null}>
      <ShopClientPage
        initialProducts={products}
        categories={categories}
        currentCategory={params.category || 'all'}
        currentSearch={params.search}
        currentSort={params.sort}
      />
    </Suspense>
  );
}