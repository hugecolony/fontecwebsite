import Image from 'next/image';
import { ShieldCheck, Truck, Users, Award } from 'lucide-react';

async function getWordPressPage() {
  try {
    const res = await process.env.NEXT_PUBLIC_WP_API_URL 
      ? await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/pages?slug=about-us`, { next: { revalidate: 3600 } })
      : null;
    if (!res || !res.ok) return null;
    const pages = await res.json();
    return pages[0] || null;
  } catch {
    return null;
  }
}

export default async function AboutUsPage() {
  const wpPage = await getWordPressPage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
          {wpPage ? wpPage.title.rendered : 'About Us'}
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto">
          Dedicated to delivering premium quality products with seamless service and reliable nationwide delivery across Pakistan.
        </p>
      </div>

      {wpPage ? (
        <div 
          className="prose prose-invert max-w-none mb-12 text-muted leading-relaxed"
          dangerouslySetInnerHTML={{ __html: wpPage.content.rendered }}
        />
      ) : (
        <div className="glass-card p-8 rounded-3xl mb-12 space-y-6 text-muted leading-relaxed">
          <p>
            We pride ourselves on offering exceptional products sourced carefully to match your lifestyle and everyday requirements. Built on reliability, transparent pricing, and robust customer support, our platform ensures a friction-free shopping experience from click to doorstep.
          </p>
          <p>
            Whether you are purchasing individual items or managing large-scale corporate requirements, our team is committed to complete satisfaction and rapid turnaround times.
          </p>
        </div>
      )}

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl text-center space-y-2">
          <Truck className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="font-bold text-foreground text-sm">Fast Shipping</h3>
          <p className="text-xs text-muted">Reliable courier delivery across Pakistan.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="font-bold text-foreground text-sm">Secure Shopping</h3>
          <p className="text-xs text-muted">Safe ordering with Cash on Delivery verified.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-2">
          <Users className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="font-bold text-foreground text-sm">Dedicated Support</h3>
          <p className="text-xs text-muted">Customer assistance ready to help you.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-2">
          <Award className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="font-bold text-foreground text-sm">Quality Guaranteed</h3>
          <p className="text-xs text-muted">Strict verification for every item stocked.</p>
        </div>
      </div>
    </div>
  );
}