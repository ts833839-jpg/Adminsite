'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, ChevronRight, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderType } from '@/types';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

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
        <span className="text-maroon-900 font-semibold">My Orders</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
          Your Order History
        </h1>
        <p className="text-xs text-charcoal-600 mt-1">
          Review your handcrafted crochet treasures and track live courier status.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-serif text-sm text-maroon-900">Retrieving Royal Orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm space-y-4 hover:border-gold-400 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-dark/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-maroon-950">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-maroon-900 text-gold-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Ordered on {formatDate(order.createdAt)} • Payment: {order.paymentMethod} ({order.paymentStatus})
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-serif text-xl font-bold text-maroon-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Items Row */}
              <div className="space-y-2">
                {order.items?.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-maroon-950/10 overflow-hidden shrink-0 border border-gold-500/20">
                        <img src={it.productImage} alt={it.productName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-maroon-950">{it.productName}</p>
                        {it.variantName && (
                          <p className="text-[11px] text-charcoal-500">Shade: {it.variantName}</p>
                        )}
                        <p className="text-[11px] text-charcoal-500">Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-maroon-900">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-sand-dark/40 flex items-center justify-between">
                <span className="text-xs text-charcoal-500 font-mono">
                  Tracking: {order.trackingNumber || 'Available upon dispatch'}
                </span>

                <Link
                  href={`/account/orders/${order.id}`}
                  className="px-4 py-2 rounded-xl btn-gold text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <span>Track Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-ivory-50 rounded-2xl border border-sand-dark/40 p-8 space-y-4">
          <Package className="w-12 h-12 text-gold-600 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-maroon-950">No Orders Yet</h3>
          <p className="text-sm text-charcoal-600 max-w-md mx-auto">
            You haven’t ordered any handcrafted crochet items yet. Begin discovering something worth keeping.
          </p>
          <Link href="/shop" className="inline-block px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold">
            Explore Collections
          </Link>
        </div>
      )}
    </div>
  );
}
