'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ShowcaseImage {
  id: string;
  title: string;
  subtitle: string;
  cdnUrl: string;
  localFallback: string;
}

const SHOWCASE_ITEMS: ShowcaseImage[] = [
  {
    id: 'collection-masterpiece',
    title: 'Heirloom Babywear & Botanical Keychains',
    subtitle: '100% Handcrafted Combed Cotton Artistry',
    cdnUrl:
      'https://res.cloudinary.com/zsjpdh9i/image/upload/f_auto,q_auto/v1792922167/knot-and-bloom/products/cozy-crochet-babywear-and-keychain-collection-6.png',
    localFallback:
      '/products/gallery/Cozy Crochet Babywear and Keychain Collection-6.png',
  },
  {
    id: 'flower-mandala',
    title: 'Emerald & Magenta Botanical Mandala',
    subtitle: 'Intricate Centerpiece Stitchwork & Scalloped Petals',
    cdnUrl:
      'https://res.cloudinary.com/zsjpdh9i/image/upload/f_auto,q_auto/v1792909217/knot-and-bloom/products/emerald-and-magenta-crochet-flower-mat',
    localFallback:
      '/products/gallery/emerald-and-magenta-crochet-flower-mat.png',
  },
  {
    id: 'baby-vest',
    title: 'Handcrafted Ivory & Aqua Baby Vest',
    subtitle: 'Delicate Floral Appliqué & Textured Bobble Border',
    cdnUrl:
      'https://res.cloudinary.com/zsjpdh9i/image/upload/f_auto,q_auto/v1792909225/knot-and-bloom/products/handcrafted-ivory-and-aqua-crochet-baby-vest-12',
    localFallback:
      '/products/gallery/handcrafted-ivory-and-aqua-crochet-baby-vest-12.png',
  },
  {
    id: 'botanical-charm',
    title: 'Pastel Aqua Keepsake Keychain',
    subtitle: 'Pocket-Sized Everlasting Floral Charm',
    cdnUrl:
      'https://res.cloudinary.com/zsjpdh9i/image/upload/f_auto,q_auto/v1792909244/knot-and-bloom/products/pastel-aqua-crochet-flower-keychain-8',
    localFallback:
      '/products/gallery/pastel-aqua-crochet-flower-keychain-8.png',
  },
];

export default function ArtisanGenesisShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = SHOWCASE_ITEMS[activeIndex];

  return (
    <div className="space-y-4">
      {/* Main Showcase Visual */}
      <div className="relative group rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-royal-lg aspect-[4/3] bg-maroon-950 transition-all duration-500">
        <img
          key={activeItem.id}
          src={activeItem.cdnUrl}
          alt={activeItem.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== activeItem.localFallback) {
              target.src = activeItem.localFallback;
            }
          }}
        />

        {/* Authenticity Badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-950/85 backdrop-blur-md border border-gold-400/40 text-[11px] font-semibold text-gold-300 shadow-md">
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span>Authentic Atelier Creation</span>
        </div>

        {/* Caption Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-950/95 via-maroon-950/60 to-transparent p-5 pt-12 text-ivory-50 flex flex-col justify-end">
          <p className="font-serif text-base sm:text-lg font-bold text-gold-200">
            {activeItem.title}
          </p>
          <p className="text-xs text-ivory-300 font-light flex items-center gap-1.5 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
            <span>{activeItem.subtitle}</span>
          </p>
        </div>
      </div>

      {/* Interactive Artisan Thumbnail Selector */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {SHOWCASE_ITEMS.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative rounded-xl overflow-hidden aspect-[4/3] border transition-all duration-300 text-left focus:outline-none ${
                isSelected
                  ? 'border-gold-500 ring-2 ring-gold-400/50 scale-[1.02] shadow-gold-glow'
                  : 'border-sand-dark/60 opacity-70 hover:opacity-100 hover:border-gold-400/60'
              }`}
              title={item.title}
            >
              <img
                src={item.cdnUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== item.localFallback) {
                    target.src = item.localFallback;
                  }
                }}
              />
              {isSelected && (
                <div className="absolute inset-0 bg-gold-500/15 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
