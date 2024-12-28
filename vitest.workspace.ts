// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.shared.config.ts',
    test: {
      name: 'api',
      root: './api',
    },
  },
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
      name: 'app',
      root: './apps/app',
    },
  },
  {
    extends: './vitest.shared.config.ts',
    test: {
      name: 'admin',
      root: './apps/admin',
    },
  },
  {
    extends: './vitest.shared.config.ts',
    test: {
      name: '@astronera/auth',
      root: './apps/auth',
    },
  },
])
