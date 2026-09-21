'use client';

import { useState } from 'react';
import { Search, Loader2, PackageCheck, Clock, MapPin, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { WCOrder } from '@/types/order';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<WCOrder | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?id=${query.trim()}`);
      if (!res.ok) {
        throw new Error('Order not found. Please check your order ID.');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not find order matching this reference.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Track Your Order
        </h1>
        <p className="text-muted text-base">
          Enter your WooCommerce Order ID below to inspect live processing and dispatch updates.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            required
            placeholder="Enter Order ID (e.g. 1045)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-accent"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary px-6">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Track'}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 rounded-2xl border-danger/30 bg-danger/10 text-danger flex items-center gap-3 text-sm">
          <AlertCircle size={20} className="shrink-0" />
          {error}
        </div>
      )}

      {order && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-muted uppercase tracking-wider font-semibold">Order ID</span>
              <p className="text-lg font-bold text-foreground">#{order.number}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold capitalize">
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted flex items-center gap-1">
                <Clock size={14} /> Date Placed
              </span>
              <p className="font-semibold text-foreground">
                {new Date(order.date_created).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted flex items-center gap-1">
                <PackageCheck size={14} /> Total Amount
              </span>
              <p className="font-semibold text-accent">{formatPrice(order.total)}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
              <MapPin size={14} /> Delivery Recipient
            </h4>
            <p className="text-sm font-medium text-foreground">
              {order.billing.first_name} {order.billing.last_name}
            </p>
            <p className="text-xs text-muted">
              {order.billing.address_1}, {order.billing.city} ({order.billing.state})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}