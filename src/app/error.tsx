'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-danger/5 blur-[100px] pointer-events-none" />
      <p className="text-6xl mb-4">⚡</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
        Something went wrong
      </h1>
      <p className="text-muted max-w-sm mb-8 text-sm leading-relaxed">
        {error.message?.includes('fetch')
          ? 'Could not connect to the store backend. Make sure Local WP is running.'
          : error.message || 'An unexpected error occurred.'}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button onClick={reset} className="btn-primary">
          <RefreshCcw size={16} />
          Try Again
        </button>
        <Link href="/" className="btn-ghost">
          Go Home
        </Link>
      </div>
    </div>
  );
}
