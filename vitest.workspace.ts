// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './shared/vitest.shared.config.ts',
    test: {
      name: 'api',
      root: './api',
    },
  },
  {
    extends: './shared/vitest.shared.config.ts',
    test: {
      name: 'website',
      root: './apps/website',
    },
  },
  {
    extends: './shared/vitest.shared.config.ts',
    test: {
      name: 'app',
      root: './apps/app',
    },
  },
  {
    extends: './shared/vitest.shared.config.ts',
    test: {
      name: 'admin',
      root: './apps/admin',
    },
  },
  {
    extends: './shared/vitest.shared.config.ts',
    test: {
      name: '@astronera/auth',
      root: './apps/auth',
    },
  },
])
