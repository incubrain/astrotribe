import { vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import type { PrismaClient } from '@astronera/db'

vi.mock('@astronera/db', () => ({
  PrismaClient: vi.fn(() => mockDeep<PrismaClient>()),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = mockDeep<PrismaClient>()
