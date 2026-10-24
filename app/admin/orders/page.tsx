'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/components/providers/ToastProvider';
import { OrderType } from '@/types';

export default function AdminOrdersPage() {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const url = filterStatus ? `/api/orders?status=${filterStatus}` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        success(`Order status updated to ${newStatus}`);
        loadOrders();
      } else {
        error('Failed to update status.');
      }
    } catch (e) {
      error('Error updating order.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700">Dispatches & Logistics</span>
          <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">Orders Management</h1>
          <p className="text-xs text-charcoal-500">Live order fulfillment, statuses, tracking IDs, and customer records.</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-500 font-medium">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-ivory-50 border border-sand-dark text-xs font-semibold px-3 py-2 rounded-xl text-maroon-950"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-ivory-50 rounded-2xl border border-sand-dark/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-500">Loading orders list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/30 border-b border-sand-dark text-charcoal-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Amount</th>
                  <th className="py-3.5 px-3">Payment</th>
                  <th className="py-3.5 px-4">Courier Status</th>
                  <th className="py-3.5 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-dark/40">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gold-50/50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-maroon-950">
                      {o.orderNumber}
                    </td>

                    <td className="py-4 px-3 text-charcoal-600">
                      {formatDate(o.createdAt)}
                    </td>

                    <td className="py-4 px-3">
                      <span className="font-semibold text-maroon-900 block">{o.user?.name || 'Customer'}</span>
                      <span className="text-[10px] text-charcoal-500">{o.user?.email}</span>
                      <span className="text-[10px] text-charcoal-500 block">{o.user?.phone}</span>
                    </td>

                    <td className="py-4 px-3 font-serif font-bold text-maroon-950">
                      {formatPrice(o.totalAmount)}
                    </td>

                    <td className="py-4 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {o.paymentMethod} • {o.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-maroon-900 text-gold-200">
                        {o.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className="bg-ivory-100 border border-sand-dark text-[11px] font-semibold text-maroon-950 px-2 py-1.5 rounded-lg focus:outline-none focus:border-gold-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="PACKED">Packed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
