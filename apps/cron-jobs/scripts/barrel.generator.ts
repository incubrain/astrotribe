// scripts/barrel.generator.ts
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { CustomLogger } from '../src/core/services/logger.service'

interface BarrelConfig {
  // Root directory to start scanning from
  rootDir: string
  // Array of directory names to generate barrels for
  directories: string[]
  // Optional: File extensions to include (defaults to .ts and .tsx)
  extensions?: string[]
  // Optional: Files to ignore (defaults to .spec.ts, .test.ts, etc)
  ignorePatterns?: string[]
  // Optional: Whether to generate nested barrel files (defaults to true)
  generateNestedBarrels?: boolean

  excludeDirs?: string[]
}

export class BarrelGenerator {
  private readonly logger: CustomLogger
  private readonly defaultExtensions = ['.ts', '.tsx']
  private readonly defaultIgnorePatterns = [
    '.module',
    '.module.ts',
    '.spec.ts',
    '.test.ts',
    '.e2e-spec.ts',
    '.d.ts',
    'index.ts',
  ]

  private readonly defaultExcludeDirs = ['__tests__']

  constructor(logger: CustomLogger) {
    this.logger = logger
    this.logger.setDomain('jobs')
  }

  private shouldExcludeDir(dirPath: string, excludeDirs: string[]): boolean {
    return excludeDirs.some(
      (excludeDir) => dirPath.includes(`/${excludeDir}/`) || dirPath.endsWith(`/${excludeDir}`),
    )
  }

  async generateBarrels(config: BarrelConfig): Promise<void> {
    const {
      rootDir,
      directories,
      extensions = this.defaultExtensions,
      ignorePatterns = this.defaultIgnorePatterns,
      generateNestedBarrels = true,
    } = config

    this.logger.info(`Starting barrel file generation for directories: ${directories.join(', ')}`)

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
      })
    }

    this.logger.info('Barrel file generation completed')
  }

  private async processDirectory(
    dirPath: string,
    options: Pick<BarrelConfig, 'extensions' | 'ignorePatterns' | 'generateNestedBarrels'>,
    isRootDir = true, // Add flag to identify root level directories
  ): Promise<string[]> {
    // Return exports to collect from nested dirs
    try {
      const files = await fs.promises.readdir(dirPath, { withFileTypes: true })
      const exports: string[] = []
      const rootDir = isRootDir ? dirPath : path.dirname(dirPath)
      const excludeDirs = options.ignorePatterns || this.defaultExcludeDirs

      // Skip this directory if it's in the exclude list
      if (!isRootDir && this.shouldExcludeDir(dirPath, excludeDirs)) {
        return exports
      }

      // Process all files in current directory
      const validFiles = files
        .filter((file) => file.isFile())
        .map((file) => file.name)
        .filter((filename) => {
          const isValidExtension = options.extensions?.some((ext) => filename.endsWith(ext))
          const shouldInclude = !options.ignorePatterns?.some((pattern) =>
            filename.includes(pattern),
          )
          return isValidExtension && shouldInclude
        })

      // Generate exports for valid files
      validFiles.forEach((filename) => {
        const relativePath = path.relative(rootDir, path.join(dirPath, filename))
        exports.push(this.generateExportForFile(relativePath))
      })

      // Process subdirectories
      const subdirs = files.filter((file) => file.isDirectory())
      for (const subdir of subdirs) {
        const subdirPath = path.join(dirPath, subdir.name)
        // Skip excluded directories
        if (!this.shouldExcludeDir(subdirPath, excludeDirs)) {
          const nestedExports = await this.processDirectory(subdirPath, options, false)
          exports.push(...nestedExports)
        }
      }

      // Only write barrel file if this is a root directory
      if (isRootDir && exports.length > 0) {
        await this.writeBarrelFile(dirPath, exports)
      }

      return exports
    } catch (error: any) {
      this.logger.error(`Error processing directory ${dirPath}:`, error.stack)
      throw error
    }
  }

  private generateExportForFile(filename: string): string {
    // Remove .ts extension if it exists
    const withoutExt = filename.replace(/\.ts$/, '')
    return `export * from './${withoutExt}';`
  }

  private generateBarrelContent(exports: string[]): string {
    // Remove any duplicate exports
    const uniqueExports = [...new Set(exports)]

    return `// Auto-generated barrel file
  ${uniqueExports.join('\n')}
  `
  }

  private async writeBarrelFile(dirPath: string, exports: string[]): Promise<void> {
    const barrelPath = path.join(dirPath, 'index.ts')
    const content = this.generateBarrelContent(exports)

    try {
      await fs.promises.writeFile(barrelPath, content)
      this.logger.debug(`Generated barrel file: ${barrelPath}`)
    } catch (error: any) {
      this.logger.error(`Error writing barrel file ${barrelPath}:`, error.stack)
      throw error
    }
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Example usage script
// scripts/barrel.generator.ts
export async function generateProjectBarrels() {
  const logger = new CustomLogger('BarrelGenerator')
  const generator = new BarrelGenerator(logger)

  await generator.generateBarrels({
    rootDir: path.resolve(__dirname, '../src'),
    directories: ['core', 'content', 'types', 'monitoring'],
    extensions: ['.ts', '.tsx'],
    ignorePatterns: [
      // NestJS Critical Files
      '.controller.ts', // Controllers
      '.service.ts', // Services
      '.module.ts', // Modules
      '.guard.ts', // Guards
      '.middleware.ts', // Middleware
      '.filter.ts', // Filters
      '.interceptor.ts', // Interceptors
      '.decorator.ts', // Custom decorators
      '.provider.ts', // Custom providers
      '.resolver.ts', // GraphQL resolvers

      // Test Files
      '.spec.ts',
      '.test.ts',
      '.e2e-spec.ts',

      // Other Common Ignores
      '.d.ts',
      'index.ts',
      '.mock.ts',
      '__tests__',
    ],
    generateNestedBarrels: false,
    excludeDirs: ['__tests__', 'dist', 'node_modules'],
  })
}

// If running directly
if (import.meta.url.endsWith(process.argv[1])) {
  generateProjectBarrels().catch((error: any) => {
    console.error('Error generating barrel files:', error)
    process.exit(1)
  })
}
