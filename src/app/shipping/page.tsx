import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, MapPin, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Policy | Fontec Mobiles',
  description: 'Nationwide fast shipping policy, delivery timelines, and courier partners.',
};

export default function ShippingPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Shipping Policy</span>
      </nav>

      <div className="mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <Truck size={22} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">Nationwide Delivery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          We ship premium mobile accessories across Pakistan via reliable courier partners.
        </p>
      </div>

      <div className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Delivery Timelines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Major Cities</span>
              <span className="text-xs text-slate-600">Karachi, Lahore, Islamabad, Rawalpindi: <strong>2 - 3 Working Days</strong></span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Rest of Pakistan</span>
              <span className="text-xs text-slate-600">Other cities & rural regions: <strong>3 - 5 Working Days</strong></span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Order Confirmation & Dispatch</h2>
          <p>
            Orders placed before 4:00 PM (Mon-Sat) are processed and dispatched on the same day. Orders placed on Sundays or public holidays will be dispatched on the next working day.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Order Inspection & Open Parcel Policy
          </h2>
          <p>
            We strictly seal all packages to prevent transit damage. You are encouraged to inspect the outer packaging before signing courier delivery slips.
          </p>
        </section>

        <section className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Already placed an order?</h3>
            <p className="text-xs text-slate-500">Track your package location in real-time with your order number.</p>
          </div>
          <Link
            href="/track-order"
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition shrink-0"
          >
            Track Package
          </Link>
        </section>
      </div>
    </main>
  );
}
