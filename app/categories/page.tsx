import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  let categories: any[] = [];
  try {
    const categoriesRaw = await prisma.category.findMany({
      where: {
        isActive: true,
        products: { some: { isActive: true } },
      },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { order: 'asc' },
    });

    categories = categoriesRaw.filter(
      (cat) => cat._count.products > 0 && cat.image && !cat.image.includes('placeholder')
    );
  } catch (err) {
    console.warn('Categories query error, using static fallback:', err);
    const staticData = await import('@/lib/catalog-static.json');
    categories = (staticData.categories || []) as any[];
  }

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-maroon-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-gold-500" />
        <span className="text-maroon-900 font-semibold">Crochet Categories</span>
      </nav>

      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold text-gold-700">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Heirloom Collections</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
          Curated Crochet Boutiques
        </h1>
        <p className="text-sm text-charcoal-600 font-light leading-relaxed">
          From auspicious royal lotus keychains to bridal potlis and everlasting floral bouquets, discover every facet of Indian crochet artistry.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative bg-ivory-50 rounded-2xl overflow-hidden border border-sand-dark/50 shadow-sm hover:shadow-royal-lg hover:border-gold-400 transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-maroon-950/10">
              <img
                src={cat.image || '/products/placeholder-royal.svg'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-maroon-950/20 to-transparent" />
              <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-ivory-50/90 text-maroon-950 border border-gold-400/40 shadow-sm">
                {cat._count.products} Treasures
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-maroon-950 group-hover:text-gold-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal-600 mt-2 leading-relaxed font-light line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sand-dark/40 flex items-center justify-between text-xs font-semibold text-gold-700 group-hover:text-maroon-900 transition-colors">
                <span>Explore Boutique</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
