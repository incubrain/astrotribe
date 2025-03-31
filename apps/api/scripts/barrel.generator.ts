import { fileURLToPath } from 'url'
import * as fs from 'fs'
import * as path from 'path'
import { CustomLogger } from '../src/core/logger/custom.logger'

interface BarrelConfig {
  rootDir: string
  directories: string[]
  extensions?: string[]
  ignorePatterns?: string[]
  generateNestedBarrels?: boolean
  excludeDirs?: string[]
}

export class BarrelGenerator {
  private readonly logger: CustomLogger
  private readonly defaultExtensions = ['.ts', '.tsx'] as const
  private readonly defaultIgnorePatterns = [
    '.module',
    '.module.ts',
    '.spec.ts',
    '.test.ts',
    '.e2e-spec.ts',
    '.d.ts',
    'index.ts',
  ] as const
  private readonly defaultExcludeDirs = ['__tests__', 'dist', 'node_modules'] as const

  constructor(logger: CustomLogger) {
    this.logger = logger
    this.logger.setContext('BarrelGenerator')
  }

  private isDirectoryExcluded(dirPath: string, excludeDirs: string[]): boolean {
    return excludeDirs.some(
      (excludeDir) => dirPath.includes(`/${excludeDir}/`) || dirPath.endsWith(`/${excludeDir}`),
    )
  }

  async generateBarrels(config: BarrelConfig): Promise<void> {
    try {
      const {
        rootDir,
        directories,
        extensions = [...this.defaultExtensions],
        ignorePatterns = [...this.defaultIgnorePatterns],
        generateNestedBarrels = true,
        excludeDirs = [...this.defaultExcludeDirs],
      } = config

      this.logger.log(`Starting barrel file generation for directories: ${directories.join(', ')}`)

      for (const dir of directories) {
        const fullPath = path.join(rootDir, dir)

        if (!fs.existsSync(fullPath)) {
          this.logger.warn(`Directory not found: ${fullPath}`)
          continue
        }

        await this.processDirectory(fullPath, {
          extensions,
          ignorePatterns,
          generateNestedBarrels,
          excludeDirs,
        })
      }

      this.logger.log('Barrel file generation completed successfully')
    } catch (error: any) {
      this.logger.error(
        'Failed to generate barrel files',
        error instanceof Error ? error.stack : String(error),
      )
      throw error
    }
  }

  private async processDirectory(
    dirPath: string,
    options: Required<
      Pick<BarrelConfig, 'extensions' | 'ignorePatterns' | 'generateNestedBarrels' | 'excludeDirs'>
    >,
    isRootDir = true,
  ): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(dirPath, { withFileTypes: true })
      const exports: string[] = []
      const rootDir = isRootDir ? dirPath : path.dirname(dirPath)

      if (!isRootDir && this.isDirectoryExcluded(dirPath, options.excludeDirs)) {
        return exports
      }

      const validFiles = files
        .filter((file) => file.isFile())
        .map((file) => file.name)
        .filter((filename) => {
          const isValidExtension = options.extensions.some((ext) => filename.endsWith(ext))
          const shouldInclude = !options.ignorePatterns.some((pattern) =>
            filename.includes(pattern),
          )
          return isValidExtension && shouldInclude
        })

      validFiles.forEach((filename) => {
        const relativePath = path.relative(rootDir, path.join(dirPath, filename))
        exports.push(this.generateExportStatement(relativePath))
      })

      const subdirs = files.filter((file) => file.isDirectory())
      for (const subdir of subdirs) {
        const subdirPath = path.join(dirPath, subdir.name)
        if (!this.isDirectoryExcluded(subdirPath, options.excludeDirs)) {
          const nestedExports = await this.processDirectory(subdirPath, options, false)
          exports.push(...nestedExports)
        }
      }

      if (isRootDir) {
        await this.writeBarrelFile(dirPath, exports)
      }

      return exports
    } catch (error: any) {
      this.logger.error(
        `Error processing directory ${dirPath}:`,
        error instanceof Error ? error.stack : String(error),
      )
      throw error
    }
  }

  private generateExportStatement(filename: string): string {
    const withoutExt = filename.replace(/\.tsx?$/, '')
    return `export * from './${withoutExt}'`
  }

  private generateBarrelContent(exports: string[]): string {
    const uniqueExports = [...new Set(exports)]
    return [
      '/**',
      ' * @file Auto-generated barrel file',
      ' * @generated',
      ' */',
      '',
      uniqueExports.join('\n'),
      '', // Trailing newline
    ].join('\n')
  }

  private async writeBarrelFile(dirPath: string, exports: string[]): Promise<void> {
    const barrelPath = path.join(dirPath, 'index.ts')
    const content = this.generateBarrelContent(exports)

    try {
      await fs.promises.writeFile(barrelPath, content)
      this.logger.debug(`Generated barrel file: ${barrelPath}`)
    } catch (error: any) {
      this.logger.error(
        `Error writing barrel file ${barrelPath}:`,
        error instanceof Error ? error.stack : String(error),
      )
      throw error
    }
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function generateProjectBarrels(): Promise<void> {
  const logger = new CustomLogger('BarrelGenerator')
  const generator = new BarrelGenerator(logger)

  await generator.generateBarrels({
    rootDir: path.resolve(__dirname, '../src'),
    directories: ['core', 'content', 'types', 'monitoring'],
    ignorePatterns: [
      // NestJS Critical Files
      '.controller.ts',
      '.service.ts',
      '.module.ts',
      '.guard.ts',
      '.middleware.ts',
      '.filter.ts',
      '.interceptor.ts',
      '.decorator.ts',
      '.provider.ts',
      '.resolver.ts',

      // Test Files
      '.spec.ts',
      '.test.ts',
      '.e2e-spec.ts',

      // Other Common Ignores
      '.d.ts',
      'index.ts',
      '.mock.ts',
    ],
    generateNestedBarrels: false,
  })
}

// Execute if running directly
if (import.meta.url.endsWith(process.argv[1])) {
  generateProjectBarrels().catch((error: unknown) => {
    console.error(
      'Error generating barrel files:',
      error instanceof Error ? error.stack : String(error),
    )
    process.exit(1)
  })
}
