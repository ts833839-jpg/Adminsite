'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductType } from '@/types';
import { ProductCard } from '../products/ProductCard';
import { QuickViewModal } from '../products/QuickViewModal';

interface CuratedCollectionsProps {
  products: ProductType[];
}

export function CuratedCollections({ products }: CuratedCollectionsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'wear' | 'keychains' | 'bags' | 'home' | 'flowers'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<ProductType | null>(null);

  const tabs = [
    { key: 'all', label: 'All Handcrafted Pieces' },
    { key: 'wear', label: 'Wear & Dresses' },
    { key: 'keychains', label: 'Keychains & Charms' },
    { key: 'bags', label: 'Bags & Pouches' },
    { key: 'home', label: 'Home Sanctuary' },
    { key: 'flowers', label: 'Botanical Blooms' },
  ];

  const validProducts = products.filter(
    (p) =>
      p &&
      p.name &&
      p.images &&
      p.images.length > 0 &&
      p.images[0]?.url &&
      !p.images[0].url.includes('placeholder')
  );

  const filteredProducts = validProducts.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'wear') return p.category?.slug === 'crochet-wear';
    if (activeTab === 'keychains') return p.category?.slug === 'crochet-keychains';
    if (activeTab === 'bags') return p.category?.slug === 'crochet-bags';
    if (activeTab === 'home') return p.category?.slug === 'crochet-home';
    if (activeTab === 'flowers') return p.category?.slug === 'crochet-flowers' || p.category?.slug === 'crochet-accessories';
    return true;
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sand-dark/40">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold text-gold-700">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Treasures Worth Keeping</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-950">
            Featured Collections
          </h2>
          <p className="text-sm text-charcoal-600 font-light">
            Patiently hand-crocheted heirloom pieces, selected for grace and longevity.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${
                activeTab === tab.key
                  ? 'bg-maroon-900 text-gold-200 border-gold-500 font-semibold shadow-sm'
                  : 'bg-ivory-50 text-charcoal-700 border-sand-dark hover:border-gold-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-ivory-50 rounded-2xl border border-sand-dark/40">
          <p className="font-serif text-lg text-maroon-950">More handcrafted treasures arriving soon in this collection.</p>
        </div>
      )}

      {/* Explore All Link */}
      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-royal text-sm font-semibold shadow-royal"
        >
          <span>Explore All Handcrafted Treasures</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick View Popover Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
