'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SlidersHorizontal,
  ChevronRight,
  Search,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  ArrowUpDown,
  FilterX,
} from 'lucide-react';
import { ProductType, CategoryType } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { QuickViewModal } from '@/components/products/QuickViewModal';
import { Suspense } from 'react';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductType | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter States from URL or defaults
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialUnder499 = searchParams.get('under499') === 'true';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialUnder499 ? [0, 499] : [0, 5000]
  );
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Fetch Categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const q = searchParams.get('search') || '';
    const u499 = searchParams.get('under499') === 'true';

    setSelectedCategory(cat);
    setSearchQuery(q);
    if (u499) {
      setPriceRange([0, 499]);
    }
  }, [searchParams]);

  // Fetch Products based on current filters
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (searchQuery) params.set('search', searchQuery);
        if (sortBy) params.set('sort', sortBy);
        params.set('limit', '100');

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const valid = (data.products || []).filter(
            (p: any) =>
              p &&
              p.name &&
              p.images &&
              p.images.length > 0 &&
              p.images[0]?.url &&
              !p.images[0].url.includes('placeholder')
          );
          setProducts(valid);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadProducts, 100);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('recommended');
    router.push('/shop');
  };

  const currentCategoryName = categories.find((c) => c.slug === selectedCategory)?.name || 'All Collections';

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-charcoal-500 mb-3">
          <Link href="/" className="hover:text-maroon-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gold-500" />
          <Link href="/shop" className="hover:text-maroon-900 transition-colors">
            Portfolio
          </Link>
          {selectedCategory && (
            <>
              <ChevronRight className="w-3 h-3 text-gold-500" />
              <span className="text-maroon-900 font-semibold">{currentCategoryName}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-dark/40 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? currentCategoryName : 'Handcrafted Creations Portfolio'}
            </h1>
            <p className="text-xs text-charcoal-600 mt-1 font-light">
              Exclusively handcrafted crochet creations, hooked with pure organic yarn and devoted artistry. Inquire directly to order any piece.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-ivory-50 border border-sand-dark rounded-xl text-xs font-semibold text-maroon-900 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              <span>Boutiques</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-charcoal-500 hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-ivory-50 border border-sand-dark text-xs font-medium text-maroon-950 rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500 shadow-sm"
              >
                <option value="recommended">Featured Creations</option>
                <option value="newest">Newest Additions</option>
                <option value="popular">Most Inquired</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Atelier Contact Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-maroon-950 via-charcoal-900 to-maroon-950 text-ivory-100 border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
          <span className="font-serif text-gold-200 font-semibold tracking-wide">
            To place an order or commission custom colors/sizes:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <a
            href="tel:+919080236848"
            className="flex items-center gap-1.5 text-gold-300 hover:text-gold-200 font-bold"
          >
            <span>📞 9080236848</span>
          </a>
          <span className="text-gold-500/40">|</span>
          <a
            href="https://wa.me/919080236848?text=Hello,%20I%20would%20like%20to%20inquire%20about%20ordering%20a%20handcrafted%20crochet%20piece."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:underline font-bold"
          >
            <span>💬 WhatsApp</span>
          </a>
          <span className="text-gold-500/40">|</span>
          <a
            href="mailto:suresh140105@gmail.com"
            className="text-ivory-300 hover:text-gold-300 hover:underline"
          >
            <span>✉ suresh140105@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex gap-8 items-start">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
          onReset={handleResetFilters}
          isMobileOpen={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />

        {/* Right Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Active Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-ivory-50/70 p-3.5 rounded-xl border border-sand-dark/30 text-xs">
            <span className="font-medium text-charcoal-700">
              Showing <strong className="text-maroon-900 font-bold">{products.length}</strong> handcrafted creations
            </span>

            <div className="flex items-center gap-2">
              {(selectedCategory || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-rose-deep font-semibold hover:underline flex items-center gap-1"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-ivory-50 rounded-2xl h-96 border border-sand-dark/40" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-ivory-50 rounded-2xl border border-sand-dark/40 p-8 space-y-4">
              <span className="text-3xl text-gold-600 font-serif">⚜</span>
              <h3 className="font-serif text-2xl font-bold text-maroon-950">
                “We couldn’t find that treasure.”
              </h3>
              <p className="text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
                Try adjusting your search keywords, clearing your price filters, or exploring our popular categories.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Popover Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory-100 flex items-center justify-center py-24">
          <div className="text-center space-y-3">
            <span className="text-3xl text-gold-600 font-serif animate-spin inline-block">⚜</span>
            <p className="font-serif text-lg text-maroon-950 font-bold">Opening Royal Crochet Boutique...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

