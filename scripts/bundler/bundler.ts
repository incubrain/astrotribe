import path from 'path'
import fs from 'fs/promises'
import { glob } from 'glob'
import chalk from 'chalk'
import type {
  ComponentScanResult,
  PackageScanResult,
  ContextConfig,
  SearchResult,
  ConfigGeneratorOptions,
  RepomixConfig,
  FeatureConfig,
} from './bundler-types'
import { FEATURE_CONFIGS } from './feature-configs'
import { generateAppContext } from './app-template'

export class RepomixConfigGenerator {
  private BUNDLER_ROOT = path.join(process.cwd(), 'scripts', 'bundler')

  private async searchContent(
    searchTerm: string,
    rootDir: string,
    exclude: string[] = [],
  ): Promise<SearchResult> {
    const result: SearchResult = {
      files: [],
      components: [],
      functions: [],
      totalMatches: 0,
      contextSnippets: [],
    }

    const defaultExcludes = [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/coverage/**',
      '**/.git/**',
      '**/tmp/**',
      '**/.cache/**',
      '**/logs/**',
      '**/build/**',
      '**/*.test.*',
      '**/*.spec.*',
    ]

    const patterns = ['**/*.{ts,tsx,js,jsx,vue}', '**/*.{md,mdx}', '**/*.{json,yaml,yml}']
    const ignorePatterns = [...defaultExcludes, ...exclude]

    for (const pattern of patterns) {
      const files = await glob(pattern, {
        cwd: rootDir,
        ignore: ignorePatterns,
        absolute: true,
      })

      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8')
        const lines = content.split('\n')
        const relativePath = path.relative(rootDir, file)
        let matched = false

        // Search through file content
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes(searchTerm.toLowerCase())) {
            matched = true
            result.contextSnippets.push({
              file: relativePath,
              line: i + 1,
              content: lines[i].trim(),
              context: this.getContext(lines, i, 3),
            })
          }
        }

        if (matched) {
          result.files.push(relativePath)
          result.totalMatches++

          if (file.endsWith('.vue')) {
            result.components.push(relativePath)
          }

          const functionMatches = content.match(
            new RegExp(`(function|const|class)\\s+\\w*${searchTerm}\\w*\\s*[({]`, 'gi'),
          )
          if (functionMatches) {
            result.functions.push(relativePath)
          }
        }
      }
    }

    return result
  }

  private getContext(lines: string[], lineNum: number, contextLines: number = 3): string {
    const start = Math.max(0, lineNum - contextLines)
    const end = Math.min(lines.length, lineNum + contextLines + 1)
    return lines.slice(start, end).join('\n')
  }

  private generateSearchHeaderText(searchTerm: string, result: SearchResult): string {
    const timestamp = new Date().toISOString()
    return [
      `Search Results for "${searchTerm}"`,
      `Generated: ${timestamp}`,
      '',
      '# Overview',
      `Found ${result.totalMatches} matches across ${result.files.length} files`,
      '',
      '## Files',
      ...result.files.map((file) => `- ${file}`),
      '',
      result.components.length
        ? ['## Components', ...result.components.map((comp) => `- ${comp}`), ''].join('\n')
        : '',
      result.functions.length
        ? ['## Functions', ...result.functions.map((func) => `- ${func}`), ''].join('\n')
        : '',
      '## Matches',
      ...result.contextSnippets.map(
        (snippet) => `### ${snippet.file}:${snippet.line}\n\`\`\`\n${snippet.context}\n\`\`\``,
      ),
      '',
    ].join('\n')
  }

  private async generateDynamicConfigs(options: ConfigGeneratorOptions): Promise<RepomixConfig[]> {
    const { mode, searchTerm, rootDir = process.cwd(), exclude = [] } = options

    if (mode !== 'search' || !searchTerm) {
      throw new Error('Search term is required for dynamic search')
    }

    const searchResult = await this.searchContent(searchTerm, rootDir, exclude)

    if (searchResult.totalMatches === 0) {
      throw new Error(`No matches found for "${searchTerm}"`)
    }

    // Convert relative paths to absolute paths
    const absolutePaths = searchResult.files.map((file) =>
      path.isAbsolute(file) ? file : path.join(rootDir, file),
    )

    // Create the config
    return [
      {
        output: {
          filePath: path.join(
            'ai-context',
            'search',
            `${searchTerm.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`,
          ),
          style: 'markdown',
          removeComments: false,
          removeEmptyLines: false,
          showLineNumbers: true,
          topFilesLength: 0,
        },
        include: absolutePaths,
        ignore: {
          useGitignore: true,
          useDefaultPatterns: true,
          customPatterns: [
            '**/node_modules/**',
            '**/dist/**',
            '**/coverage/**',
            '**/.nuxt/**',
            '**/tests/**',
            '**/*.test.*',
            '**/*.spec.*',
            '**/debug/**',
            '**/tmp/**',
            '**/.cache/**',
            '**/logs/**',
            '**/build/**',
            ...exclude,
          ],
        },
        security: {
          enableSecurityCheck: true,
          excludePatterns: ['**/secrets/**', '**/config/**/*.{prod,staging}.*'],
        },
      },
    ]
  }

  async generateConfigs(options: ConfigGeneratorOptions) {
    const { mode, appName, searchTerm, componentScan } = options

    switch (mode) {
      case 'search': {
        if (!searchTerm) throw new Error('searchTerm is required for search mode')

        // Check for predefined feature config first
        const featureConfig = FEATURE_CONFIGS[searchTerm.toLowerCase()]
        if (featureConfig) {
          console.log(chalk.blue(`Using predefined config for "${searchTerm}"`))
          if (featureConfig.relatedFeatures?.length) {
            console.log(chalk.gray(`Related features: ${featureConfig.relatedFeatures.join(', ')}`))
          }
          return this.generateConfigsFromFeature(featureConfig)
        }

        // Fall back to dynamic search
        return this.generateDynamicConfigs(options)
      }

      case 'app': {
        if (!appName || !componentScan) {
          throw new Error('appName and componentScan required for app mode')
        }
        return [generateAppContext(appName, componentScan)]
      }

      default:
        throw new Error(`Unknown mode: ${mode}`)
    }
  }

  private async generateConfigsFromFeature(featureConfig: FeatureConfig): Promise<RepomixConfig[]> {
    // First, resolve all glob patterns to actual files for validation
    const files = new Set<string>()

    for (const pattern of featureConfig.includes) {
      const matches = await glob(pattern, {
        cwd: process.cwd(),
        ignore: featureConfig.excludes,
        dot: true,
      })
      matches.forEach((file) => files.add(file)) // These will be relative paths
    }

    // Create the config with relative paths
    const config: RepomixConfig = {
      output: {
        filePath: path.join(
          'ai-context', // Relative to bundler directory
          'features',
          `${featureConfig.description.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`,
        ),
        style: 'markdown',
        removeComments: false,
        removeEmptyLines: false,
        showLineNumbers: true,
        topFilesLength: 0,
      },
      include: Array.from(files), // These should be relative to project root
      ignore: {
        useGitignore: true,
        useDefaultPatterns: true,
        customPatterns: featureConfig.excludes,
      },
      security: {
        enableSecurityCheck: true,
        excludePatterns: ['**/secrets/**', '**/config/**/*.{prod,staging}.*'],
      },
    }

    return [config]
  }
}
