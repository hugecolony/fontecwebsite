import { Suspense } from 'react';
import type { Metadata } from 'next';
import { OrderConfirmationClient } from '@/components/checkout/OrderConfirmationClient';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been placed successfully.',
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    }>
      <OrderConfirmationClient />
    </Suspense>
  );
}
