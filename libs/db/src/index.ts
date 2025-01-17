import { PrismaClient, Prisma } from '@prisma/client'

// Export all types from Prisma client
export * from '@prisma/client'

export type ModelNames = Prisma.ModelName

export type PrismaModels = {
  [M in ModelNames]: Exclude<Awaited<ReturnType<PrismaClient[Uncapitalize<M>]['findUnique']>>, null>
}

export function createPrismaClient(options?: {
  log?: boolean
}) {
  return new PrismaClient({
    log: options?.log ? ['query', 'error', 'warn'] : undefined,
  })
}

export { PrismaClient, Prisma }
