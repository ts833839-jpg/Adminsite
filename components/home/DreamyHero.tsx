'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Heart } from 'lucide-react';

export function DreamyHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-maroon-950 via-maroon-900 to-maroon-950 text-ivory-100 min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 border-b border-gold-500/25">
      {/* Background Palace Geometric Texture */}
      <div className="absolute inset-0 bg-palace-pattern opacity-30 pointer-events-none" />

      {/* Ambient Gold Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-rose-deep/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-gold-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Gold Dust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold-300 opacity-60 animate-float"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 7 + 10) % 90}%`,
              left: `${(i * 13 + 5) % 95}%`,
              animationDuration: `${5 + (i % 5)}s`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Royal Arch Framing */}
      <div className="absolute inset-6 sm:inset-10 border border-gold-500/20 rounded-3xl pointer-events-none flex flex-col justify-between p-4 sm:p-6">
        <div className="flex justify-between text-gold-400/40 text-xs font-serif">
          <span>⚜ ARTISAN ATELIER ⚜</span>
          <span>ESTD. 2026</span>
        </div>
        <div className="flex justify-between text-gold-400/40 text-xs font-serif">
          <span>100% PURE YARN</span>
          <span>BESPOKE CROCHET</span>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10 space-y-8 py-8">
        {/* Editorial Sub-Plaque */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-maroon-900/80 border border-gold-500/40 shadow-royal backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-gold-200">
            KNOT & BLOOM • Luxury Handcrafted Crochet Portfolio & Atelier
          </span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ivory-50 leading-[1.1]">
            A World of <span className="gold-shimmer italic font-normal">Handcrafted Things.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ivory-300 font-light leading-relaxed">
            Discover our portfolio of handcrafted crochet wearable heirlooms, bespoke charms, and everlasting yarn blossoms — patient stitchwork crafted with devoted passion.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl btn-gold flex items-center justify-center gap-2.5 text-sm font-semibold shadow-gold-glow group"
          >
            <span>Explore Portfolio Creations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-maroon-900/60 hover:bg-maroon-900 text-gold-200 border border-gold-500/40 hover:border-gold-400 flex items-center justify-center gap-2 text-sm font-medium transition-all backdrop-blur-sm"
          >
            <Compass className="w-4 h-4 text-gold-400" />
            <span>Commission a Bespoke Piece</span>
          </Link>
        </div>

        {/* Floating Mini Product Highlights (Zero Prices) */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          {[
            { title: 'Amethyst Grape Duo', category: 'Keychains', note: 'Handcrafted', img: '/products/gallery/crocheted-grape-duo-keychain-3.png', slug: 'amethyst-lilac-grape-duo-crochet-keychain' },
            { title: 'Teal & Mint Sling', category: 'Bags', note: 'Handcrafted', img: '/products/gallery/teal-and-mint-crochet-wall-hanging-bag-7.png', slug: 'artisan-teal-mint-crochet-crossbody-festival-bag' },
            { title: 'Emerald Petal Mat', category: 'Home', note: 'Handcrafted', img: '/products/gallery/emerald-and-magenta-crochet-flower-mat.png', slug: 'emerald-magenta-layered-petal-crochet-flower-mat' },
            { title: 'Crimson Shawl', category: 'Wear', note: 'Handcrafted', img: '/products/gallery/crimson-crochet-shawl-with-braided-tie-3.png', slug: 'maharani-crimson-scalloped-crochet-shawl' },
          ].map((item, idx) => (
            <Link
              key={item.slug}
              href={`/product/${item.slug}`}
              className="p-2.5 rounded-xl bg-charcoal-900/70 border border-gold-500/20 hover:border-gold-400/80 transition-all group flex items-center gap-3 backdrop-blur-md hover:-translate-y-1 shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-maroon-950 overflow-hidden shrink-0 border border-gold-500/30">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-gold-400 block font-semibold">
                  {item.category}
                </span>
                <p className="text-xs font-semibold text-ivory-100 truncate group-hover:text-gold-300 transition-colors">
                  {item.title}
                </p>
                <p className="text-[10px] text-gold-200/90 font-light">{item.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
