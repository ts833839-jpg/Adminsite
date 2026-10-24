import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: { orderBy: { order: 'asc' } },
            category: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category.' }, { status: 500 });
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

    const category = await prisma.category.update({
      where: { slug },
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        bannerImage: body.bannerImage,
        order: body.order !== undefined ? parseInt(body.order, 10) : undefined,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category.' }, { status: 500 });
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
    await prisma.category.delete({ where: { slug } });
    return NextResponse.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}
