import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

const WP_BASE_URL = 'https://fontec.local';

interface ProductPrice {
  price: string;
  currency_symbol: string;
  regular_price?: string;
}

interface ProductImage {
  src: string;
  alt: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  prices: ProductPrice;
  images: ProductImage[];
  [key: string]: any;
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

/**
 * Fetch and normalize products strictly for the matching category slug
 */
async function getCategoryProducts(categorySlug: string): Promise<Product[]> {
  try {
    // 1. Fetch category list to locate exact matching slug
    const catRes = await fetch(
      `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?per_page=100`,
      { cache: 'no-store' }
    );

    if (!catRes.ok) return [];
    const categories: Array<{ id: number; slug: string }> = await catRes.json();

    // Find the exact category matching the slug parameter
    const matchedCategory = categories.find((cat) => cat.slug === categorySlug);
    if (!matchedCategory) return [];

    // 2. Fetch products matching only this category ID
    const res = await fetch(
      `${WP_BASE_URL}/wp-json/wc/store/v1/products?category=${matchedCategory.id}&per_page=24`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const products = await res.json();

    // Normalize prices and fields so ProductCard reads them accurately
    return products.map((product: any) => ({
      ...product,
      price: product.prices?.price || product.price || '0',
      regular_price: product.prices?.regular_price || product.regular_price || '0',
      stock_status: product.is_in_stock ? 'instock' : product.stock_status || 'instock',
    }));
  } catch (error) {
    console.error(`Failed to fetch products for category "${categorySlug}":`, error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const products = await getCategoryProducts(category);

  // Format category slug into human-readable title
  const formattedTitle = category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Category Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Category
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5">
              {formattedTitle}
            </h1>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline underline-offset-4"
          >
            &larr; View All Categories
          </Link>
        </div>

        {/* Product Grid using ProductCard component */}
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
      </div>
    </div>
  );
}