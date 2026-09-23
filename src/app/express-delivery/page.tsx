import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Express Delivery | Fontec Mobiles',
  description: 'Same-day and express delivery service details for urgent mobile accessory orders.',
};

export default function ExpressDeliveryPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Express Delivery</span>
      </nav>

      <div className="mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Zap size={22} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Lightning Fast</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Express Delivery Service
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Need chargers or accessories urgently? Our express service gets your order delivered in record time.
        </p>
      </div>

      <div className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Same-Day & Next-Day Shipping
          </h2>
          <p className="text-slate-600 text-sm">
            For selected metropolitan regions, express dispatch ensures delivery within 24 hours of order placement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">How to Request Express Delivery</h2>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>Select <strong>Express Delivery</strong> at checkout if available for your city.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>Place your order before 1:00 PM for same-day dispatch.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>Contact customer support via WhatsApp for urgent manual courier dispatch.</span>
            </li>
          </ul>
        </section>

        <section className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition"
          >
            Shop Express Items
          </Link>
        </section>
      </div>
    </main>
  );
}
