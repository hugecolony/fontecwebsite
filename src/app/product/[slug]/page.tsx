import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, getProductVariations } from '@/lib/woocommerce';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: product.name,
    description: product.short_description?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
    openGraph: {
      images: product.images?.[0] ? [{ url: product.images[0].src }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  
  if (!product) notFound();

  // Fetch variations and related products in parallel
  const [variations, related] = await Promise.all([
    product.type === 'variable' ? getProductVariations(product.id).catch(() => []) : Promise.resolve([]),
    product.related_ids && product.related_ids.length > 0
      ? getRelatedProducts(product.related_ids).catch(() => [])
      : Promise.resolve([]),
  ]);

  return (
    <div className="max-w-screen-auto mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductDetailClient product={product} variations={variations} />

      {related.length > 0 && (
        <section className="mt-20 pt-12 border-t border-slate-200">
          <div className="mb-8">
            <p className="text-xs text-indigo-600 uppercase tracking-widest font-semibold mb-2">
              You Might Also Like
            </p>
            <h2 className="text-2xl font-bold text-slate-900">Related Products</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}