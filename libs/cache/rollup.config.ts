import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { RollupOptions } from 'rollup'

export default async (config: RollupOptions): Promise<RollupOptions> => {
  return {
    ...config,
    plugins: [
      ...(Array.isArray(config.plugins) ? await Promise.resolve(config.plugins) : []),
      {
        name: 'transform-package-json',
        async writeBundle(options) {
          try {
            const outputDir = (options.dir as string) || 'dist'
            const packageJson = JSON.parse(await readFile('libs/cache/package.json', 'utf8'))

            const transformedPackageJson = {
              ...packageJson,

              types: './index.d.ts',
              main: './index.cjs.js',
              module: './index.esm.js',
              exports: {
                '.': {
                  import: './index.esm.js',
                  require: './index.cjs.js',
                  types: './index.d.ts',
                },
              },
            }

            const outputPath = join(outputDir, 'package.json')
            await writeFile(outputPath, JSON.stringify(transformedPackageJson, null, 2))
          } catch (error) {
            console.error('Failed to process package.json:', error)
            throw error
          }
        },
      },
    ],
  }
}
