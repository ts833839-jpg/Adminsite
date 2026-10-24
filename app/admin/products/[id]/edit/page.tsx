'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { CategoryType } from '@/types';
import { useToast } from '@/components/providers/ToastProvider';

export default function AdminEditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { success, error } = useToast();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [productSlug, setProductSlug] = useState('');

  // Form Fields (Creation info only, Zero price fixing)
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [careInstructions, setCareInstructions] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products/${id}`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const p = prodData.product;
          setName(p.name);
          setProductSlug(p.slug);
          setSubtitle(p.subtitle || '');
          setCategoryId(p.categoryId);
          setTags(p.tags || '');
          setDescription(p.description || '');
          setMaterials(p.materials || '');
          setDimensions(p.dimensions || '');
          setCareInstructions(p.careInstructions || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      error('Creation title and category are required.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        subtitle: subtitle.trim() || null,
        description: description.trim(),
        categoryId,
        price: 0,
        mrp: 0,
        stock: 1,
        badge: null,
        tags: tags.trim(),
        materials,
        dimensions,
        careInstructions,
      };

      const res = await fetch(`/api/products/${productSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        error('Failed to update creation.');
        setSubmitting(false);
        return;
      }

      success('Creation updated successfully!');
      router.push('/admin/products');
    } catch (err) {
      error('Error updating creation.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-charcoal-500">Loading creation editor...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <Link href="/admin/products" className="text-xs text-charcoal-500 hover:text-maroon-900 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Products</span>
      </Link>

      <div className="border-b border-sand-dark/40 pb-4">
        <span className="text-xs uppercase tracking-widest font-bold text-gold-700">Creation Details Editor</span>
        <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">Edit Handcrafted Creation</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 space-y-4">
          <div>
            <label className="font-semibold text-charcoal-800 block mb-1">Creation Title *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl font-medium font-serif text-sm"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-charcoal-800 block mb-1">Subtitle / Highlight</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-charcoal-800 block mb-1">Crochet Boutique / Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl font-medium"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-charcoal-800 block mb-1">Description / Craft Story</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">Yarn & Materials</label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">Dimensions / Scale</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">Care Instructions</label>
              <input
                type="text"
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 rounded-xl border border-sand-dark text-xs font-semibold text-charcoal-700 hover:bg-gold-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center gap-2"
          >
            {submitting ? 'Updating...' : 'Save Creation Updates'}
            <Check className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
