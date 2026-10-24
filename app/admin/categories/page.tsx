'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit, Trash2, Check } from 'lucide-react';
import { CategoryType } from '@/types';
import { useToast } from '@/components/providers/ToastProvider';

export default function AdminCategoriesPage() {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/products/placeholder-royal.svg');
  const [showModal, setShowModal] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), image }),
      });

      if (!res.ok) {
        error('Failed to create category.');
        return;
      }

      success(`Crochet category "${name}" created!`);
      setName('');
      setDescription('');
      setShowModal(false);
      loadCategories();
    } catch (err) {
      error('Error creating category.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700">Boutique Taxonomy</span>
          <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">Categories Management</h1>
          <p className="text-xs text-charcoal-500">Organize your crochet pieces into beautiful editorial departments.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Category</span>
        </button>
      </div>

      <div className="bg-ivory-50 rounded-2xl border border-sand-dark/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand/30 border-b border-sand-dark text-charcoal-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-dark/40">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gold-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-sm text-maroon-950">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-500">
                    {c.slug}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-600 max-w-xs truncate">
                    {c.description || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-maroon-900 bg-gold-100 px-2 py-0.5 rounded-full">
                      {c._count?.products || 0} items
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory-50 rounded-2xl max-w-md w-full p-6 border border-gold-500/40 shadow-royal-lg space-y-4">
            <h3 className="font-serif text-xl font-bold text-maroon-950">Add Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Crochet Flowers & Bouquets"
                  className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Artisan hand-hooked blooms for everlasting joy..."
                  className="w-full bg-ivory-100 border border-sand-dark px-3 py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Image URL / File Path</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
