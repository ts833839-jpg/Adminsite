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
      phone: '+91 98765 43210',
      avatar: '/avatars/admin.svg',
    },
  });

  console.log('✅ Admin credentials updated successfully in dev.db:');
  console.log('👑 Role: ADMIN');
  console.log('📧 Email: ' + updated.email);
  console.log('🔑 Password: rajivani@1993');
}

updateAdmin()
  .catch((err) => {
    console.error('Error updating admin:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
