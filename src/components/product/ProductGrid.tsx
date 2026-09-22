import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { WCProduct } from '@/types/product';

interface ProductGridProps {
  products: WCProduct[];
  loading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-10 sm:pt-16 gap-x-3 sm:gap-x-6 gap-y-12 sm:gap-y-20 w-full">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-3xl shadow-sm">
          📦
        </div>
        <p className="text-slate-900 font-semibold text-lg mb-2">No products found</p>
        <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-10 sm:pt-16 gap-x-3 sm:gap-x-6 gap-y-12 sm:gap-y-20 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}