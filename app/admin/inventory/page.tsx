'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/providers/ToastProvider';

export default function AdminInventoryPage() {
  const { success, error } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<string>('');

  const loadInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      if (res.ok) {
        const data = await res.json();
        setItems(data.inventory || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSaveStock = async (productId: string) => {
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stock: parseInt(editStock, 10) }),
      });
      if (res.ok) {
        success('Inventory count updated successfully!');
        setEditingId(null);
        loadInventory();
      } else {
        error('Failed to update stock.');
      }
    } catch (e) {
      error('Error updating inventory.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-gold-700">Stock Control</span>
        <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">Inventory Management</h1>
        <p className="text-xs text-charcoal-500">Monitor warehouse reserves, safety thresholds, and quick-adjust crochet stocks.</p>
      </div>

      <div className="bg-ivory-50 rounded-2xl border border-sand-dark/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-500">Loading stock records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/30 border-b border-sand-dark text-charcoal-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Crochet Product</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Status Alert</th>
                  <th className="py-3.5 px-4 text-right">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-dark/40">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-gold-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-maroon-950">
                      {it.name}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-500">
                      {it.sku}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-600">
                      {it.category?.name}
                    </td>

                    <td className="py-3.5 px-4 font-serif font-bold text-maroon-900">
                      {formatPrice(it.price)}
                    </td>

                    <td className="py-3.5 px-4">
                      {editingId === it.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-20 bg-ivory-100 border border-gold-500 px-2 py-1 rounded-lg text-xs"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveStock(it.id)}
                            className="p-1 rounded bg-maroon-900 text-gold-200"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-sm text-maroon-950 font-serif">
                          {it.stock} units
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {it.stock <= 5 ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Critical Low Stock</span>
                        </span>
                      ) : it.stock <= 15 ? (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          Reorder Soon
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          Healthy Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {editingId !== it.id && (
                        <button
                          onClick={() => {
                            setEditingId(it.id);
                            setEditStock(it.stock.toString());
                          }}
                          className="px-3 py-1 rounded-lg btn-gold text-[11px] font-semibold shadow-sm"
                        >
                          Edit Stock
                        </button>
                      )}
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
