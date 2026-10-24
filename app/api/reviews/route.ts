import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { productId, rating, title, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product ID, rating (1-5) and comment are required.' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user!.id,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        title: title || null,
        comment: comment.trim(),
        isVerifiedPurchase: true,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error('Review POST Error:', error);
    return NextResponse.json({ error: 'Failed to post review.' }, { status: 500 });
  }
}
