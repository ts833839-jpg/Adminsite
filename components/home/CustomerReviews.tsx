'use client';

import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export function CustomerReviews() {
  const reviews = [
    {
      name: 'Ananya D.',
      city: 'Bespoke Patron',
      product: 'Amethyst & Lilac Grape Duo Crochet Keychain',
      rating: 5,
      review:
        'The detailing on this grape duo keychain is mesmerizing! You can feel the patience in every single bobble stitch. The antique ring doesn’t tarnish, and it came packed in a regal box.',
      avatar: '/avatars/priya.svg',
    },
    {
      name: 'Vikramaditya R.',
      city: 'Artisan Collector',
      product: 'Artisan Teal & Mint Crochet Crossbody Festival Bag',
      rating: 5,
      review:
        'I gifted this to my sister for her celebration. The hand-crocheted floral rosette and leaf-chain strap make it look like a treasured heirloom. Truly exquisite work.',
      avatar: '/avatars/admin.svg',
    },
    {
      name: 'Radhika M.',
      city: 'Custom Client',
      product: 'Moonlit Ivory & Saffron Blossom Crochet Rose Keepsake',
      rating: 5,
      review:
        'Real flowers wither in 3 days, but these hand-crocheted roses grace my bedside table forever. The texture of the petals is heavenly. Knot & Bloom is now my go-to for bespoke pieces.',
      avatar: '/avatars/priya.svg',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-700">
          Client Keepsakes
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-950">
          Loved by Connoisseurs
        </h2>
        <p className="text-sm text-charcoal-600 font-light">
          Real words from patrons who cherish our handcrafted crochet treasures worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm hover:shadow-royal-lg hover:border-gold-400 transition-all duration-300 relative flex flex-col justify-between"
          >
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 text-gold-500 mb-4">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-gold-500" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed italic mb-6">
                “{r.review}”
              </p>
            </div>

            {/* Author */}
            <div className="pt-4 border-t border-sand-dark/40 flex items-center justify-between">
              <div>
                <p className="font-serif text-sm font-bold text-maroon-950">{r.name}</p>
                <p className="text-[11px] text-charcoal-500">{r.city} • Verified Patron</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
