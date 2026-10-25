import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl) {
    if (envUrl.startsWith('file:')) {
      const clean = envUrl.replace(/^file:/, '').replace(/^\.\//, '');
      if (clean === 'dev.db' || clean.endsWith('/dev.db') || clean.endsWith('\\dev.db')) {
        const inPrisma = path.resolve(process.cwd(), 'prisma', 'dev.db');
        return `file:${inPrisma}`;
      }
      return `file:${path.resolve(process.cwd(), clean)}`;
    }
    return envUrl;
  }
  const defaultPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
  return `file:${defaultPath}`;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
