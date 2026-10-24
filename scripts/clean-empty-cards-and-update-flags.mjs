import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning empty categories ---');
  // Delete categories that have 0 products
  const deletedCats = await prisma.category.deleteMany({
    where: {
      products: {
        none: {},
      },
    },
  });
  console.log(`Deleted ${deletedCats.count} empty categories.`);

  // Update categories to ensure they all have valid photos from gallery
  const categoryImageUpdates = {
    'crochet-wear': '/products/gallery/colorful-crocheted-toddler-dress-front-and-back-4.png',
    'crochet-keychains': '/products/gallery/crocheted-grape-duo-keychain-3.png',
    'crochet-bags': '/products/gallery/teal-and-mint-crochet-wall-hanging-bag-7.png',
    'crochet-home': '/products/gallery/emerald-and-magenta-crochet-flower-mat.png',
    'crochet-accessories': '/products/gallery/pastel-crochet-floral-hair-clip-2.png',
    'crochet-flowers': '/products/gallery/crocheted-white-and-yellow-rose-2.png',
  };

  for (const [slug, img] of Object.entries(categoryImageUpdates)) {
    await prisma.category.updateMany({
      where: { slug },
      data: { image: img, isActive: true },
    });
  }

  // Ensure all 60 products have good distribution of badges and flags so no collection tab is sparse
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Auditing ${products.length} products...`);
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    // Distribute badges: BESTSELLER, TRENDING, NEW, LIMITED, BESPOKE
    let badge = p.badge;
    let isBestSeller = p.isBestSeller;
    let isTrending = p.isTrending;
    let isNewArrival = p.isNewArrival;
    let isFeatured = p.isFeatured;

    if (i % 4 === 0) {
      badge = 'BESTSELLER';
      isBestSeller = true;
    } else if (i % 4 === 1) {
      badge = 'TRENDING';
      isTrending = true;
    } else if (i % 4 === 2) {
      badge = 'NEW';
      isNewArrival = true;
    } else {
      badge = 'LIMITED';
      isFeatured = true;
    }

    await prisma.product.update({
      where: { id: p.id },
      data: {
        badge,
        isBestSeller,
        isTrending,
        isNewArrival,
        isFeatured,
      },
    });
  }

  const remainingCats = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  console.log('Remaining categories count:', remainingCats.length);
  remainingCats.forEach((c) =>
    console.log(`- ${c.name} (${c.slug}): ${c._count.products} products | ${c.image}`)
  );
}

main().finally(() => prisma.$disconnect());
