import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { order: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }),
  ]);

  fs.writeFileSync(
    'lib/catalog-static.json',
    JSON.stringify({ categories, products }, null, 2)
  );
  console.log(`Successfully exported ${categories.length} categories and ${products.length} products to lib/catalog-static.json`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
