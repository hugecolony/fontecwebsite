import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import type { Metadata } from 'next';

const WP_BASE_URL = 'https://fontecmobiles.com';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategories() {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?per_page=100`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

async function getProductsByCategory(categoryId: number) {
  const res = await fetch(
    `${WP_BASE_URL}/wp-json/wc/store/v1/products?category=${categoryId}&per_page=20`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch products');
  const products = await res.json();

  // Normalize WooCommerce Store API fields to match ProductCard expectations
  return products.map((product: any) => ({
    ...product,
    price: product.prices?.price || product.price || '0',
    regular_price: product.prices?.regular_price || product.regular_price || '0',
    sale_price: product.prices?.sale_price || product.sale_price || '0',
    // Ensure stock status fields match what ProductCard expects ('instock' or 'outofstock')
    stock_status: product.is_in_stock ? 'instock' : product.stock_status || 'instock',
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories().catch(() => []);
  const matchedCategory = categories.find((cat: any) => cat.slug === slug);

  if (!matchedCategory) return { title: 'Category Not Found' };

  return {
    title: `${matchedCategory.name} - Products`,
    description: `Browse our collection of ${matchedCategory.name} products.`,
  };
}

export default async function CategoryProductsPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // 1. Fetch categories to find the exact numeric ID matching this slug
  const categories = await getCategories().catch(() => []);
  const matchedCategory = categories.find((cat: any) => cat.slug === slug);

  if (!matchedCategory) {
    notFound();
  }

  const categoryName = matchedCategory.name;
  const catId = matchedCategory.id;

  // 2. Fetch and normalize products using the numeric category ID
  const products = await getProductsByCategory(catId).catch(() => []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to Categories
      </Link>

      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 capitalize">{categoryName}</h1>
        <p className="text-sm text-slate-500 mt-1">Showing products in {categoryName}</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-slate-500 text-base">No products found in this category.</p>
          <Link
            href="/categories"
            className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            Browse other categories
          </Link>
        </div>
      )}
    </main>
  );
}