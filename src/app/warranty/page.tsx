import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Clock, FileCheck, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Warranty Policy | Fontec Mobiles',
  description: 'Learn about our comprehensive product warranty policy and warranty claim procedure.',
};

export default function WarrantyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Warranty Policy</span>
      </nav>

      {/* Page Header */}
      <div className="mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">Customer Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Warranty Policy
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          At Fontec Mobiles, every product comes with genuine brand warranty and quality assurance.
        </p>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <Clock className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">Official Warranty</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Up to 1-Year official manufacturer warranty on eligible chargers, cables, and power banks.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <FileCheck className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">Easy Claims</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hassle-free online complaint registration with fast turnaround times across Pakistan.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <HelpCircle className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">Dedicated Support</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our support team is available Mon-Sat via WhatsApp and Email to assist with technical queries.
          </p>
        </div>
      </div>

      {/* Policy Details */}
      <div className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. Coverage Overview</h2>
          <p>
            Fontec Mobiles guarantees that products purchased from our official web store are free from manufacturing defects in materials and workmanship under normal consumer use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. What Is Covered</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Internal circuit board failures and power delivery malfunctions.</li>
            <li>Defective charging ports, power buttons, or battery cell degradation exceeding standard thresholds.</li>
            <li>Connectivity issues on bluetooth audio accessories under normal operation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. What Is Not Covered</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Physical damage, drops, cracks, or water/liquid immersion.</li>
            <li>Unauthorized repairs, modifications, or tampering.</li>
            <li>Standard wear and tear from extended use.</li>
          </ul>
        </section>

        <section className="pt-6 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Need to File a Claim?</h2>
          <p className="mb-4">
            If your product has encountered a defect covered under warranty, register a complaint online or contact our customer support team.
          </p>
          <div className="flex gap-4">
            <Link
              href="/complaint"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition"
            >
              Register Claim
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
