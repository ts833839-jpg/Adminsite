import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const images = await prisma.productImage.findMany({
    select: { url: true, isPrimary: true, product: { select: { name: true } } },
  });

  console.log(`Checking HTTP status for ${images.length} product images in database...`);

  let successCount = 0;
  let failedCount = 0;

  for (const img of images) {
    try {
      const res = await fetch(`http://localhost:3000${img.url}`);
      if (res.status === 200) {
        successCount++;
      } else {
        console.error(`❌ FAILED (${res.status}): ${img.url} for "${img.product.name}"`);
        failedCount++;
      }
    } catch (err) {
      console.error(`❌ ERROR: ${img.url} - ${err.message}`);
      failedCount++;
    }
  }

  console.log(`\nResults:`);
  console.log(`- Successfully served (HTTP 200): ${successCount}/${images.length}`);
  console.log(`- Failed: ${failedCount}`);
  if (failedCount === 0) {
    console.log(`🌟 100% of all product images in the database are active, verified and serving!`);
  }
}

main().finally(() => prisma.$disconnect());
