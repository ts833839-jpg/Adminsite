import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function cleanupMockData() {
  console.log('🧹 Cleaning up mock e-commerce data...');

  // 1. Remove mock orders, items, payments, cart items, coupons, and mock reviews
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();

  // 2. Remove mock customers (keep only admin)
  await prisma.address.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.user.deleteMany({
    where: {
      role: { not: 'ADMIN' },
    },
  });

  // 3. Ensure Admin has the exact password requested: rajivani@1993
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('rajivani@1993', salt);

  await prisma.user.upsert({
    where: { email: 'admin@knotandbloom.com' },
    update: {
      passwordHash,
      role: 'ADMIN',
      name: 'Knot & Bloom Atelier Manager',
    },
    create: {
      name: 'Knot & Bloom Atelier Manager',
      email: 'admin@knotandbloom.com',
      passwordHash,
      role: 'ADMIN',
      phone: '+91 98765 43210',
      avatar: '/avatars/admin.svg',
    },
  });

  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const orderCount = await prisma.order.count();
  const couponCount = await prisma.coupon.count();

  console.log('✅ Cleanup Complete! Database now contains purely authentic data:');
  console.log(`🌸 Handcrafted Crochet Creations: ${productCount}`);
  console.log(`📁 Collections / Categories: ${categoryCount}`);
  console.log(`📦 Mock Orders remaining: ${orderCount} (0)`);
  console.log(`🎟️ Mock Coupons remaining: ${couponCount} (0)`);
  console.log('👑 Admin email: admin@knotandbloom.com');
  console.log('🔑 Admin password: rajivani@1993');
}

cleanupMockData()
  .catch((err) => {
    console.error('Error during cleanup:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
