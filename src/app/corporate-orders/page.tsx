'use client';

import { useState } from 'react';
import { Building2, Send, Loader2, CheckCircle2, Phone, Mail, User } from 'lucide-react';

export default function CorporateOrdersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    volume: '50-200 units',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'Corporate Order Inquiry' }),
      });
      if (res.ok) setSubmitted(true);
      else alert('Failed to submit inquiry. Please try again.');
    } catch {
      alert('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
          B2B & Bulk Solutions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Corporate Orders
        </h1>
        <p className="text-muted text-base max-w-lg mx-auto">
          Looking for wholesale pricing, institutional supplies, or custom corporate gifting packages? Get in touch with our commercial sales desk.
        </p>
      </div>

      {submitted ? (
        <div className="glass-card p-8 rounded-3xl text-center space-y-4">
          <CheckCircle2 size={48} className="text-success mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Inquiry Received</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Thank you, <strong className="text-foreground">{form.name}</strong>. Our corporate account manager will review your volume requirements and contact you within 24 business hours.
            </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary mt-4 px-6 py-2.5 text-sm"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Full Name <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  required
                  placeholder="Muhammad Ali"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Company / Organization Name <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  required
                  placeholder="Enterprise Pvt Ltd"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Corporate Email <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Mobile / Office Phone <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="tel"
                  required
                  placeholder="03001234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Estimated Order Volume
            </label>
            <select
              value={form.volume}
              onChange={(e) => setForm({ ...form, volume: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
            >
              <option value="50-200 units" className="bg-surface">50 - 200 units</option>
              <option value="200-500 units" className="bg-surface">200 - 500 units</option>
              <option value="500+ units" className="bg-surface">500+ units (Large Enterprise)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Project Requirements / Specifications
            </label>
            <textarea
              rows={4}
              placeholder="Provide details about products, customized branding, delivery timelines..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Corporate Inquiry
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}