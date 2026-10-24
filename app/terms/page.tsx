import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | Knot & Bloom Boutique',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-4 mb-10 pb-6 border-b border-sand-dark/40">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700">
          User Agreement
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
          Terms & Conditions
        </h1>
        <p className="text-xs text-charcoal-500">Effective from October 2026</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">1. Acceptance of Terms</h2>
          <p>
            By accessing or ordering from Knot & Bloom, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our marketplace.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">2. Handcrafted Uniqueness</h2>
          <p>
            Because each piece is individually hand-crocheted by artisan women, subtle nuances in stitch tension, thread shading, or floral petal placement are intentional markers of authentic handiwork and are celebrated as unique characteristics of your piece.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">3. Orders, Pricing & Taxes</h2>
          <p>
            All prices are quoted in Indian National Rupees (INR) and include applicable Goods and Services Tax (GST). We reserve the right to revise prices or cancel orders in the rare event of inventory discrepancy or obvious typographical error.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">4. Intellectual Property</h2>
          <p>
            The Knot & Bloom brand name, royal crest, product photography, editorial stories, and curated designs are the exclusive intellectual property of Knot & Bloom. Unauthorized duplication is strictly prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
