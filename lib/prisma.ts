import { PrismaClient } from '@prisma/client';
import { serverEnv } from './env/server';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: serverEnv.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: serverEnv.DATABASE_URL,
      },
    },
  });

if (serverEnv.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;