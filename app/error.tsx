'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[75vh] bg-ivory-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-5 p-8 rounded-3xl bg-ivory-50 border border-gold-500/30 shadow-royal">
        <span className="text-4xl text-maroon-800 font-serif block select-none">⚜</span>
        <h1 className="font-serif text-3xl font-bold text-maroon-950">
          “Something went wrong behind the scenes.”
        </h1>
        <p className="text-xs text-charcoal-600 font-light leading-relaxed">
          Our palace servers encountered an unexpected hiccup. Please try refreshing or return to the marketplace.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-ivory-100 hover:bg-gold-50 border border-sand-dark text-xs font-semibold text-maroon-950"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
