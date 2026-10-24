import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.inquiry.deleteMany();
  const count = await prisma.inquiry.count();
  console.log('✅ Clean slate verified: Total inquiries in database:', count);
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
