'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Heart, MessageCircle, Eye, ArrowRight, Sparkles, Phone, Mail, Maximize2 } from 'lucide-react';
import { ProductType, ProductVariantType } from '@/types';
import { useWishlist } from '../providers/WishlistProvider';
import { ImagePreviewModal } from '../common/ImagePreviewModal';

interface QuickViewModalProps {
  product: ProductType | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  if (!product) return null;

  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImg, setSelectedImg] = useState<string>(
    product.images?.[0]?.url || '/products/gallery/emerald-and-magenta-crochet-flower-mat.png'
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType | null>(
    product.variants?.[0] || null
  );
  const [showPreview, setShowPreview] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to inquire/order the handcrafted creation: "${product.name}". Please share details on bespoke order & dispatch.`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative bg-ivory-50 rounded-2xl max-w-3xl w-full border border-gold-500/40 shadow-royal-lg overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-ivory-100/80 hover:bg-ivory-100 text-charcoal-700 hover:text-maroon-900 border border-gold-500/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery - Zero uncropped view */}
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-between bg-gradient-to-b from-ivory-100/70 to-sand-light/30">
          <div
            onClick={() => setShowPreview(true)}
            className="relative aspect-square w-full rounded-xl overflow-hidden bg-white shadow-inner mb-4 cursor-zoom-in group/qv flex items-center justify-center"
            title="Click for full uncropped preview (Amazon/Flipkart style)"
          >
            {selectedImg && (selectedImg.endsWith('.mp4') || selectedImg.endsWith('.webm') || selectedImg.includes('/video/upload/')) ? (
              <video
                src={selectedImg}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <img
                src={selectedImg}
                alt={product.name}
                className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover/qv:scale-105"
              />
            )}
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-maroon-950/80 text-gold-200 text-[10px] font-semibold flex items-center gap-1 shadow-md pointer-events-none">
              <Maximize2 className="w-3 h-3 text-gold-400" />
              <span>Full View</span>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto w-full pb-2">
              {product.images.map((img, idx) => {
                const isItemVideo = img.url.endsWith('.mp4') || img.url.endsWith('.webm') || img.url.includes('/video/upload/');
                return (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImg(img.url)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all bg-white relative flex items-center justify-center ${
                      selectedImg === img.url ? 'border-gold-500 shadow-sm' : 'border-transparent opacity-70'
                    }`}
                  >
                    {isItemVideo ? (
                      <video src={img.url} className="w-full h-full object-contain p-0.5" muted />
                    ) : (
                      <img src={img.url} alt="thumbnail" className="w-full h-full object-contain p-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Details & Bespoke Inquiry */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-700">
              {product.category?.name || 'Handcrafted Crochet'}
            </span>

            <h3 className="font-serif text-2xl font-bold text-maroon-950 mt-1">
              {product.name}
            </h3>

            {product.subtitle && (
              <p className="text-xs text-charcoal-500 mt-1 font-light italic">
                {product.subtitle}
              </p>
            )}

            <p className="text-xs text-charcoal-600 leading-relaxed my-3 line-clamp-3">
              {product.description}
            </p>

            {/* Direct Contact Block */}
            <div className="p-3.5 rounded-xl bg-gold-50/70 border border-gold-400/40 text-xs space-y-1.5 my-3">
              <span className="font-bold text-maroon-900 block text-[11px] uppercase tracking-wider">
                Direct Atelier Contact:
              </span>
              <div className="flex items-center gap-2 text-charcoal-800">
                <Phone className="w-3.5 h-3.5 text-gold-700" />
                <a href="tel:+919080236848" className="hover:underline font-semibold">
                  +91 9080236848
                </a>
              </div>
              <div className="flex items-center gap-2 text-charcoal-800 truncate">
                <Mail className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                <a href="mailto:suresh140105@gmail.com" className="hover:underline truncate">
                  suresh140105@gmail.com
                </a>
              </div>
            </div>

            {/* Variants if any */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-2">
                <label className="text-xs font-semibold text-charcoal-800 uppercase tracking-wider block mb-1.5">
                  Available Shades / Options:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-maroon-900 text-gold-200 border-gold-500 shadow-sm'
                          : 'bg-ivory-100 text-charcoal-800 border-sand-dark hover:border-gold-400'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-3 border-t border-sand-dark/40">
            <div className="flex gap-2">
              <a
                href={`https://wa.me/919080236848?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-ivory-100 font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 9080236848</span>
              </a>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-all ${
                  isFavorited
                    ? 'bg-maroon-900 text-gold-400 border-gold-400'
                    : 'bg-ivory-100 text-charcoal-700 hover:bg-gold-50 border-sand-dark'
                }`}
                title="Save piece"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-gold-400' : ''}`} />
              </button>
            </div>

            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Full Creation & Bespoke Inquiry</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Amazon / Flipkart Style Full View Lightbox Modal */}
      <ImagePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        images={(product.images || []).map((img) => ({
          url: img.url,
          alt: product.name,
          title: product.name,
        }))}
        initialIndex={Math.max(
          0,
          (product.images || []).findIndex((i) => i.url === selectedImg)
        )}
        productTitle={product.name}
      />
    </div>
  );
}
