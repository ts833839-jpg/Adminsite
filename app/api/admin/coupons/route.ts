import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const {
      code,
      description,
      discountType = 'PERCENTAGE',
      discountValue,
      minOrderAmount = 0,
      maxDiscountAmount,
      usageLimit,
      expiresAt,
    } = await req.json();

    if (!code || discountValue === undefined) {
      return NextResponse.json({ error: 'Code and discount value are required.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists.' }, { status: 409 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: parseFloat(minOrderAmount || 0),
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create coupon.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Coupon ID is required.' }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Coupon deleted.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete coupon.' }, { status: 500 });
  }
}
