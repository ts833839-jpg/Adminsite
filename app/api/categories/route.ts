import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { getLiveCatalog } from '@/lib/cloud-catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const live = await getLiveCatalog();
    return NextResponse.json({ categories: live.categories || [] });
  } catch (error) {
    console.error('Categories GET Error:', error);
    return NextResponse.json({ categories: [] });
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
