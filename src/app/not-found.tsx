import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {/* Decorative orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <p className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400 mb-4">
        404
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
        Page Not Found
      </h1>
      <p className="text-muted max-w-md mb-10 leading-relaxed">
        Looks like this page went out of stock. Let&apos;s get you back to the good stuff.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/" className="btn-primary">
          Go Home
          <ArrowRight size={16} />
        </Link>
        <Link href="/shop" className="btn-ghost">
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
