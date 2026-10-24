import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] bg-ivory-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-5 p-8 rounded-3xl bg-ivory-50 border border-gold-500/30 shadow-royal">
        <span className="text-4xl text-gold-600 font-serif block select-none">⚜</span>
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-700">
          Page 404
        </span>
        <h1 className="font-serif text-3xl font-bold text-maroon-950">
          “This treasure seems to have wandered away.”
        </h1>
        <p className="text-xs text-charcoal-600 font-light leading-relaxed">
          The palace pathway or handcrafted product you are seeking may have been renamed or retired.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow"
          >
            Return to Palace Home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-xl bg-ivory-100 hover:bg-gold-50 border border-sand-dark text-xs font-semibold text-maroon-950"
          >
            Explore All Crochet
          </Link>
        </div>
      </div>
    </div>
  );
}
