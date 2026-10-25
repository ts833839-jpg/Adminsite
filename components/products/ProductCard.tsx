'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react';
import { ProductType } from '@/types';
import { useWishlist } from '../providers/WishlistProvider';

interface ProductCardProps {
  product: ProductType;
  onQuickView?: (product: ProductType) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  // Strictly prevent any blank or picture-less cards from rendering anywhere
  if (
    !product ||
    !product.name ||
    !product.images ||
    product.images.length === 0 ||
    !product.images[0]?.url ||
    product.images[0].url.includes('placeholder')
  ) {
    return null;
  }

  const isFavorited = isInWishlist(product.id);
  const primaryImg = product.images[0].url;
  const secondaryImg = product.images[1]?.url || primaryImg;
  const isVideo = primaryImg.endsWith('.mp4') || primaryImg.endsWith('.webm') || primaryImg.includes('/video/upload/');

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to inquire/order the handcrafted creation: "${product.name}". Please share details on bespoke order & dispatch.`
  );

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative bg-ivory-50 rounded-2xl border border-sand-dark/40 overflow-hidden shadow-sm hover:shadow-royal-lg hover:border-gold-400/60 transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-maroon-950/5">
        {/* Wishlist / Save Favorite */}
        <button
          onClick={handleWishlist}
          aria-label="Save to favorites"
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isFavorited
              ? 'bg-maroon-900 text-gold-400 border border-gold-400'
              : 'bg-ivory-50/90 text-charcoal-700 hover:text-maroon-900 hover:bg-ivory-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-gold-400 text-gold-400' : ''}`} />
        </button>

        {/* Product Image / Video Link */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {isVideo ? (
            <video
              src={primaryImg}
              muted
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <img
              src={isHovered ? secondaryImg : primaryImg}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}
        </Link>

        {/* Desktop Floating Action Overlays */}
        <div className="hidden lg:flex absolute inset-x-3 bottom-3 z-20 gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 py-2 px-3 bg-ivory-50/95 hover:bg-ivory-50 text-maroon-950 font-semibold text-xs rounded-xl shadow-md border border-gold-400/40 hover:border-gold-500 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-gold-600" />
            <span>View Creation</span>
          </Link>

          <a
            href={`https://wa.me/919080236848?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-ivory-100 font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between text-[11px] text-charcoal-500 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-gold-700 truncate">
              {product.category?.name || 'Handcrafted Crochet'}
            </span>
            <span className="text-[10px] text-maroon-900 font-medium">Bespoke Artisan Work</span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-gold-700 transition-colors">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-maroon-950 leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle */}
          {product.subtitle && (
            <p className="text-xs text-charcoal-500 line-clamp-1 mt-1 font-light">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Contact & Inquiry Action Bar (Zero Prices) */}
        <div className="pt-3 border-t border-sand-dark/40 mt-3 flex items-center justify-between">
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-700 font-medium">
              <Phone className="w-3 h-3 text-gold-600 shrink-0" />
              <span>9080236848</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-charcoal-500 truncate max-w-[140px]">
              <Mail className="w-2.5 h-2.5 text-gold-600 shrink-0" />
              <span className="truncate">suresh140105@gmail.com</span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/919080236848?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-ivory-100 shadow-sm transition-colors"
              title="Order on WhatsApp: 9080236848"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <Link
              href={`/product/${product.slug}`}
              className="px-3 py-2 rounded-xl bg-maroon-900 hover:bg-maroon-950 text-gold-200 border border-gold-500/40 text-xs font-semibold shadow-sm flex items-center gap-1 transition-colors"
              title="Contact / View Creation"
            >
              <span>Contact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
