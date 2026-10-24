import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to view orders.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    }
    if (status) {
      where.status = status.toUpperCase();
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod = 'UPI',
      couponCode,
      customerNotes,
      guestInfo,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.postalCode) {
      return NextResponse.json({ error: 'Valid delivery address is required.' }, { status: 400 });
    }

    let user = await getCurrentUser(req);
    // If guest, create or find user
    if (!user) {
      const email = guestInfo?.email?.trim().toLowerCase() || `guest-${Date.now()}@knotandbloom.com`;
      const name = guestInfo?.name || shippingAddress.fullName;
      let existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        existing = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash: 'guest-no-password',
            phone: shippingAddress.phone || null,
            role: 'CUSTOMER',
          },
        });
      }
      user = existing;
    }

    // Calculate subtotal & verify stock
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: { where: { isPrimary: true } } },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Available: ${product.stock}` },
          { status: 400 }
        );
      }

      const price = item.variant?.price || product.price;
      subtotal += price * item.quantity;

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        productImage: item.product?.images?.[0]?.url || product.images[0]?.url || '/products/placeholder-royal.svg',
        price,
        quantity: item.quantity,
        variantName: item.variant?.name || null,
      });

      // Decrement stock
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Handle Coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    const shippingFee = subtotal >= 999 ? 0 : 79;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
    const orderNumber = `RMZ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `DTDC-RMZ-${Math.floor(1000000 + Math.random() * 9000000)}IN`;

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'CONFIRMED',
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount: 0,
        totalAmount,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        trackingNumber,
        estimatedDeliveryDate: estimatedDelivery,
        shippingAddressSnapshot: JSON.stringify(shippingAddress),
        customerNotes: customerNotes || null,
        items: {
          create: orderItemsData,
        },
        payments: {
          create: {
            amount: totalAmount,
            currency: 'INR',
            status: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
            method: paymentMethod,
            transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            paymentGateway: 'MOCK_GATEWAY',
          },
        },
      },
      include: {
        items: true,
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Order Confirmed!',
        message: `Your order #${orderNumber} for ₹${totalAmount} has been confirmed and placed with our royal artisans.`,
        type: 'ORDER',
        link: `/account/orders/${order.id}`,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}
