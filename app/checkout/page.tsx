'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="min-h-[70vh] bg-ivory-100 py-20 px-4 max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-gold-100 border border-gold-400/50 flex items-center justify-center text-gold-700 shadow-royal">
        <Sparkles className="w-10 h-10 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-gold-700">
          Knot & Bloom Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
          Bespoke Direct Commission Atelier
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto font-light leading-relaxed">
          We craft our crochet treasures exclusively to order. To commission a piece or request custom colors and monograms, please reach out directly to our master artisan guild.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-ivory-50 border border-sand-dark/60 max-w-md w-full space-y-1.5 text-xs text-charcoal-700">
        <p className="font-semibold text-maroon-950 text-sm font-serif">Direct Atelier Contact:</p>
        <p className="font-semibold text-gold-800">📞 Phone / WhatsApp: +91 9080236848</p>
        <p className="text-charcoal-600">✉ Email: suresh140105@gmail.com</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-md justify-center">
        <Link
          href="/shop"
          className="flex-1 py-3.5 px-6 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center justify-center gap-2"
        >
          <span>Browse Creations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="https://wa.me/919080236848?text=Hello%20Knot%20%26%20Bloom,%20I%20would%20like%20to%20commission%20a%20handcrafted%20crochet%20creation."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-ivory-100 text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
