// apps/admin/vitest.setup.ts
import { vi } from 'vitest'

// Mock Supabase Client
vi.mock('#imports', async () => {
  const actual = await vi.importActual<object>('#imports')
  return {
    ...actual,
    useSupabaseClient: () => ({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: {
            session: {
              user: {
                id: 'e8976b16-02a9-4595-a8a9-6457548eec12',
                app_metadata: { role: 'user', plan: 'free' },
              },
            },
          },
          error: null,
        }),
      },
    }),
  }
})

// Mock PostHog
vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    debug: vi.fn(),
    capture: vi.fn(),
  },
}))


// Mock `navigateTo`
vi.mock('#app', async () => {
  const actual = await vi.importActual<object>('#app')
  return {
    ...actual,
    navigateTo: vi.fn(),
  }
})
