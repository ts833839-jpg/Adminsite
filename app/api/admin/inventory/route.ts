import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const inventory = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        stock: true,
        price: true,
        category: { select: { name: true } },
        inventory: true,
      },
      orderBy: { stock: 'asc' },
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { productId, stock, minThreshold, warehouseLocation } = await req.json();

    if (!productId || stock === undefined) {
      return NextResponse.json({ error: 'Product ID and stock are required.' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: parseInt(stock, 10),
        inventory: {
          upsert: {
            create: {
              stock: parseInt(stock, 10),
              minThreshold: minThreshold ? parseInt(minThreshold, 10) : 5,
              warehouseLocation: warehouseLocation || 'Master Atelier Studio',
            },
            update: {
              stock: parseInt(stock, 10),
              minThreshold: minThreshold ? parseInt(minThreshold, 10) : undefined,
              warehouseLocation: warehouseLocation || undefined,
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stock.' }, { status: 500 });
  }
}
