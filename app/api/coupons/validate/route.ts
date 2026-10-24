import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'This coupon is invalid or inactive.' }, { status: 404 });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ error: 'This coupon has expired.' }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit.' }, { status: 400 });
    }

    const amount = parseFloat(orderAmount || 0);
    if (amount < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon.` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = Math.min(coupon.discountValue, amount);
    }

    return NextResponse.json({
      success: true,
      coupon,
      calculatedDiscount: Math.round(discount),
    });
  } catch (error) {
    console.error('Coupon Validate Error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon.' }, { status: 500 });
  }
}
