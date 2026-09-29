// app/product/[slug]/loading.tsx
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-square bg-slate-200 rounded-3xl" />
                <div className="space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-3/4" />
                    <div className="h-6 bg-slate-200 rounded w-1/4" />
                    <div className="h-24 bg-slate-200 rounded w-full" />
                </div>
            </div>
        </div>
    );
}