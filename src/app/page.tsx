import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { FeatureBanner } from '@/components/home/FeatureBanner';
import { getProducts, getCategories } from '@/lib/woocommerce';
import StrechedBanner from '@/components/home/StrechedBanner';
import { FeatureHighlight } from '@/components/home/FeatureHighlight';
import { ScrollingPromotion } from '@/components/home/ScrollingPromotion';

const VideoSlider = dynamic(() => import('@/components/home/VideoSlider').then((mod) => mod.VideoSlider), {
  ssr: true,
});

const ImageSlider = dynamic(() => import('@/components/home/ImageSlider').then((mod) => mod.ImageSlider), {
  ssr: true,
});

import type { WCProduct, WCProductCategory } from '@/types/product';

async function AsyncCategoriesSection() {
  let categories: WCProductCategory[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }
  return <CategoriesSection categories={categories} />;
}

async function AsyncFeaturedProductsSection() {
  let products: WCProduct[] = [];
  try {
    products = await getProducts({ per_page: '8', status: 'publish' });
  } catch {
    products = [];
  }
  return <FeaturedProducts products={products} />;
}

function CategoriesSkeletonLoader() {
  return (
    <div className="mt-16 px-4 md:px-8 max-w-screen-h mx-auto">
      <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md mb-6" />
      <div className="flex gap-6 overflow-x-hidden pb-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-[300px] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] h-56 rounded-3xl bg-slate-100 animate-pulse border border-slate-200/60 shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedProductsSkeletonLoader() {
  return (
    <div className="py-16 w-full px-4 sm:px-6 lg:px-8 max-w-screen mx-auto">
      <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-md mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-72 rounded-3xl bg-slate-100 animate-pulse border border-slate-200/60" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <Suspense fallback={<CategoriesSkeletonLoader />}>
        <AsyncCategoriesSection />
      </Suspense>
      
      <FeatureBanner />
      <VideoSlider />
      <FeatureHighlight />
      
      <Suspense fallback={<FeaturedProductsSkeletonLoader />}>
        <AsyncFeaturedProductsSection />
      </Suspense>
      
      <ImageSlider />
    </>
  );
}