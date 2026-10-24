'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  PackageCheck,
  Calendar,
  MapPin,
  ArrowRight,
  Printer,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderType } from '@/types';

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Royal confetti burst on load!
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#380B12', '#F3E5AB', '#C98A90'],
      });
    } catch (e) {
      console.error(e);
    }

    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 py-20 text-center flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-maroon-900 text-sm">Preparing Royal Invoice...</p>
        </div>
      </div>
    );
  }

  const shippingAddress = order?.shippingAddressSnapshot
    ? JSON.parse(order.shippingAddressSnapshot)
    : null;

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Success Card */}
      <div className="bg-ivory-50 rounded-3xl border border-gold-500/40 shadow-royal-lg p-8 sm:p-12 text-center space-y-6">
        {/* Crest & Check */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-maroon-900 to-maroon-800 text-gold-300 flex items-center justify-center shadow-royal border-2 border-gold-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-700">
            Order Confirmed & Sealed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
            “Your order is on its way to becoming a memory.”
          </h1>
          <p className="text-sm text-charcoal-600 max-w-lg mx-auto font-light leading-relaxed">
            Thank you for bringing Knot & Bloom handcrafted crochet creations into your life. Our master artisans are carefully packaging your piece with devoted care.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-ivory-100 border border-sand-dark/40 text-left text-xs">
          <div>
            <span className="text-charcoal-500 block">Order Number</span>
            <span className="font-bold text-maroon-950 font-serif text-sm">
              {order?.orderNumber || id}
            </span>
          </div>

          <div>
            <span className="text-charcoal-500 block">Estimated Arrival</span>
            <span className="font-bold text-maroon-950">
              {order?.estimatedDeliveryDate ? formatDate(order.estimatedDeliveryDate) : '2–4 Business Days'}
            </span>
          </div>

          <div>
            <span className="text-charcoal-500 block">Tracking ID</span>
            <span className="font-bold text-maroon-950 font-mono text-[11px]">
              {order?.trackingNumber || 'DTDC-RMZ-948210IN'}
            </span>
          </div>

          <div>
            <span className="text-charcoal-500 block">Total Paid</span>
            <span className="font-bold text-maroon-950 font-serif text-sm">
              {order ? formatPrice(order.totalAmount) : '—'}
            </span>
          </div>
        </div>

        {/* Ordered Items List */}
        {order?.items && order.items.length > 0 && (
          <div className="text-left space-y-3 pt-4 border-t border-sand-dark/40">
            <h3 className="font-serif text-base font-bold text-maroon-950">
              Treasures Included in this Package
            </h3>

            <div className="space-y-3">
              {order.items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-ivory-100/70 border border-sand-dark/30 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-maroon-950/10 overflow-hidden shrink-0 border border-gold-500/20">
                      <img src={it.productImage} alt={it.productName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-maroon-950">{it.productName}</p>
                      {it.variantName && (
                        <p className="text-[11px] text-charcoal-500">Shade: {it.variantName}</p>
                      )}
                      <p className="text-[11px] text-charcoal-500">Quantity: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-maroon-900">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Address & Notes */}
        {shippingAddress && (
          <div className="text-left p-4 rounded-xl bg-ivory-100/70 border border-sand-dark/30 text-xs space-y-1">
            <span className="font-bold uppercase tracking-wider text-charcoal-700 block mb-1">
              Dispatch Destination:
            </span>
            <p className="font-semibold text-maroon-950">{shippingAddress.fullName} • {shippingAddress.phone}</p>
            <p className="text-charcoal-600">{shippingAddress.street}, {shippingAddress.landmark}</p>
            <p className="text-charcoal-600">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-sand-dark/40 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/account/orders/${order?.id || id}`}
            className="w-full sm:w-auto px-7 py-3 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center justify-center gap-2"
          >
            <span>Live Order Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-ivory-100 hover:bg-gold-50 text-maroon-950 border border-sand-dark text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-gold-600" />
            <span>Continue Shopping</span>
          </Link>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-charcoal-600 hover:text-maroon-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
