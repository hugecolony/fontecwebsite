import { Suspense } from 'react';



import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { FeatureBanner } from '@/components/home/FeatureBanner';
import { getProducts, getCategories } from '@/lib/woocommerce';
import StrechedBanner from '@/components/home/StrechedBanner';
import {FeatureHighlight} from '@/components/home/FeatureHighlight';
import {ScrollingPromotion} from '@/components/home/ScrollingPromotion';
import {VideoSlider} from '@/components/home/VideoSlider';
import {ImageSlider} from '@/components/home/ImageSlider';


// Never throw from the page — always fall back to empty arrays so the
// homepage renders with mock data even when WordPress is unreachable.
async function safeGetProducts() {
  try {
    return await getProducts({ per_page: '8', status: 'publish' });
  } catch {
    return [];
  }
}

async function safeGetCategories() {
  try {
    return await getCategories();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    safeGetProducts(),
    safeGetCategories(),
  ]);

  return (
    <>
 

 
      <Suspense fallback={null}>
        <CategoriesSection />
         <ScrollingPromotion/>
         
      </Suspense>
           <FeatureBanner />
      <Suspense fallback={null}>
        <FeatureHighlight/>
        <FeaturedProducts products={products} />
        <VideoSlider/>
        <ImageSlider></ImageSlider>
      </Suspense>
    </>
  );
}
