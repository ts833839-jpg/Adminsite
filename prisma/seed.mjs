import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('✨ Starting Knot & Bloom database seeding (Exclusively Handcrafted Crochet Portfolio)...');

  // Clear existing data to allow clean re-runs
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // 1. Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('rajivani@1993', salt);
  const customerPassword = await bcrypt.hash('Customer@1234', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'Knot & Bloom Store Manager',
      email: 'admin@knotandbloom.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '+91 98765 43210',
      avatar: '/avatars/admin.svg',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@knotandbloom.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      phone: '+91 98111 22334',
      avatar: '/avatars/priya.svg',
    },
  });

  // Default address for customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Priya Sharma',
      phone: '+91 98111 22334',
      street: 'Flat 402, Lotus Palace Apartments, C-Scheme',
      landmark: 'Near Statue Circle',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302001',
      country: 'India',
      isDefault: true,
    },
  });

  // 2. Categories setup
  const categoriesData = [
    {
      name: 'Crochet Wear & Heirloom Dresses',
      slug: 'crochet-wear',
      description: 'Regal baby dresses, hand-hooked rompers, heirloom layettes, winter warmers, and festival shrugs.',
      image: '/products/gallery/colorful-crocheted-toddler-dress-front-and-back-4.png',
      order: 1,
    },
    {
      name: 'Crochet Keychains & Charms',
      slug: 'crochet-keychains',
      description: 'Charming botanical grape duos, citrus lemons, tropical pineapples, rosebuds, and flower bouquet keepsakes.',
      image: '/products/gallery/crocheted-grape-duo-keychain-3.png',
      order: 2,
    },
    {
      name: 'Crochet Bags & Potlis',
      slug: 'crochet-bags',
      description: 'Artisan drawstring pouches, retro granny square bags, festive wristlet potlis, and crossbody festival slings.',
      image: '/products/gallery/teal-and-mint-crochet-wall-hanging-bag-7.png',
      order: 3,
    },
    {
      name: 'Crochet Home & Mandalas',
      slug: 'crochet-home',
      description: 'Jaipur heritage multi-petal flower mats, scalloped oval rugs, intricate lace doilies, and hanging vine decor.',
      image: '/products/gallery/emerald-and-magenta-crochet-flower-mat.png',
      order: 4,
    },
    {
      name: 'Crochet Accessories & Hair Accents',
      slug: 'crochet-accessories',
      description: 'Pastel blossom hair clips, textured wool hair scrunchies, and bespoke hand-knitted wearable accents.',
      image: '/products/gallery/pastel-crochet-floral-hair-clip-2.png',
      order: 5,
    },
    {
      name: 'Crochet Flowers & Botanicals',
      slug: 'crochet-flowers',
      description: 'Everlasting three-dimensional cabbage roses, delicate floral posies, and heirloom botanical blooms.',
      image: '/products/gallery/crocheted-white-and-yellow-rose-2.png',
      order: 6,
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = record.id;
  }

  // 3. Load 60 Authentic Handcrafted Creations from catalog-data.json
  const catalogPath = path.join(process.cwd(), 'scripts', 'catalog-data.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  let totalImagesCount = 0;
  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const categoryId = categoryMap[item.categorySlug];
    if (!categoryId) {
      throw new Error(`Category not found for slug: ${item.categorySlug}`);
    }

    const skuNumber = String(i + 1).padStart(3, '0');
    const sku = `KNB-${item.categorySlug.split('-')[1]?.toUpperCase() || 'PROD'}-${skuNumber}`;

    await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        subtitle: item.subtitle,
        description: item.description,
        details: item.details,
        materials: item.materials,
        dimensions: item.dimensions,
        careInstructions: item.careInstructions,
        categoryId: categoryId,
        price: item.price,
        mrp: item.mrp,
        discountPercent: item.discountPercent,
        stock: 12,
        sku: sku,
        rating: 4.9,
        reviewCount: 0,
        isActive: true,
        isFeatured: item.isFeatured || false,
        isTrending: item.isTrending || false,
        isNewArrival: item.isNewArrival || false,
        isBestSeller: item.isBestSeller || false,
        badge: item.badge || null,
        tags: item.tags || 'crochet,handmade,knot and bloom',
        images: {
          create: item.images.map((im, idx) => ({
            url: im.url,
            alt: im.alt || item.name,
            isPrimary: im.isPrimary ?? (idx === 0),
            order: im.order ?? idx,
          })),
        },
      },
    });

    totalImagesCount += item.images.length;
  }

  console.log(`\n🎉 Knot & Bloom database seeding completed successfully!`);
  console.log(`- Categories: ${categoriesData.length}`);
  console.log(`- Products: ${catalog.length}`);
  console.log(`- Product Images: ${totalImagesCount} (100% real user images)`);
  console.log(`- Admin credential: admin@knotandbloom.com / rajivani@1993`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
