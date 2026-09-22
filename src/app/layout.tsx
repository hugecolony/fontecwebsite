import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/providers/CartProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Topbar } from '@/components/layout/Topbar';
import ConfettiPopper from '@/components/layout/ConfettiPopper'
import { Suspense } from 'react';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Fontec — Premium Mobile Accessories',
    template: '%s | Fontec',
  },
  description:
    'Shop premium mobile accessories — cases, chargers, cables, earbuds and more. Fast delivery, Cash on Delivery available.',
  keywords: ['mobile accessories', 'phone cases', 'chargers', 'earbuds', 'cables'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Fontec',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <CartProvider>
          <Suspense>
            <ConfettiPopper/>
            <Topbar />
            <Header />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
            </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
