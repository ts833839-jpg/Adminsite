'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CategoryType } from '@/types';

interface CategoryBoutiqueProps {
  categories: CategoryType[];
}

export function CategoryBoutique({ categories }: CategoryBoutiqueProps) {
  const validCategories = categories.filter(
    (cat) => cat && (cat._count?.products ?? 0) > 0 && cat.image && !cat.image.includes('placeholder')
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold text-gold-700">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Curated Boutiques</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-950">
          Explore by Craft & Motif
        </h2>
        <p className="text-sm text-charcoal-600 font-light leading-relaxed">
          Each boutique showcases heirloom crochet creations patiently hooked using intricate crochet techniques, luxury yarn, and dedicated hand craftsmanship.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {validCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative bg-ivory-50 rounded-2xl overflow-hidden border border-sand-dark/50 shadow-sm hover:shadow-royal-lg hover:border-gold-400 transition-all duration-300 flex flex-col"
          >
            {/* Category Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-maroon-950/10">
              <img
                src={cat.image || '/products/placeholder-royal.svg'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              {cat._count?.products !== undefined && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-ivory-50/90 text-maroon-950 shadow-sm border border-gold-400/40">
                  {cat._count.products} Treasures
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-maroon-950 group-hover:text-gold-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal-600 line-clamp-2 mt-1.5 leading-relaxed font-light">
                  {cat.description || 'Artisan hand-hooked crochet designs for your everyday moments.'}
                </p>
              </div>

              {/* View Collection Link */}
              <div className="mt-4 pt-3 border-t border-sand-dark/40 flex items-center justify-between text-xs font-semibold text-gold-700 group-hover:text-maroon-900 transition-colors">
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
