export function ProductCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-3 w-3/4" />
        <div className="skeleton h-5 w-20 mt-1" />
      </div>
    </div>
  );
}
