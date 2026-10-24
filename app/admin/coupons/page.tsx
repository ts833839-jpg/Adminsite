'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/providers/ToastProvider';

export default function AdminCouponsPage() {
  const { success, error } = useToast();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('15');
  const [minOrderAmount, setMinOrderAmount] = useState('499');
  const [showModal, setShowModal] = useState(false);

  const loadCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description,
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderAmount: parseFloat(minOrderAmount || '0'),
        }),
      });

      if (!res.ok) {
        error('Failed to create coupon.');
        return;
      }

      success(`Coupon ${code.toUpperCase()} generated!`);
      setCode('');
      setDescription('');
      setShowModal(false);
      loadCoupons();
    } catch (err) {
      error('Error creating coupon.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        success('Coupon deleted.');
        loadCoupons();
      }
    } catch (e) {
      error('Error deleting coupon.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700">Promotions & Vouchers</span>
          <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">Coupons Management</h1>
          <p className="text-xs text-charcoal-500">Create promotional codes, minimum order criteria, and discount rates.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Royal Voucher</span>
        </button>
      </div>

      <div className="bg-ivory-50 rounded-2xl border border-sand-dark/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-500">Loading coupons...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/30 border-b border-sand-dark text-charcoal-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Min Order</th>
                  <th className="py-3.5 px-4">Usage Count</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-dark/40">
                {coupons.map((cpn) => (
                  <tr key={cpn.id} className="hover:bg-gold-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-maroon-950 text-sm">
                      {cpn.code}
                    </td>

                    <td className="py-3.5 px-4 font-serif font-bold text-maroon-900">
                      {cpn.discountType === 'PERCENTAGE'
                        ? `${cpn.discountValue}% OFF`
                        : `Flat ₹${cpn.discountValue} OFF`}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-600">
                      {formatPrice(cpn.minOrderAmount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-maroon-950">{cpn.usageCount} times</span>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-600 max-w-xs truncate">
                      {cpn.description || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(cpn.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-charcoal-400 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory-50 rounded-2xl max-w-md w-full p-6 border border-gold-500/40 shadow-royal-lg space-y-4">
            <h3 className="font-serif text-xl font-bold text-maroon-950">New Voucher Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Voucher Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. FESTIVE25"
                  className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-xl uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Rupee (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Campaign Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Special festive discount on all crochet flowers"
                  className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-charcoal-600 hover:text-maroon-900"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl btn-gold font-semibold shadow-sm">
                  Publish Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
