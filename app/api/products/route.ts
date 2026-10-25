import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const badge = searchParams.get('badge');
    const isUnder499 = searchParams.get('under499');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'recommended';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      images: { some: {} },
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { subtitle: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { materials: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    if (badge) {
      where.badge = badge.toUpperCase();
    }

    if (isUnder499 === 'true') {
      where.price = { lte: 499 };
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    let orderBy: any = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'popular') {
      orderBy = { reviewCount: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sort === 'discount') {
      orderBy = { discountPercent: 'desc' };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { order: 'asc' } },
          category: { select: { id: true, name: true, slug: true } },
          variants: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Products GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const {
      name,
      subtitle,
      description,
      details,
      materials,
      dimensions,
      careInstructions,
      categoryId,
      price,
      mrp,
      stock,
      sku,
      badge,
      tags,
      images,
      variants,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Name and Category are required.' },
        { status: 400 }
      );
    }

    const slug = slugify(name) + '-' + Math.random().toString(36).substring(2, 6);
    const numPrice = price !== undefined && price !== '' ? parseFloat(price) : 0;
    const numMrp = mrp ? parseFloat(mrp) : numPrice;
    const discountPercent = numMrp > numPrice ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0;

    // Ensure unique SKU
    const baseSku = (sku && sku.trim()) || `KB-CR-${Date.now().toString().slice(-6)}`;
    const existingSku = await prisma.product.findUnique({ where: { sku: baseSku } }).catch(() => null);
    const finalSku = existingSku ? `${baseSku}-${Math.floor(100 + Math.random() * 900)}` : baseSku;

    const productImages = Array.isArray(images) && images.length > 0
      ? images
      : ['/products/placeholder-royal.svg'];

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        subtitle: subtitle || null,
        description: description || '',
        details: typeof details === 'object' ? JSON.stringify(details) : details || null,
        materials: materials || null,
        dimensions: dimensions || null,
        careInstructions: careInstructions || null,
        categoryId,
        price: numPrice,
        mrp: numMrp,
        discountPercent: 0,
        stock: parseInt(stock || '1', 10),
        sku: finalSku,
        badge: null,
        tags: tags || 'crochet, handcrafted',
        isUnder499: false,
        isNewArrival: false,
        images: {
          create: productImages.map((url: string, idx: number) => ({
            url,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
        variants: variants && variants.length > 0 ? {
          create: variants.map((v: any) => ({
            name: v.name,
            sku: v.sku || null,
            price: v.price ? parseFloat(v.price) : null,
            stock: v.stock ? parseInt(v.stock, 10) : 10,
            size: v.size || null,
            color: v.color || null,
            colorHex: v.colorHex || null,
          })),
        } : undefined,
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    // Safely create inventory record (non-blocking)
    try {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          stock: product.stock,
        },
      });
    } catch (invErr) {
      console.warn('Inventory creation skipped:', invErr);
    }

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Products POST Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create product.' },
      { status: 500 }
    );
  }
}
