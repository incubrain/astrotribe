// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.shared.config.ts',
    test: {
      name: 'website',
      root: './apps/website',
    },
  },
  {
    extends: './vitest.shared.config.ts',
    test: {
      name: 'main-app',
      root: './apps/main-app',
    },
  },
  {
    extends: './vitest.shared.config.ts',
    test: {
      name: 'admin-dashboard',
      root: './apps/admin-dashboard',
    },
  },
  {
    extends: './vitest.shared.config.ts',
    test: {
      name: 'auth-service',
      root: './apps/auth-service',
    },
  },
])
