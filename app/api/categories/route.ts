import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categoriesRaw = await prisma.category.findMany({
      where: {
        isActive: true,
        products: { some: { isActive: true } },
      },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { order: 'asc' },
    });
    const categories = categoriesRaw.filter(
      (c) => c._count.products > 0 && c.image && !c.image.includes('placeholder')
    );
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { name, description, image, bannerImage, order } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const slug = slugify(name);
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || '/products/placeholder-royal.svg',
        bannerImage: bannerImage || null,
        order: order !== undefined ? parseInt(order, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('Categories POST Error:', error);
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  }
}
