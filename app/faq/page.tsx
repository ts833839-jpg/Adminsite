'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are all Knot & Bloom creations genuinely handcrafted by master artisans?',
      a: 'Yes, 100%. Every single piece at Knot & Bloom is patiently hand-hooked by devoted artisan hands. We do not use industrial knitting machines or mass-manufactured shortcuts. Each piece reflects hours of dedicated human artistry.',
    },
    {
      q: 'What kind of yarn and materials do you use for your crochet creations?',
      a: 'We use premium combed cotton, mercerized pure cotton yarns, and authentic specialty threads. Our items are colorfast, gentle on sensitive skin, and hand-finished with meticulous attention to detail. All internal fillings used in our plushies are Grade-A hygienic fiber.',
    },
    {
      q: 'How should I care for and wash my crochet pieces?',
      a: 'For smaller accessories and keychains, spot clean with a damp cloth and mild soap. For wear (shrugs, tops) and home textiles, handwash gently in cold water with mild shampoo or wool wash. Squeeze excess water without twisting, and lay flat on a dry towel in the shade to dry. Never machine tumble dry.',
    },
    {
      q: 'Do you offer custom commissions or bulk orders for special occasions?',
      a: 'Yes! We specialize in bespoke creations, event favors, and personalized crochet pieces. Please reach out directly to us on WhatsApp (+91 9080236848) or email suresh140105@gmail.com with your ideas and requirements for custom quotes.',
    },
    {
      q: 'How long does custom crafting and courier delivery take?',
      a: 'Ready handcrafted creations dispatch within 24–48 hours. Bespoke and custom-colored creations are lovingly hand-hooked within 3–7 business days, followed by priority express courier delivery with tracking updates provided directly to your phone.',
    },
    {
      q: 'Can I request custom colors or personalized sizing?',
      a: 'Absolutely! Because every piece is hand-hooked, we welcome custom color palette requests, customized charms, or specific sizing. Simply message us on WhatsApp (+91 9080236848) before or after placing your request.',
    },
    {
      q: 'How does your packaging arrive?',
      a: 'Every Knot & Bloom creation arrives in our signature atelier packaging, lined with protective tissue and adorned with a hand-tied ribbon, ready for personal keeping or gifting.',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold text-gold-700">
          <HelpCircle className="w-3.5 h-3.5 text-gold-600" />
          <span>Knowledge & Clarity</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-charcoal-600 font-light leading-relaxed">
          Everything you wish to know about our yarn sourcing, bespoke commissions, care rituals, and courier timelines.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-ivory-50 border-gold-400 shadow-royal'
                  : 'bg-ivory-50/70 border-sand-dark/50 hover:border-gold-300'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-serif text-base sm:text-lg font-bold text-maroon-950">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gold-600 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light border-t border-sand-dark/30 pt-3">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Concierge Banner */}
      <div className="mt-14 p-8 rounded-3xl bg-maroon-950 text-ivory-100 border border-gold-500/30 text-center space-y-4">
        <span className="text-2xl text-gold-400 font-serif">⚜</span>
        <h3 className="font-serif text-2xl font-bold text-ivory-50">
          Have an Unanswered Question?
        </h3>
        <p className="text-xs sm:text-sm text-ivory-300 max-w-md mx-auto font-light">
          Our atelier team is always delighted to assist with custom inquiries, colors, and bespoke commissions via WhatsApp (+91 9080236848) or email (suresh140105@gmail.com).
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow"
        >
          <span>Connect with Concierge</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
