import type { Metadata } from 'next';
import Link from 'next/link';
import { RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Exchange & Refund Policy | Fontec Mobiles',
  description: 'Our 7-day hassle-free return, exchange, and refund policy details.',
};

export default function ReturnsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Returns & Refunds</span>
      </nav>

      <div className="mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <RotateCcw size={22} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">Satisfaction Guaranteed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Exchange & Refund Policy
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          We want you to be completely satisfied with your purchase. Read our 7-day return guidelines below.
        </p>
      </div>

      <div className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            7-Day Return & Exchange Window
          </h2>
          <p>
            You may request a return or exchange within 7 days of receiving your order if the item is unused, in its original packaging, and accompanied by proof of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Conditions for Eligibility
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Item must be unopened with unbroken seal (unless received damaged or defective).</li>
            <li>All included cables, manuals, and accessories must be present in original condition.</li>
            <li>Damaged in transit claims must be reported within 24 hours of delivery with photos/video evidence.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Refund Processing</h2>
          <p>
            Once your returned item is received and inspected, refunds are processed within 3-5 working days via Bank Transfer, EasyPaisa, JazzCash, or store credit.
          </p>
        </section>

        <section className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Have a return request?</h3>
            <p className="text-xs text-slate-500">Contact customer support to get your return shipping label.</p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition shrink-0"
          >
            Initiate Return
          </Link>
        </section>
      </div>
    </main>
  );
}
