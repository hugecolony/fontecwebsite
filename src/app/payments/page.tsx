import type { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Payment Methods | Fontec Mobiles',
  description: 'Modes of payment accepted at Fontec Mobiles: Cash on Delivery, Bank Transfer, and Cards.',
};

export default function PaymentsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Payment Methods</span>
      </nav>

      <div className="mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <CreditCard size={22} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">Secure Payments</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Modes of Payment
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Choose from multiple safe and convenient payment methods at checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <Banknote className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-slate-900 text-lg mb-2">Cash on Delivery (COD)</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Pay in cash to the rider upon receiving your package at your doorstep. Available across all cities and towns in Pakistan.
            </p>
          </div>
          <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit">
            ✓ Available Nationwide
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <CreditCard className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-slate-900 text-lg mb-2">Bank Transfer & Online Wallet</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Direct Bank Transfer (IBFT), EasyPaisa, or JazzCash payments. Account details provided on order completion.
            </p>
          </div>
          <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit">
            ✓ Instant Verification
          </span>
        </div>
      </div>

      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            Payment Security Guarantee
          </h3>
          <p className="text-xs text-slate-600">
            All transaction metadata and sensitive customer details are encrypted. Fontec Mobiles never stores credit card credentials on local servers.
          </p>
        </section>
      </div>
    </main>
  );
}
