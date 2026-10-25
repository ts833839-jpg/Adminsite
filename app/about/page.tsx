import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import ArtisanGenesisShowcase from '@/components/about/ArtisanGenesisShowcase';

export const metadata = {
  title: 'About Knot & Bloom — Handcrafted Crochet & Artisan Portfolio',
  description:
    'Knot & Bloom is a bespoke handcrafted crochet atelier, weaving timeless artistry with modern design and empowering master women weavers.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory-100">
      {/* Hero Banner */}
      <section className="relative py-24 bg-maroon-950 text-ivory-100 overflow-hidden border-b border-gold-500/25">
        <div className="absolute inset-0 bg-palace-pattern opacity-25 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon-900 border border-gold-500/40 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>The Knot & Bloom Manifesto</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-ivory-50">
            More Than Craft. <br />
            <span className="gold-shimmer italic font-normal">A Collection of Things Worth Keeping.</span>
          </h1>

          <p className="text-base sm:text-lg text-ivory-300 font-light leading-relaxed max-w-2xl mx-auto">
            Knot & Bloom redefines modern artisanal elegance through the patient, mindful discipline of handcrafted crochet.
          </p>
        </div>
      </section>

      {/* Narrative Section 1 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700">
              The Genesis
            </span>
            <h2 className="font-serif text-3xl font-bold text-maroon-950">
              Preserving The Art of Handcrafted Crochet
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
              For generations, master artisans have gathered with wooden hooks in hand, weaving stories of devotion, beauty, and mindful patience into each thread.
            </p>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
              Knot & Bloom was founded with a singular conviction: handcrafted crochet is not merely decorative; it is an enduring heirloom. Every keychain charm, pouch, and everlasting flower bouquet carries the soul of its maker.
            </p>
          </div>

          <div>
            <ArtisanGenesisShowcase />
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="py-16 bg-ivory-50 border-y border-sand-dark/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-maroon-950">
              Our Artisan Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-ivory-100 border border-sand-dark/40 space-y-3">
              <div className="w-10 h-10 rounded-full bg-maroon-900 text-gold-300 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-maroon-950">
                100% Combed Artisan Yarn
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                We reject synthetic compromises. Our artisans exclusively crochet with pure combed natural cotton and specialty yarns for an ultra-soft, heirloom finish.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-100 border border-sand-dark/40 space-y-3">
              <div className="w-10 h-10 rounded-full bg-maroon-900 text-gold-300 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-maroon-950">
                Fair Living Wages
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Our weavers earn fair, dignified living wages. Every piece directly empowers talented artisan women to sustain their craft and nurture independent livelihoods.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-100 border border-sand-dark/40 space-y-3">
              <div className="w-10 h-10 rounded-full bg-maroon-900 text-gold-300 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-maroon-950">
                Everlasting Keepsakes
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                From everlasting botanical blooms that never wilt to durable keychains that accompany you for years, our creations are made for memories that endure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center px-4">
        <div className="max-w-2xl mx-auto space-y-5">
          <span className="text-2xl text-gold-600 font-serif">⚜</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
            Ready to Discover Handcrafted Pieces?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Explore our curated collections of crochet keychains, shrugs, bags, botanical blooms, and home accents.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow"
          >
            <span>Explore The Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
