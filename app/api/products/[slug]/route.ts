import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        variants: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // Fetch related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
      },
      take: 4,
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error('Product Detail GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { slug } = params;
    const body = await req.json();

    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const price = body.price !== undefined ? parseFloat(body.price) : existing.price;
    const mrp = body.mrp !== undefined ? parseFloat(body.mrp) : existing.mrp;
    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
        name: body.name ?? existing.name,
        subtitle: body.subtitle ?? existing.subtitle,
        description: body.description ?? existing.description,
        details: body.details !== undefined ? (typeof body.details === 'object' ? JSON.stringify(body.details) : body.details) : existing.details,
        materials: body.materials ?? existing.materials,
        dimensions: body.dimensions ?? existing.dimensions,
        careInstructions: body.careInstructions ?? existing.careInstructions,
        categoryId: body.categoryId ?? existing.categoryId,
        price,
        mrp,
        discountPercent,
        stock: body.stock !== undefined ? parseInt(body.stock, 10) : existing.stock,
        isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
        isTrending: body.isTrending !== undefined ? body.isTrending : existing.isTrending,
        isNewArrival: body.isNewArrival !== undefined ? body.isNewArrival : existing.isNewArrival,
        isBestSeller: body.isBestSeller !== undefined ? body.isBestSeller : existing.isBestSeller,
        badge: body.badge !== undefined ? body.badge : existing.badge,
        tags: body.tags ?? existing.tags,
      },
      include: {
        images: true,
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Product PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { slug } = params;
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    console.error('Product DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}
