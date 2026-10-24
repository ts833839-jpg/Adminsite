'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { ProductType } from '@/types';

export default function AdminProductsPage() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?limit=100&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you wish to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        success(`Product "${name}" deleted from catalog.`);
        loadProducts();
      } else {
        error('Failed to delete product.');
      }
    } catch (e) {
      error('Error deleting product.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">
            Crochet Products ({products.length})
          </h1>
          <p className="text-xs text-charcoal-500">
            Showcase and manage your handcrafted crochet creations, photos, and craft stories.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Crochet Product</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-gold-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search creations by title, sku, or materials..."
          className="w-full bg-transparent border-none text-xs text-charcoal-900 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-ivory-50 rounded-2xl border border-sand-dark/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-500">
            Loading products catalog...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/30 border-b border-sand-dark text-charcoal-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Creation</th>
                  <th className="py-3 px-3">Boutique / Category</th>
                  <th className="py-3 px-3">Materials</th>
                  <th className="py-3 px-3">Photos</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-dark/40">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gold-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-maroon-950/10 overflow-hidden shrink-0 border border-sand-dark">
                          <img
                            src={p.images?.[0]?.url || '/products/placeholder-royal.svg'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-maroon-950">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-charcoal-500 font-mono">SKU: {p.sku}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-charcoal-700">
                        {p.category?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-charcoal-600 truncate max-w-[180px] block">
                        {p.materials || '100% Handcrafted Yarn'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand/80 text-charcoal-700 font-medium border border-sand-dark/40">
                        {p.images?.length || 0} {p.images?.length === 1 ? 'photo' : 'photos'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-gold-100 text-charcoal-600"
                          title="View Showcase"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-gold-100 text-maroon-900"
                          title="Edit Details"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p.slug, p.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-charcoal-400 hover:text-red-700"
                          title="Delete Creation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
