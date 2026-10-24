'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react';

export default function CartPage() {
  return (
    <div className="min-h-[70vh] bg-ivory-100 py-20 px-4 max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-gold-100 border border-gold-400/50 flex items-center justify-center text-gold-700 shadow-royal">
        <Sparkles className="w-10 h-10 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-gold-700">
          Atelier Portfolio Showcase
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
          Handcrafted Bespoke Commissions
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto font-light leading-relaxed">
          Knot & Bloom operates as an exclusive handcrafted crochet atelier. Instead of mass-manufactured cart checkout, each creation is hooked individually to order.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/60 max-w-md w-full space-y-3 text-xs text-charcoal-700">
        <p className="font-semibold text-maroon-950 text-sm font-serif">
          How to Commission a Piece:
        </p>
        <p>1. Browse our portfolio creations.</p>
        <p>2. Direct contact: <strong>📞 9080236848</strong> | <strong>✉ suresh140105@gmail.com</strong></p>
        <p>3. Our master artisans hand-hook your bespoke piece with pure natural cotton.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-md justify-center">
        <Link
          href="/shop"
          className="flex-1 py-3.5 px-6 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center justify-center gap-2"
        >
          <span>Explore Portfolio Creations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="https://wa.me/919080236848?text=Hello%20Knot%20%26%20Bloom,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20handcrafted%20crochet%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-ivory-100 text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Inquire on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
