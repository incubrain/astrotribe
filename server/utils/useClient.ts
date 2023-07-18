import { PrismaClient } from '@prisma/client'

let prisma

export default () => {
  // check if instance already exists
  if (process.env.NODE_ENV === 'production') {
    if (!prisma) {
      prisma = new PrismaClient()
    }
  } else {
    // for development and testing environments
    // prevent hot-reloading from creating new instances
    prisma = new PrismaClient()
  }
  return prisma as PrismaClient
}
