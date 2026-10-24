'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft, Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { CategoryType } from '@/types';
import { useToast } from '@/components/providers/ToastProvider';

export default function AdminNewProductPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields (Only Product Details, Zero Price Fixing)
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sku, setSku] = useState('');
  const [tags, setTags] = useState('crochet, handcrafted, bespoke');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('100% Combed Cotton Yarn, Fine Metallic Accents');
  const [dimensions, setDimensions] = useState('Standard artisan scale');
  const [careInstructions, setCareInstructions] = useState('Gentle cold handwash, dry flat in shade');

  // Images list
  const [images, setImages] = useState<string[]>(['/products/gallery/emerald-and-magenta-crochet-flower-mat.png']);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          if (data.categories?.[0]) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadCategories();
    setSku(`KB-CR-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      error('Creation title and category are required.');
      return;
    }

    if (images.length === 0) {
      error('Please include at least one creation photo.');
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
        sku: sku.trim(),
        badge: null,
        tags: tags.trim(),
        materials,
        dimensions,
        careInstructions,
        images,
        variants: [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Failed to create product.');
        setSubmitting(false);
        return;
      }

      success(`Handcrafted creation "${name}" published to portfolio!`);
      router.push('/admin/products');
    } catch (err) {
      error('Error creating creation.');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Breadcrumb Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-charcoal-500 mb-2">
          <Link href="/admin/products" className="hover:text-maroon-900 transition-colors">
            Portfolio Management
          </Link>
          <ChevronRight className="w-3 h-3 text-gold-500" />
          <span className="text-maroon-900 font-semibold">Add New Creation</span>
        </nav>

        <div className="flex items-center justify-between border-b border-sand-dark/40 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-maroon-950">
              Publish Handcrafted Creation
            </h1>
            <p className="text-xs text-charcoal-600 mt-1 font-light">
              Add photographs and atelier craft details for display in the Knot & Bloom bespoke portfolio.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sand-dark text-xs font-semibold text-charcoal-700 hover:bg-gold-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Basic Details */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-maroon-950 pb-2 border-b border-sand-dark/30">
            1. Creation Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">
                Creation Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vintage Lilac Blossom Buttoned Pouch"
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500 font-serif font-bold text-sm"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">
                Subtitle / Yarn Highlight
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Hand-hooked in soft cotton with floral rosette closure"
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">
                Crochet Boutique / Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl font-medium text-charcoal-900 focus:outline-none focus:border-gold-500"
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
              <label className="font-semibold text-charcoal-800 block mb-1">
                SKU / Reference Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl font-mono text-charcoal-900 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Creation Images */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sand-dark/30">
            <h3 className="font-serif text-lg font-bold text-maroon-950">
              2. Photography & Angles
            </h3>
            <span className="text-[11px] text-charcoal-500">
              URLs or file paths in /products/gallery/
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="e.g. /products/gallery/blue-and-white-crocheted-baby-romper-11.png"
              className="flex-1 bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500 font-mono text-[11px]"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2.5 rounded-xl btn-gold font-semibold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Image</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-xl border border-gold-500/30 overflow-hidden bg-maroon-950/10 group"
              >
                <img src={img} alt="Creation preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-charcoal-950/80 text-gold-300 text-[9px] font-mono">
                  {idx === 0 ? 'Primary' : `#${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Craft Specifications & Story */}
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/50 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-maroon-950 pb-2 border-b border-sand-dark/30">
            3. Craft Story & Specifications
          </h3>

          <div>
            <label className="font-semibold text-charcoal-800 block mb-1">
              Description / Artisan Notes
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the stitch pattern, inspiration, texture, and care taken..."
              className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">
                Yarn & Materials Used
              </label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">
                Dimensions / Scale
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">
                Care Instructions
              </label>
              <input
                type="text"
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal-800 block mb-1">
                Search Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-ivory-100 border border-sand-dark px-3.5 py-2.5 rounded-xl text-charcoal-900 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Form Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl border border-sand-dark text-xs font-semibold text-charcoal-700 hover:bg-gold-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow flex items-center gap-2"
          >
            {submitting ? 'Publishing...' : 'Publish Creation to Portfolio'}
            <Check className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
