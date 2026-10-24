import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser(req);

    // Can lookup by either order id or orderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Permission check: only order owner or admin can view
    if (user && user.role !== 'ADMIN' && order.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to view this order.' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch order.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { status, trackingNumber, paymentStatus } = await req.json();

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // If customer, only allow cancellation if still PENDING or CONFIRMED
    if (user.role !== 'ADMIN') {
      if (order.userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
      }
      if (status !== 'CANCELLED') {
        return NextResponse.json({ error: 'Customers can only cancel unfulfilled orders.' }, { status: 400 });
      }
      if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
        return NextResponse.json({ error: 'Cannot cancel an order that has already shipped.' }, { status: 400 });
      }
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: status ? status.toUpperCase() : undefined,
        trackingNumber: trackingNumber ?? undefined,
        paymentStatus: paymentStatus ? paymentStatus.toUpperCase() : undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Order PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}
