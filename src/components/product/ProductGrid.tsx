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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4 text-3xl">
          📦
        </div>
        <p className="text-foreground font-semibold text-lg mb-2">No products found</p>
        <p className="text-muted text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
