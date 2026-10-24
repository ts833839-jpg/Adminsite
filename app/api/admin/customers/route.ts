import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      joinedAt: c.createdAt,
      orderCount: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + o.totalAmount, 0),
      lastOrderDate: c.orders[0]?.createdAt || null,
      address: c.addresses[0] ? `${c.addresses[0].city}, ${c.addresses[0].state}` : 'Not provided',
    }));

    return NextResponse.json({ customers: formatted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers.' }, { status: 500 });
  }
}
