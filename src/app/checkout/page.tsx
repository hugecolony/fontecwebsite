import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order — Cash on Delivery available.',
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}
