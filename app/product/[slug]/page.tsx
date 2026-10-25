'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Sparkles,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Send,
  Layers,
  Scissors,
  Clock,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import { ProductType, ProductVariantType } from '@/types';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { ProductCard } from '@/components/products/ProductCard';
import { ImagePreviewModal } from '@/components/common/ImagePreviewModal';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error, info } = useToast();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImg, setSelectedImg] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Inquiry form inputs
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          if (data.product.images?.[0]?.url) {
            setSelectedImg(data.product.images[0].url);
          }
          if (data.product.variants?.[0]) {
            setSelectedVariant(data.product.variants[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 py-16 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-maroon-900 text-sm">Retrieving Atelier Creation Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory-100 py-20 px-4 max-w-7xl mx-auto text-center space-y-4">
        <span className="text-3xl text-gold-600 font-serif">⚜</span>
        <h1 className="font-serif text-3xl font-bold text-maroon-950">
          “This creation is currently being prepared in our atelier.”
        </h1>
        <p className="text-sm text-charcoal-600">The piece you are looking for may have been archived.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price || product.price;

  const whatsappMessage = encodeURIComponent(
    `Hello Knot & Bloom Atelier, I would love to custom order or inquire about: "${product.name}" (${
      selectedVariant ? `Option: ${selectedVariant.name}` : ''
    }). Could you please share the handcrafted timeline and customization details?`
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.subtitle || 'Handcrafted crochet piece by Knot & Bloom',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      info('Creation link copied to clipboard!');
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientMessage) {
      error('Please complete your name, email, and bespoke request message.');
      return;
    }
    setSubmittingInquiry(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          productTitle: product.name,
          productSlug: product.slug,
          message: clientMessage,
        }),
      });
      if (res.ok) {
        setInquirySent(true);
        success('Your bespoke request has been sent to our master artisan atelier!');
      } else {
        error('Failed to submit inquiry. Please contact us via WhatsApp.');
      }
    } catch (err) {
      error('Error sending request. Please reach us via WhatsApp or phone.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Parse specifications details
  let parsedDetails: { [key: string]: string } = {};
  try {
    if (product.details) {
      parsedDetails = JSON.parse(product.details);
    }
  } catch (e) {
    parsedDetails = {};
  }

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-500">
        <Link href="/" className="hover:text-maroon-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <Link href="/shop" className="hover:text-maroon-900 transition-colors">
          Portfolio
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-gold-500" />
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-maroon-900 transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <span className="text-maroon-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Two-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-ivory-50 border border-gold-500/30 shadow-royal-lg group">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
              {product.badge && (
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-maroon-900 text-gold-200 border border-gold-400 shadow-sm">
                  {product.badge}
                </span>
              )}
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold-100/90 text-maroon-950 border border-gold-300 shadow-sm">
                100% Handcrafted Crochet
              </span>
            </div>

            {/* Share & Favorite icons */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isFavorited
                    ? 'bg-maroon-900 text-gold-400 border border-gold-400'
                    : 'bg-ivory-50/90 text-charcoal-700 hover:text-maroon-900'
                }`}
                title="Save to Favorites"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-gold-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-ivory-50/90 text-charcoal-700 hover:text-maroon-900 flex items-center justify-center shadow-md transition-all"
                title="Share this creation"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Main Showcase Image - Click for Amazon/Flipkart style full uncropped preview */}
            <div
              onClick={() => setShowImagePreview(true)}
              className="w-full h-full flex items-center justify-center p-3 sm:p-5 cursor-zoom-in relative group/main"
              title="Click to view full uncropped image (Flipkart/Amazon style zoom)"
            >
              <img
                src={selectedImg || '/products/placeholder-royal.svg'}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover/main:scale-105"
              />

              {/* Floating Full View Pill */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-maroon-950/85 backdrop-blur-md border border-gold-400/40 text-gold-200 text-xs font-semibold flex items-center gap-1.5 shadow-royal pointer-events-none group-hover/main:bg-maroon-900 transition-colors">
                <Maximize2 className="w-3.5 h-3.5 text-gold-400" />
                <span>Click for Full View</span>
              </div>
            </div>
          </div>

          {/* Thumbnails if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImg(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all bg-white ${
                    selectedImg === img.url
                      ? 'border-gold-500 ring-2 ring-gold-400/40'
                      : 'border-sand-dark opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}

          {/* Amazon / Flipkart Style Full View Lightbox Modal */}
          <ImagePreviewModal
            isOpen={showImagePreview}
            onClose={() => setShowImagePreview(false)}
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

          {/* Craft Guarantee Trio */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 text-center text-xs">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-ivory-50 border border-sand-dark/40 flex flex-col items-center">
              <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 mb-1" />
              <span className="font-semibold text-maroon-950 text-[10px] sm:text-xs leading-tight">Pure Hand-Hooked</span>
              <span className="text-[9px] sm:text-[10px] text-charcoal-500">Master Atelier</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-ivory-50 border border-sand-dark/40 flex flex-col items-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 mb-1" />
              <span className="font-semibold text-maroon-950 text-[10px] sm:text-xs leading-tight">Custom Colors</span>
              <span className="text-[9px] sm:text-[10px] text-charcoal-500">Bespoke sizing</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-ivory-50 border border-sand-dark/40 flex flex-col items-center">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 mb-1" />
              <span className="font-semibold text-maroon-950 text-[10px] sm:text-xs leading-tight">Direct Dispatch</span>
              <span className="text-[9px] sm:text-[10px] text-charcoal-500">Care courier</span>
            </div>
          </div>
        </div>

        {/* Right Column: Creation Details & Bespoke Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
              {product.category?.name || 'Exclusive Crochet Boutique'}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950 mt-1 leading-tight">
              {product.name}
            </h1>

            {product.subtitle && (
              <p className="text-sm text-charcoal-600 font-light mt-1.5 leading-relaxed">
                {product.subtitle}
              </p>
            )}

            <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-500">
              <span>Craft: <strong>100% Handcrafted Artisan Crochet</strong></span>
              <span>•</span>
              <span>SKU: {product.sku}</span>
            </div>
          </div>

          {/* Direct Atelier Contact & Commission Box (Zero Prices) */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gold-50/90 to-ivory-50 border border-gold-400/50 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-maroon-900 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                Handcrafted To Order
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Direct Atelier Contact
              </span>
            </div>

            <p className="text-xs text-charcoal-700 leading-relaxed font-light">
              Every creation is patiently crocheted by hand. For orders, custom shade requests, or bespoke commission timelines, please reach out directly:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href={`https://wa.me/919080236848?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-ivory-100 font-semibold text-xs shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <div>
                  <span className="block text-[10px] opacity-80 uppercase tracking-wider">WhatsApp / Call</span>
                  <span className="font-bold text-sm">9080236848</span>
                </div>
              </a>

              <a
                href={`mailto:suresh140105@gmail.com?subject=${encodeURIComponent(`Inquiry for ${product.name}`)}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-maroon-900 hover:bg-maroon-950 text-gold-200 font-semibold text-xs border border-gold-500/40 shadow-sm transition-all"
              >
                <Mail className="w-4 h-4 shrink-0 text-gold-400" />
                <div className="truncate">
                  <span className="block text-[10px] opacity-80 uppercase tracking-wider">Direct Email</span>
                  <span className="font-bold text-xs truncate block">suresh140105@gmail.com</span>
                </div>
              </a>
            </div>
          </div>

          {/* Variants Selector (If multiple shades/sizes) */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-charcoal-800">
                  Select Shade / Option:
                </span>
                <span className="text-maroon-900 font-semibold">{selectedVariant?.name}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`text-xs px-4 py-2 rounded-xl border font-medium transition-all flex items-center gap-2 ${
                      selectedVariant?.id === v.id
                        ? 'bg-maroon-900 text-gold-200 border-gold-500 shadow-sm'
                        : 'bg-ivory-50 text-charcoal-800 border-sand-dark hover:border-gold-300'
                    }`}
                  >
                    {v.colorHex && (
                      <span
                        className="w-3 h-3 rounded-full border border-gold-500/40"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRIMARY ACTIONS: WhatsApp Order & Web Inquiry */}
          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/919080236848?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-ivory-100 font-serif text-sm sm:text-base font-bold shadow-royal flex items-center justify-center gap-2 sm:gap-2.5 transition-all text-center"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>Inquire & Order via WhatsApp (9080236848)</span>
            </a>

            <button
              onClick={() => setShowInquiryForm(!showInquiryForm)}
              className="w-full py-3.5 px-6 rounded-2xl bg-maroon-900 hover:bg-maroon-950 text-gold-200 font-semibold text-xs border border-gold-500/40 shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4 text-gold-400" />
              <span>{showInquiryForm ? 'Close Inquiry Form' : 'Send Direct Message to Atelier'}</span>
            </button>
          </div>

          {/* Inline Interactive Inquiry Form */}
          {showInquiryForm && (
            <div className="p-6 rounded-3xl bg-ivory-50 border border-gold-500/40 shadow-royal space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="border-b border-sand-dark/40 pb-3">
                <h3 className="font-serif text-lg font-bold text-maroon-950">
                  Bespoke Inquiry for {product.name}
                </h3>
                <p className="text-xs text-charcoal-500">
                  Our artisan team will reach out directly via WhatsApp or Email within 24 hours.
                </p>
              </div>

              {inquirySent ? (
                <div className="p-6 text-center space-y-2 bg-gold-50/60 rounded-2xl border border-gold-300">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-base font-bold text-maroon-950">Inquiry Received</h4>
                  <p className="text-xs text-charcoal-600">
                    Thank you, {clientName}! Our master artisan will contact you shortly at {clientEmail || clientPhone}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-charcoal-800 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      required
                      className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-charcoal-800 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-charcoal-800 block mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+91 90802 36848"
                        className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-charcoal-800 block mb-1">
                      Customization Notes / Preferred Colors / Event Date
                    </label>
                    <textarea
                      rows={3}
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      placeholder="e.g. I would like 2 pieces in maroon & antique gold for a family wedding in December..."
                      required
                      className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-3 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center justify-center gap-2"
                  >
                    {submittingInquiry ? 'Sending to Atelier...' : 'Submit Bespoke Order Request'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Atelier Direct Contact Card */}
          <div className="p-5 rounded-2xl bg-charcoal-950 text-ivory-100 border border-gold-500/30 space-y-3">
            <div className="flex items-center gap-2 text-gold-400">
              <Sparkles className="w-4 h-4" />
              <span className="font-serif text-sm font-bold tracking-wide">Direct Atelier Concierge</span>
            </div>
            <p className="text-xs text-ivory-300 font-light">
              Speak directly with our artisan collective to discuss bespoke colors, dimensions, or bridal orders:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <a
                href="tel:+919080236848"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-charcoal-900 hover:bg-maroon-900/50 text-ivory-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="font-semibold">+91 9080236848</span>
              </a>
              <a
                href="mailto:suresh140105@gmail.com"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-charcoal-900 hover:bg-maroon-900/50 text-ivory-200 transition-colors truncate"
              >
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="truncate">suresh140105@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Story & Materials Description */}
          <div className="space-y-4 pt-4 border-t border-sand-dark/40">
            <h3 className="font-serif text-xl font-bold text-maroon-950">About This Creation</h3>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Specifications Details */}
            <div className="space-y-2 pt-2">
              <h4 className="font-serif text-sm font-bold text-maroon-950">Creation Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {product.materials && (
                  <div className="p-2.5 bg-ivory-50 rounded-xl border border-sand-dark/40">
                    <span className="text-charcoal-500 block text-[10px] uppercase">Materials</span>
                    <strong className="text-maroon-950 font-semibold">{product.materials}</strong>
                  </div>
                )}
                {product.dimensions && (
                  <div className="p-2.5 bg-ivory-50 rounded-xl border border-sand-dark/40">
                    <span className="text-charcoal-500 block text-[10px] uppercase">Dimensions</span>
                    <strong className="text-maroon-950 font-semibold">{product.dimensions}</strong>
                  </div>
                )}
                {product.careInstructions && (
                  <div className="p-2.5 bg-ivory-50 rounded-xl border border-sand-dark/40 sm:col-span-2">
                    <span className="text-charcoal-500 block text-[10px] uppercase">Yarn Care</span>
                    <span className="text-charcoal-700 font-light">{product.careInstructions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Creations from this Collection */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-sand-dark/40 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-gold-700">
                Curated Companions
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950 mt-1">
                More Creations from This Collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-gold-700 hover:text-maroon-900 flex items-center gap-1"
            >
              <span>Explore All Pieces</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
