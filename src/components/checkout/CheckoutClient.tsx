'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  Banknote,
  MapPin,
  User,
  Phone,
  Mail,
  Loader2,
  Lock,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, cn } from '@/lib/utils';
import type { BillingAddress } from '@/types/order';

// --- Pakistan Provinces / Territories ---
const PROVINCES = [
  { code: 'PB', name: 'Punjab' },
  { code: 'SD', name: 'Sindh' },
  { code: 'KP', name: 'Khyber Pakhtunkhwa' },
  { code: 'BA', name: 'Balochistan' },
  { code: 'ICT', name: 'Islamabad Capital Territory' },
  { code: 'AJK', name: 'Azad Jammu & Kashmir' },
  { code: 'GB', name: 'Gilgit-Baltistan' },
];

const EMPTY_BILLING: BillingAddress = {
  first_name: '',
  last_name: '',
  address_1: '',
  address_2: '',
  city: '',
  state: 'PB',
  postcode: '',
  country: 'PK',
  email: '',
  phone: '',
};

type FormErrors = Partial<Record<keyof BillingAddress, string>>;

function validateForm(billing: BillingAddress): FormErrors {
  const errors: FormErrors = {};
  if (!billing.first_name.trim()) errors.first_name = 'First name required';
  if (!billing.last_name.trim()) errors.last_name = 'Last name required';
  if (!billing.email.trim()) errors.email = 'Email required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email))
    errors.email = 'Invalid email address';
  
  if (!billing.phone.trim()) {
    errors.phone = 'Mobile number required';
  } else {
    // Strips spaces, hyphens, and plus signs to check exact format (e.g., 03339299503)
    const cleanPhone = billing.phone.replace(/[\s-+]/g, '');
    if (!/^03\d{9}$/.test(cleanPhone)) {
      errors.phone = 'Format must be 11 digits starting with 03 (e.g. 03339299503)';
    }
  }

  if (!billing.address_1.trim()) errors.address_1 = 'Delivery address required';
  if (!billing.city.trim()) errors.city = 'City required';
  if (!billing.state.trim()) errors.state = 'Province required';
  return errors;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: keyof BillingAddress;
  error?: string;
  icon?: React.ElementType;
}

