import { PrismaClient, Prisma } from './generated/client'

// Export all types from Prisma client
export * from '@prisma/client'
export * from './generated/client'

// Explicitly export ErrorSeverity
export { ErrorSeverity } from './generated/client'

export type ModelNames = Prisma.ModelName // "User" | "Post"

export type PrismaModels = {
  [M in ModelNames]: Exclude<Awaited<ReturnType<PrismaClient[Uncapitalize<M>]['findUnique']>>, null>
}

// Export main classes
export { Prisma, PrismaClient }

// You can export a function to create a configured client
export function createPrismaClient(options?: {
  log?: boolean
  // other config options
}) {
  return new PrismaClient({
    log: options?.log ? ['query', 'error', 'warn'] : undefined,
    // other options
  })
}
