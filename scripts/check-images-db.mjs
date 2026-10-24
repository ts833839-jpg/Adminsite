import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const prod = await prisma.product.findUnique({
    where: { slug: 'heirloom-blue-white-striped-crochet-baby-romper' },
    include: { images: true },
  });
  console.log('Romper images:', prod?.images);

  const cerulean = await prisma.product.findUnique({
    where: { slug: 'cerulean-bloom-crochet-baby-cardigan-pant-set' },
    include: { images: true },
  });
  console.log('Cerulean images:', cerulean?.images);
}

main().finally(() => prisma.$disconnect());
