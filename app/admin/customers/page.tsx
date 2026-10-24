'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/admin/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-gold-700">Patron Directory</span>
        <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">Customer Management</h1>
        <p className="text-xs text-charcoal-500">Registered patrons, order counts, lifetime spends, and city locations.</p>
      </div>

      <div className="bg-ivory-50 rounded-2xl border border-sand-dark/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-500">Loading patrons list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/30 border-b border-sand-dark text-charcoal-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Orders Placed</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-dark/40">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gold-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-maroon-900 text-gold-300 flex items-center justify-center font-bold text-xs border border-gold-400">
                          {c.name[0]}
                        </div>
                        <span className="font-bold text-maroon-950">{c.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-600">
                      <p>{c.email}</p>
                      <p className="text-[11px] text-charcoal-400">{c.phone || 'No phone'}</p>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-600">
                      {c.address}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-100 text-maroon-950 font-bold text-[11px]">
                        {c.orderCount} orders
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-serif font-bold text-maroon-900">
                      {formatPrice(c.totalSpent)}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-500 text-[11px]">
                      {formatDate(c.joinedAt)}
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