function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  icon: Icon,
  ...props
}: InputFieldProps) {
  const fieldId = `field-${name}`;

  return (
    <div>
      <label 
        htmlFor={fieldId} 
        className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 cursor-pointer"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        )}
        <input
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-full bg-white/5 border rounded-xl py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
            Icon ? 'pl-10 pr-4' : 'px-4',
            error
              ? 'border-danger focus:ring-danger'
              : 'border-white/10 focus:border-accent focus:ring-accent'
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

export function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowMode = searchParams.get('mode') === 'buynow';

  const [hasMounted, setHasMounted] = useState(false);
  const { items: cartItems, itemCount, subtotal, clearCart, buyNowItem, clearBuyNow } = useCartStore();

  const [billing, setBilling] = useState<BillingAddress>(EMPTY_BILLING);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const items = isBuyNowMode && buyNowItem ? [buyNowItem] : cartItems;
  const count = isBuyNowMode && buyNowItem ? buyNowItem.quantity : (hasMounted ? itemCount() : 0);
  const total = isBuyNowMode && buyNowItem 
    ? parseFloat(buyNowItem.price) * buyNowItem.quantity 
    : (hasMounted ? subtotal() : 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setBilling((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof BillingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(billing);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        billing,
        shipping: billing,
        line_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        customer_note: note,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error ?? `Order creation failed (${res.status})`);
      }

      if (isBuyNowMode && clearBuyNow) {
        clearBuyNow();
      } else {
        clearCart();
      }

      router.push(`/order-confirmation?order=${data.id}&key=${data.order_key}`);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex justify-center items-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted mb-8">Explore products and add items to your basket.</p>
        <Link href="/shop" className="btn-primary">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={isSubmitting} className="contents">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* ── Left Side: Shipping & Contact ── */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Customer Info */}
              <div className="glass-card p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <User size={18} className="text-accent" />
                  <h2 className="font-semibold text-foreground">Contact Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="first_name"
                    placeholder="e.g. Ali"
                    autoComplete="given-name"
                    value={billing.first_name}
                    onChange={handleChange}
                    error={errors.first_name}
                    required
                  />
                  <InputField
                    label="Last Name"
                    name="last_name"
                    placeholder="e.g. Khan"
                    autoComplete="family-name"
                    value={billing.last_name}
                    onChange={handleChange}
                    error={errors.last_name}
                    required
                  />
                </div>
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="ali.khan@example.com"
                  autoComplete="email"
                  value={billing.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  icon={Mail}
                />
                <InputField
                  label="Mobile Number"
                  name="phone"
                  type="tel"
                  maxLength={11}
                  placeholder="03331234567"
                  autoComplete="tel"
                  value={billing.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                  icon={Phone}
                />
              </div>

              {/* Delivery Address */}
              <div className="glass-card p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-accent" />
                  <h2 className="font-semibold text-foreground">Delivery Address</h2>
                </div>

                <div>
                  <label htmlFor="country" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 cursor-pointer">
                    Country <span className="text-danger">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={billing.country}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  >
                    <option value="PK" className="bg-surface">Pakistan 🇵🇰</option>
                  </select>
                </div>

                <InputField
                  label="Street Address / House / Flat No."
                  name="address_1"
                  placeholder="House #123, Street 4, Sector F-8/2"
                  autoComplete="address-line1"
                  value={billing.address_1}
                  onChange={handleChange}
                  error={errors.address_1}
                  required
                />
                <InputField
                  label="Area / Landmark (Optional)"
                  name="address_2"
                  placeholder="Near Main Commercial Market"
                  autoComplete="address-line2"
                  value={billing.address_2}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 cursor-pointer">
                      Province / Territory <span className="text-danger">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={billing.state}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    >
                      {PROVINCES.map((prov) => (
                        <option key={prov.code} value={prov.code} className="bg-surface text-foreground">
                          {prov.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="City / Town"
                    name="city"
                    placeholder="e.g. Lahore, Mardan, Swabi..."
                    autoComplete="address-level2"
                    value={billing.city}
                    onChange={handleChange}
                    error={errors.city}
                    required
                    icon={Building2}
                  />
                </div>

                <InputField
                  label="Postal Code (Optional)"
                  name="postcode"
                  placeholder="e.g. 54000"
                  autoComplete="postal-code"
                  value={billing.postcode}
                  onChange={handleChange}
                />
              </div>

              {/* Cash on Delivery Payment Card */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote size={18} className="text-accent" />
                  <h2 className="font-semibold text-foreground">Payment Method</h2>
                </div>

                <div className="p-4 rounded-xl border border-success/30 bg-success/10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      Pay with cash directly to the courier agent when your parcel arrives at your doorstep anywhere in Pakistan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="glass-card p-6">
                <label 
                  htmlFor="customer-note" 
                  className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2 cursor-pointer"
                >
                  Order / Delivery Instructions (Optional)
                </label>
                <textarea
                  id="customer-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                  placeholder="e.g. Call before delivery, drop at reception..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* ── Right Side: Order Summary & Place Order ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                <div className="glass-card p-6">
                  <h2 className="font-semibold text-foreground mb-5">
                    Order Summary
                    <span className="text-sm text-muted font-normal ml-2">
                      ({count} {count === 1 ? 'item' : 'items'})
                    </span>
                  </h2>

                  <ul className="space-y-4 mb-6">
                    {items.map((item) => (
                      <li key={item.item_key} className="flex items-start gap-3">
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                          <Image
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-foreground flex-shrink-0">
                          {formatPrice(parseFloat(item.price) * item.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-white/8 pt-4 space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span className="text-foreground">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Delivery Charges</span>
                      <span className="text-success font-medium">Free Delivery</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Payment</span>
                      <span className="text-success font-medium">Cash on Delivery</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-white/8">
                      <span className="text-foreground">Total Amount</span>
                      <span className="text-foreground text-xl">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-base py-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <Banknote size={18} />
                      Place Order (Cash on Delivery)
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
                  <Lock size={12} />
                  Safe & Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}