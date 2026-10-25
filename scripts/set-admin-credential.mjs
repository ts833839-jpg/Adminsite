import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdmin() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('rajivani@1993', salt);

  const updated = await prisma.user.upsert({
    where: { email: 'admin@knotandbloom.com' },
    update: {
      passwordHash,
      name: 'Knot & Bloom Store Manager',
      role: 'ADMIN',
    },
    create: {
      name: 'Knot & Bloom Store Manager',
      email: 'admin@knotandbloom.com',
      passwordHash,
      role: 'ADMIN',
      phone: '+91 9080236848',
      avatar: '/avatars/admin.svg',
    },
  });

  const suresh = await prisma.user.upsert({
    where: { email: 'suresh140105@gmail.com' },
    update: {
      passwordHash,
      name: 'Suresh - Master Artisan Admin',
      role: 'ADMIN',
    },
    create: {
      name: 'Suresh - Master Artisan Admin',
      email: 'suresh140105@gmail.com',
      passwordHash,
      role: 'ADMIN',
      phone: '+91 9080236848',
      avatar: '/avatars/admin.svg',
    },
  });

  console.log('✅ Admin credentials updated successfully in dev.db:');
  console.log('👑 Account 1: admin@knotandbloom.com | rajivani@1993');
  console.log('👑 Account 2: suresh140105@gmail.com | rajivani@1993');
}

updateAdmin()
  .catch((err) => {
    console.error('Error updating admin:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
