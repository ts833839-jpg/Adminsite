import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query || query.length < 2) {
      // Return popular crochet search trends
      return NextResponse.json({
        suggestions: [
          'Crochet Lotus Keychain',
          'Crochet Palace Potli Bag',
          'Crochet Rose Bouquet',
          'Crochet Burgundy Shrug',
          'Crochet Mandala Coasters',
          'Crochet Elephant Amigurumi',
          'Under 499 Crochet',
        ],
        categories: [
          { name: 'Crochet Keychains & Charms', slug: 'crochet-keychains' },
          { name: 'Crochet Bags & Potlis', slug: 'crochet-bags' },
          { name: 'Crochet Wear & Shrugs', slug: 'crochet-wear' },
          { name: 'Crochet Flowers & Bouquets', slug: 'crochet-flowers' },
        ],
        products: [],
      });
    }

    const [matchedProducts, matchedCategories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { subtitle: { contains: query } },
            { tags: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          mrp: true,
          badge: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
        take: 6,
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: query },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 4,
      }),
    ]);

    const suggestions = Array.from(
      new Set([
        ...matchedCategories.map((c) => c.name),
        ...matchedProducts.map((p) => p.name),
      ])
    ).slice(0, 8);

    return NextResponse.json({
      suggestions,
      categories: matchedCategories,
      products: matchedProducts,
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Search failed.' }, { status: 500 });
  }
}
