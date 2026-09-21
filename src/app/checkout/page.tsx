import type { Metadata } from 'next';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order — Cash on Delivery available.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
