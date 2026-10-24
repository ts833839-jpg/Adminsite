import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const [
      totalProducts,
      totalCategories,
      totalInquiries,
      newInquiries,
      recentInquiries,
      categories,
      recentCreations,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
      prisma.inquiry.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          category: { select: { name: true } },
          images: { select: { url: true }, take: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalInquiries,
      newInquiries,
      recentInquiries,
      categories,
      recentCreations,
    });
  } catch (error) {
    console.error('Admin Overview Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin portfolio overview' },
      { status: 500 }
    );
  }
}
