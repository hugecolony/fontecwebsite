import Link from 'next/link';
import Image from 'next/image';

const WP_BASE_URL = 'https://fontecmobiles.com';

export async function generateMetadata() {
  return {
    title: 'All Categories | Fontec',
    description: 'Browse all product categories available in our store.',
  };
}

export default async function AllCategoriesPage() {
  let categories: any[] = [];

  try {
    const res = await fetch(
      `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories?parent=0&per_page=100`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      categories = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900">All Categories</h1>
        <p className="text-sm text-slate-500 mt-1">Explore all available product categories</p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((cat: any) => {
            const imageUrl =
              typeof cat.image === 'string'
                ? cat.image
                : cat.image?.src || cat.images?.[0]?.src || null;

            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group block rounded-2xl p-4 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-square relative bg-slate-100 rounded-xl overflow-hidden mb-3">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-center truncate">
                  {cat.name}
                </h2>
                {cat.count !== undefined && (
                  <p className="text-xs text-slate-500 text-center mt-0.5">
                    {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500">No categories found.</div>
      )}
    </main>
  );
}