'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight, MessageCircle, Eye, Phone, Mail } from 'lucide-react';
import { useWishlist } from '@/components/providers/WishlistProvider';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-ivory-100 py-20 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gold-50 border border-gold-400/40 flex items-center justify-center text-gold-600 shadow-royal">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
          “Save the creations you cherish most.”
        </h1>
        <p className="text-sm text-charcoal-600 max-w-md font-light leading-relaxed">
          Your saved portfolio is currently a blank canvas. Discover handcrafted crochet pieces you love and save them to commission directly.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center gap-2"
        >
          <span>Explore Portfolio Pieces</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
          Saved Portfolio Creations ({items.length})
        </h1>
        <p className="text-xs text-charcoal-500 mt-1">
          Handcrafted crochet creations you have marked to commission from our atelier.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => {
          const whatsappMsg = encodeURIComponent(
            `Hello Knot & Bloom Atelier, I would love to commission my saved creation: "${product.name}". Please share details on crafting.`
          );

          return (
            <div
              key={product.id}
              className="group relative bg-ivory-50 rounded-2xl border border-sand-dark/50 overflow-hidden shadow-sm hover:shadow-royal-lg hover:border-gold-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square w-full bg-maroon-950/10 overflow-hidden">
                  <img
                    src={product.images?.[0]?.url || '/products/placeholder-royal.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-ivory-50/90 text-charcoal-600 hover:text-red-700 shadow-sm"
                    title="Remove from saved pieces"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
                    {product.category?.name || 'Crochet Creation'}
                  </span>

                  <Link href={`/product/${product.slug}`} className="block">
                    <h3 className="font-serif text-base font-bold text-maroon-950 hover:text-gold-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="p-2.5 rounded-xl bg-ivory-100 border border-sand-dark/40 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-maroon-950 font-semibold">
                      <Phone className="w-3 h-3 text-gold-600" />
                      <span>9080236848</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-charcoal-600 truncate text-[10px]">
                      <Mail className="w-3 h-3 text-gold-600 shrink-0" />
                      <span className="truncate">suresh140105@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <Link
                  href={`/product/${product.slug}`}
                  className="w-full py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Creation Details</span>
                </Link>

                <a
                  href={`https://wa.me/919080236848?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-ivory-100 text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
