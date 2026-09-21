'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'General Support' }),
      });
      if (res.ok) setSubmitted(true);
      else alert('Failed to send message. Please try again.');
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Get in Touch
        </h1>
        <p className="text-muted text-base max-w-md mx-auto">
          Have a question about products, orders, or support? Send us a message and our team will respond promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Cards */}
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Call Support</h3>
              <p className="text-sm font-bold text-foreground mt-0.5">+92 (300) 000-0000</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Email Support</h3>
              <p className="text-sm font-bold text-foreground mt-0.5">support@yourdomain.com</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Office Location</h3>
              <p className="text-sm font-bold text-foreground mt-0.5">Islamabad / Peshawar, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="glass-card p-8 rounded-3xl text-center space-y-4 h-full flex flex-col items-center justify-center">
              <CheckCircle2 size={48} className="text-success" />
              <h2 className="text-2xl font-bold text-foreground">Message Sent Successfully</h2>
              <p className="text-muted text-sm max-w-sm">
                Thank you for reaching out. We have received your inquiry and will get back to you shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-primary mt-2 px-6 py-2.5 text-sm">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ali Khan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ali@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Subject <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your message here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}