import { vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import type { PrismaClient } from '@prisma/client'

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockDeep<PrismaClient>()),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = mockDeep<PrismaClient>()
