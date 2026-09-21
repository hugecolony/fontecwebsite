'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  MapPin,
  Banknote,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  ShoppingBag,
  Home,
  Truck,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { WCOrder } from '@/types/order';

export function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<WCOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('Order not found.');
      setLoading(false);
      return;
    }
    fetch(`/api/orders?id=${orderId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setOrder(data))
      .catch(() => setError('Could not load order details.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCopyOrderNumber = () => {
    if (order?.number) {
      navigator.clipboard.writeText(`#${order.number}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-accent" />
        <p className="text-sm text-muted animate-pulse">Loading your order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h1>
        <p className="text-muted text-sm mb-8">{error || 'We could not retrieve details for this order.'}</p>
        <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag size={16} />
          Browse Shop
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.date_created).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      
      {/* ── Top Success Banner ── */}
      <div className="text-center mb-10 relative">
        <div className="absolute inset-0 -top-10 bg-gradient-to-b from-success/10 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-success/15 border border-success/30 shadow-lg shadow-success/10 mb-5 relative">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        
        <span className="inline-block px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold uppercase tracking-wider mb-3">
          Order Verified Successfully
        </span>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Thank you for your order!
        </h1>
        
        <p className="text-muted text-base max-w-md mx-auto">
          We’ve received your request, <span className="text-foreground font-semibold">{order.billing.first_name}</span>, and our team is preparing it for dispatch.
        </p>
      </div>

      {/* ── Order Meta Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between border-white/10 bg-white/[0.02]">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Order Reference</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-foreground text-lg">#{order.number}</span>
            <button
              onClick={handleCopyOrderNumber}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted hover:text-foreground transition-colors"
              title="Copy Order Number"
            >
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between border-white/10 bg-white/[0.02]">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Date Placed</span>
          <div className="flex items-center gap-2 mt-2">
            <Clock size={16} className="text-accent" />
            <span className="font-semibold text-foreground text-sm">{orderDate}</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between border-white/10 bg-white/[0.02]">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Total Due</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-extrabold text-foreground text-xl text-accent">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Live Timeline Tracker ── */}
      <div className="glass-card p-6 rounded-2xl mb-6 border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Truck size={16} className="text-accent" />
            Live Order Status
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-medium">
            Processing
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="relative pb-4 border-b-2 border-accent">
            <div className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center mx-auto mb-1.5 shadow-md shadow-accent/20">1</div>
            <p className="text-xs font-semibold text-foreground">Order Placed</p>
          </div>
          <div className="relative pb-4 border-b-2 border-white/10 opacity-60">
            <div className="w-6 h-6 rounded-full bg-white/10 text-muted text-xs font-bold flex items-center justify-center mx-auto mb-1.5">2</div>
            <p className="text-xs font-medium text-muted">Courier Dispatch</p>
          </div>
          <div className="relative pb-4 border-b-2 border-white/10 opacity-60">
            <div className="w-6 h-6 rounded-full bg-white/10 text-muted text-xs font-bold flex items-center justify-center mx-auto mb-1.5">3</div>
            <p className="text-xs font-medium text-muted">Delivered</p>
          </div>
        </div>
      </div>

      {/* ── Cash on Delivery Notice Card ── */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-success/10 border border-success/30 mb-6 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Banknote size={20} className="text-success" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-foreground text-sm mb-1">Cash on Delivery (COD) Verified</h4>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Please keep exact cash of <strong className="text-foreground">{formatPrice(order.total)}</strong> ready. Our courier partner will collect payment securely upon delivery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* ── Ordered Items Card ── */}
        <div className="glass-card p-6 rounded-2xl border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-accent" />
              <h2 className="font-bold text-foreground text-sm uppercase tracking-wider">Items Ordered</h2>
            </div>
            <ul className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
              {order.line_items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {item.sku && `SKU: ${item.sku} · `}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground flex-shrink-0">
                    {formatPrice(item.total)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-muted">Total Amount</span>
            <span className="text-foreground text-lg font-bold">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* ── Delivery Address Card ── */}
        <div className="glass-card p-6 rounded-2xl border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-accent" />
              <h2 className="font-bold text-foreground text-sm uppercase tracking-wider">Delivery Destination</h2>
            </div>
            <address className="not-italic text-sm text-muted leading-relaxed space-y-1">
              <p className="text-foreground font-semibold text-base">
                {order.billing.first_name} {order.billing.last_name}
              </p>
              <p>{order.billing.address_1}</p>
              {order.billing.address_2 && <p>{order.billing.address_2}</p>}
              <p>
                {order.billing.city}, {order.billing.state} {order.billing.postcode}
              </p>
              <p className="text-foreground/80 font-medium pt-1">🇵🇰 Pakistan</p>
              <div className="pt-2 border-t border-white/5 space-y-0.5 text-xs">
                <p>📞 {order.billing.phone}</p>
                <p>✉️ {order.billing.email}</p>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* ── Security Trust Footer ── */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted mb-8">
        <ShieldCheck size={16} className="text-success" />
        Encrypted & secured order transmission via WooCommerce API
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/shop" className="btn-primary flex-1 justify-center py-3.5 text-base shadow-lg">
          <ShoppingBag size={18} />
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
        <Link href="/" className="btn-ghost flex-1 justify-center py-3.5 text-base border border-white/10 hover:bg-white/5">
          <Home size={18} />
          Back to Home
        </Link>
      </div>

    </div>
  );
}