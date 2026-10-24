'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Package,
  CheckCircle2,
  Clock,
  Printer,
  Truck,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { formatPrice, formatDate, ORDER_STATUS_STEPS, getStatusStepIndex } from '@/lib/utils';
import { OrderType } from '@/types';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 py-20 text-center flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-ivory-100 py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-maroon-950">Order Not Found</h2>
        <Link href="/account/orders" className="text-xs text-gold-700 underline font-semibold">
          Return to All Orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = getStatusStepIndex(order.status);
  const shippingAddress = order.shippingAddressSnapshot
    ? JSON.parse(order.shippingAddressSnapshot)
    : null;

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-maroon-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <Link href="/account" className="hover:text-maroon-900 transition-colors">
          Account
        </Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <Link href="/account/orders" className="hover:text-maroon-900 transition-colors">
          Orders
        </Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <span className="text-maroon-900 font-semibold">{order.orderNumber}</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Royal Consignment Tracking
          </span>
          <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Placed on {formatDate(order.createdAt)} • Express Palace Air Delivery
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-ivory-50 border border-sand-dark text-xs font-semibold text-charcoal-700 hover:text-maroon-900 flex items-center gap-1.5 self-start shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* VISUAL TIMELINE STEPPER (Ordered -> Packed -> Shipped -> Out for Delivery -> Delivered) */}
      <div className="p-8 rounded-3xl bg-ivory-50 border border-gold-500/30 shadow-royal-lg mb-10">
        <h3 className="font-serif text-lg font-bold text-maroon-950 mb-6">
          Courier Journey Timeline
        </h3>

        <div className="relative">
          {/* Progress bar background line */}
          <div className="hidden sm:block absolute top-5 left-10 right-10 h-1 bg-sand-dark -z-0" />
          <div
            className="hidden sm:block absolute top-5 left-10 h-1 bg-gradient-to-r from-gold-500 to-maroon-800 transition-all duration-700 -z-0"
            style={{
              width: `${Math.max(0, (currentStepIdx / (ORDER_STATUS_STEPS.length - 1)) * 80)}%`,
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative z-10">
            {ORDER_STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-maroon-900 text-gold-300 shadow-md border-2 border-gold-400'
                        : 'bg-ivory-100 text-charcoal-400 border border-sand-dark'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-gold-400" /> : idx + 1}
                  </div>

                  <div>
                    <p
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-maroon-900 font-serif text-sm' : isCompleted ? 'text-charcoal-900' : 'text-charcoal-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-charcoal-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracking Details Banner */}
        <div className="mt-8 p-4 rounded-xl bg-ivory-100 border border-sand-dark/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-charcoal-500 font-medium">Air Courier Partner: </span>
            <span className="font-bold text-maroon-950">DTDC Royal Express</span>
            <span className="mx-2 text-charcoal-400">|</span>
            <span className="text-charcoal-500 font-medium">Tracking Number: </span>
            <span className="font-mono font-bold text-maroon-900">
              {order.trackingNumber || 'DTDC-RMZ-948210IN'}
            </span>
          </div>

          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Expected by {order.estimatedDeliveryDate ? formatDate(order.estimatedDeliveryDate) : '3 Business Days'}</span>
          </span>
        </div>
      </div>

      {/* Two Column Order Detail Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Items in Consignment */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-maroon-950 pb-3 border-b border-sand-dark/40">
            Handcrafted Treasures in this Order
          </h3>

          <div className="space-y-4">
            {order.items?.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-maroon-950/10 overflow-hidden shrink-0 border border-gold-500/20">
                    <img src={it.productImage} alt={it.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-maroon-950 text-sm">{it.productName}</p>
                    {it.variantName && (
                      <p className="text-[11px] text-charcoal-500">Shade: {it.variantName}</p>
                    )}
                    <p className="text-[11px] text-charcoal-500">Qty: {it.quantity} × {formatPrice(it.price)}</p>
                  </div>
                </div>

                <span className="font-serif font-bold text-sm text-maroon-900">
                  {formatPrice(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-4 border-t border-sand-dark/40 space-y-2 text-xs text-charcoal-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-serif font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Voucher Discount</span>
                <span>- {formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Air Shipping</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="pt-2 border-t border-sand-dark/30 flex justify-between font-serif text-base font-bold text-maroon-950">
              <span>Total Paid</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right: Address & Payment Info */}
        <div className="space-y-6">
          {shippingAddress && (
            <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm text-xs space-y-2">
              <span className="font-bold uppercase tracking-wider text-charcoal-700 block mb-2">
                Destination Address
              </span>
              <p className="font-bold text-maroon-950 text-sm">{shippingAddress.fullName}</p>
              <p className="text-charcoal-600">{shippingAddress.street}</p>
              {shippingAddress.landmark && <p className="text-charcoal-600">{shippingAddress.landmark}</p>}
              <p className="text-charcoal-600">
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
              </p>
              <p className="text-charcoal-600 font-medium pt-1">Phone: {shippingAddress.phone}</p>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm text-xs space-y-2">
            <span className="font-bold uppercase tracking-wider text-charcoal-700 block mb-2">
              Payment Information
            </span>
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-semibold text-maroon-950">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between">
                <span>Applied Coupon:</span>
                <span className="font-mono font-bold text-gold-800">{order.couponCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
