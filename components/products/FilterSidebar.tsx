'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw, X, Check, Phone, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { CategoryType } from '@/types';

interface FilterSidebarProps {
  categories: CategoryType[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  priceRange?: [number, number];
  onPriceChange?: (range: [number, number]) => void;
  selectedBadge?: string;
  onSelectBadge?: (badge: string) => void;
  minRating?: number;
  onRatingChange?: (rating: number) => void;
  inStockOnly?: boolean;
  onInStockChange?: (val: boolean) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  onReset,
  isMobileOpen,
  onCloseMobile,
}: FilterSidebarProps) {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sand-dark/40">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gold-600" />
          <h3 className="font-serif text-lg font-bold text-maroon-950">Boutiques</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-charcoal-500 hover:text-maroon-900 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Show All</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-3">
          Craft Categories
        </h4>
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left text-xs px-2.5 py-2 rounded-xl transition-colors flex items-center justify-between ${
              selectedCategory === ''
                ? 'bg-maroon-900 text-gold-200 font-semibold shadow-sm'
                : 'text-charcoal-700 hover:bg-gold-50'
            }`}
          >
            <span>All Handcrafted Pieces</span>
            {selectedCategory === '' && <Check className="w-3.5 h-3.5 text-gold-400" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left text-xs px-2.5 py-2 rounded-xl transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-maroon-900 text-gold-200 font-semibold shadow-sm'
                  : 'text-charcoal-700 hover:bg-gold-50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {cat._count?.products !== undefined && (
                <span className="text-[10px] opacity-70 ml-2">({cat._count.products})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Atelier Contact Card in Sidebar */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-maroon-950 to-charcoal-950 text-ivory-100 border border-gold-500/30 space-y-3">
        <div className="flex items-center gap-1.5 text-gold-400 text-xs font-serif font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct Studio Contact</span>
        </div>
        <p className="text-[11px] text-ivory-300 leading-relaxed font-light">
          Have a bespoke design in mind or want to place a custom crochet order?
        </p>

        <div className="space-y-2 text-xs pt-1">
          <a
            href="tel:+919080236848"
            className="flex items-center gap-2 p-2 rounded-xl bg-charcoal-900 hover:bg-maroon-900/60 text-gold-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="font-semibold">9080236848</span>
          </a>

          <a
            href="https://wa.me/919080236848?text=Hello,%20I%20would%20like%20to%20inquire%20about%20a%20handcrafted%20crochet%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-ivory-100 font-semibold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href="mailto:suresh140105@gmail.com"
            className="flex items-center gap-2 p-2 rounded-xl bg-charcoal-900 hover:bg-maroon-900/60 text-ivory-200 transition-colors truncate"
          >
            <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="truncate text-[11px]">suresh140105@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-ivory-50 p-5 rounded-2xl border border-sand-dark/40 shadow-sm sticky top-28">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-ivory-50 h-full p-6 shadow-2xl overflow-y-auto">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 p-2 text-charcoal-500 hover:text-maroon-950"
            >
              <X className="w-5 h-5" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
