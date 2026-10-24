import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('✨ Starting Knot & Bloom Portfolio Import with 100% Real User Images...');

  const catalog = JSON.parse(fs.readFileSync('D:/Ramazon/scripts/catalog-data.json', 'utf8'));

  // 1. Ensure Admin credential exists with rajivani@1993
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('rajivani@1993', salt);

  await prisma.user.upsert({
    where: { email: 'admin@knotandbloom.com' },
    update: {
      passwordHash: adminPasswordHash,
      name: 'Knot & Bloom Store Manager',
      role: 'ADMIN',
    },
    create: {
      name: 'Knot & Bloom Store Manager',
      email: 'admin@knotandbloom.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+91 98765 43210',
      avatar: '/avatars/admin.svg',
    },
  });

  // 2. Categories setup
  const categoriesDefinition = [
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
  for (const cat of categoriesDefinition) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        order: cat.order,
      },
      create: cat,
    });
    categoryMap[cat.slug] = record.id;
  }

  // 3. Clear old dummy products
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  console.log('Cleared previous placeholder products.');

  // 4. Insert all 60 products with their verified images
  let totalImagesInserted = 0;
  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const categoryId = categoryMap[item.categorySlug];
    if (!categoryId) {
      throw new Error(`Category not found for slug: ${item.categorySlug}`);
    }

    const skuNumber = String(i + 1).padStart(3, '0');
    const sku = `KNB-${item.categorySlug.split('-')[1]?.toUpperCase() || 'PROD'}-${skuNumber}`;

    const product = await prisma.product.create({
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

    totalImagesInserted += item.images.length;
    console.log(`[${i + 1}/60] Created product: "${product.name}" (${item.images.length} images)`);
  }

  console.log(`\n🎉 Portfolio import complete!`);
  console.log(`- Total products inserted: ${catalog.length}`);
  console.log(`- Total ProductImage records created: ${totalImagesInserted}`);
  console.log(`- Admin account ready: admin@knotandbloom.com / rajivani@1993`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
