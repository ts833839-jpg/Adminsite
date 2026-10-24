import React from 'react';
import prisma from '@/lib/prisma';
import { DreamyHero } from '@/components/home/DreamyHero';
import { CategoryBoutique } from '@/components/home/CategoryBoutique';
import { CuratedCollections } from '@/components/home/CuratedCollections';
import { ArtisanStorySection } from '@/components/home/ArtisanStorySection';
import { CustomerReviews } from '@/components/home/CustomerReviews';

export const dynamic = 'force-dynamic';

async function getHomepageData() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true,
        products: { some: { isActive: true } },
      },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { order: 'asc' },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        images: { some: {} },
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        variants: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    }),
  ]);

  const validCategories = categories.filter(
    (c) => c._count?.products > 0 && c.image && !c.image.includes('placeholder')
  );

  const validProducts = products.filter(
    (p) =>
      p.name &&
      p.images &&
      p.images.length > 0 &&
      p.images[0].url &&
      !p.images[0].url.includes('placeholder')
  );

  return {
    categories: JSON.parse(JSON.stringify(validCategories)),
    products: JSON.parse(JSON.stringify(validProducts)),
  };
}

export default async function HomePage() {
  const { categories, products } = await getHomepageData();

  return (
    <div className="space-y-4">
      {/* Cinematic Dreamy Hero with Luxury Animation */}
      <DreamyHero />

      {/* Editorial Category Showcase */}
      <CategoryBoutique categories={categories} />

      {/* Curated Product Collections with Tabs */}
      <CuratedCollections products={products} />

      {/* Royal Artisan Craftsmanship Storytelling */}
      <ArtisanStorySection />

      {/* Verified Patron Testimonials */}
      <CustomerReviews />
    </div>
  );
}
