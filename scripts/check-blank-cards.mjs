import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { images: true, category: true }
  });
  console.log('Total products in DB:', products.length);
  const withoutImages = products.filter(p => !p.images || p.images.length === 0);
  console.log('Products without images:', withoutImages.length);
  if (withoutImages.length > 0) {
    console.log('Sample without images:', withoutImages.slice(0, 5).map(p => ({ id: p.id, name: p.name })));
  }

  const withoutDetails = products.filter(p => !p.name || !p.description || !p.price);
  console.log('Products without details:', withoutDetails.length);

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });
  console.log('Total categories:', categories.length);
  for (const c of categories) {
    console.log(`Cat: "${c.name}", image: "${c.image}", products: ${c._count.products}`);
  }

  // Check any placeholder SVGs in product images
  const placeholderImages = await prisma.productImage.findMany({
    where: { url: { contains: 'placeholder' } }
  });
  console.log('Product images with placeholder:', placeholderImages.length);
}

main().finally(() => prisma.$disconnect());
