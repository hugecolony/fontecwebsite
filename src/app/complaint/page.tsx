'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Send } from 'lucide-react';

export default function ComplaintPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    orderId: '',
    category: 'defective',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.description) return;
    setSubmitted(true);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Register a Complaint</span>
      </nav>

      <div className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">Customer Resolution</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Register a Complaint
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          We take product quality and customer satisfaction seriously. Fill out the form below to register an issue with our support team.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in my-8">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Complaint Registered Successfully</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            Your complaint ticket has been assigned to our senior resolution officer. We will contact you at <strong>{formData.phone}</strong> within 24 business hours.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition"
            >
              Submit Another Complaint
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0300 1234567"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Order ID (Optional)
              </label>
              <input
                type="text"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                placeholder="e.g. #12345"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-red-600 bg-white"
              >
                <option value="defective">Defective Product / Not Working</option>
                <option value="wrong_item">Received Wrong Item</option>
                <option value="damaged">Item Damaged in Transit</option>
                <option value="warranty">Warranty Claim</option>
                <option value="delay">Late Delivery / Courier Delay</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detailed Description of Issue <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please describe the issue in detail..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Send size={16} />
            Submit Complaint Ticket
          </button>
        </form>
      )}
    </main>
  );
}
