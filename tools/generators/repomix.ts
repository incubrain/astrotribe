// tools/generators/repomix.ts
import path from 'path'
import fs from 'fs/promises'
import chalk from 'chalk'
import type { ComponentScanResult, PackageScanResult } from '../scanners/types'

interface ConfigGeneratorOptions {
  includeAllLibs?: boolean
  baseIncludePatterns?: string[]
  baseIgnorePatterns?: string[]
}

// tools/config-generator.ts

const APP_INSTRUCTIONS = `# Application Context Instructions
- Follow Vue 3 Composition API best practices
- Use TypeScript for type safety
- Follow the project's established patterns for state management
- All components should use PrimeVue's prefix convention
- Consider performance implications for large data operations
- Follow established error handling patterns
- Use the VueUse composables where applicable`

const LAYERS_INSTRUCTIONS = `# Layers Context Instructions
- Layers should be self-contained and focused
- Follow Nuxt layer conventions for configuration
- Document layer dependencies clearly
- Keep cross-layer dependencies minimal
- Consider layer load order`

const PRIMEVUE_INSTRUCTIONS = `# PrimeVue Context Instructions
- These components follow Tailwind styling conventions
- Component usage should follow PrimeVue's documentation
- Consider accessibility requirements
- Use provided theme tokens for customization
- Pay attention to component events and slots`

const FRAMEWORK_INSTRUCTIONS = `# Framework Documentation Instructions
- This documentation is for reference
- Consider version compatibility
- Focus on Nuxt 3 specific features
- Pay attention to SSR implications
- Note any security considerations`

interface ContextConfig {
  name: string
  description: string
  include: string[]
  headerText: string
  config?: {
    removeComments?: boolean
    removeEmptyLines?: boolean
    copyToClipboard?: boolean
    outputStyle?: 'markdown' | 'xml' | 'plain'
    showTokenCount?: boolean
    instructions?: string
    showRepoStructure?: boolean
  }
}

export class RepomixConfigGenerator {
  private estimateTokenCount(content: string): number {
    // Rough estimation: ~4 chars per token on average
    return Math.ceil(content.length / 4)
  }

  private generateMainHeaderText(appName: string, componentScan: ComponentScanResult): string {
    const timestamp = new Date().toISOString()
    const sections = [
      `${appName} Application Context`,
      `Generated: ${timestamp}`,
      '',
      '# Project Context',
      '',
      '# Project Overview',
      '',
      'This app is part of a Nuxt 3 monorepo-based project utilizing modern Vue 3 features with TypeScript.',
      'The project uses Supabase as the primary backend solution with PostgreSQL, complemented by Redis for',
      'caching. Analytics and user experience are enhanced through PostHog metrics, Chart.js',
      'visualizations, and GSAP animations.',
      '',
      'Key Technologies:',
      '',
      '- Nuxt 3 (Vue 3 + Composition API)',
      '- TypeScript for type safety',
      '- Supabase for backend (PostgreSQL + Auth)',
      '- Redis for caching',
      '- PrimeVue v4 for UI components',
      '- Tailwind CSS for styling',
      '- Chart.js for data visualization',
      '- GSAP for animations',
      '- VueUse for composables',
      '- PostHog for analytics',
      '- Formbricks for form management',
      '- Pinia for state management',
      '- NX for monorepo management',
      '',
      '',
      '## Nuxt Modules',
      ...componentScan.nuxtConfig.modules.map((module) => `- ${module}`),
      '',
      '## Layers',
      ...componentScan.nuxtConfig.layers.map((layer) => `- ${layer}`),
      '',
      '## Project Structure',
      '```',
      'apps/[app-name]/',
      '├── components/         # Vue components',
      '│   ├── ui/            # Shared UI components',
      '│   └── domain/        # Domain-specific components',
      '├── composables/       # Vue composables',
      '├── layouts/           # Nuxt layouts',
      '├── pages/            # File-based routing',
      '├── server/           # Server routes and middleware',
      '│   ├── api/          # API endpoints',
      '│   └── middleware/   # Server middleware',
      '├── types/            # TypeScript type definitions',
      '├── utils/            # Utility functions',
      '└── plugins/          # Nuxt plugins',
      '```',
      '',
      '## Development Standards',
      '- Use `<script setup lang="ts">` syntax exclusively',
      '- Strongly typed props and emits',
      '- PrimeVue components use Prime prefix',
      '- Tailwind for styling',
      '- Pinia for state management',
      '- Composables for reusable logic',
      '- Error boundaries for error handling',
      '- VueUse for common utilities',
    ]

    return sections.join('\n')
  }

  private generateContexts(appName: string, componentScan: ComponentScanResult): ContextConfig[] {
    const timestamp = new Date().toISOString()

    return [
      // Main app context - full header with XML for better parsing
      {
        name: 'app-context',
        description: 'Main application code and configuration',
        include: [
          `apps/${appName}/**/*.{ts,tsx,js,jsx,vue}`,
          `apps/${appName}/**/*.md`,
          'shared-runtime.config.ts',
        ],
        headerText: this.generateMainHeaderText(appName, componentScan),
        config: {
          removeComments: false,
          removeEmptyLines: false,
          outputStyle: 'xml',
          showTokenCount: true,
          instructions: APP_INSTRUCTIONS,
          showRepoStructure: true,
        },
      },

      // Libraries - minimal context
      {
        name: 'libs-context',
        description: 'Shared libraries and utilities',
        include: ['libs/**/*.{ts,tsx,js}'],
        headerText: `Shared Libraries Context\nGenerated: ${timestamp}`,
        config: {
          removeComments: true,
          removeEmptyLines: true,
          outputStyle: 'markdown',
          showTokenCount: true,
          showRepoStructure: true,
        },
      },

      // Layers - focused context
      {
        name: 'layers-context',
        description: 'Nuxt layers configuration',
        include: componentScan.nuxtConfig.layers.map(
          (layer) => `layers/${layer}/**/*.{ts,tsx,js,vue}`,
        ),
        headerText: `Nuxt Layers Context\nGenerated: ${timestamp}`,
        config: {
          removeComments: false,
          outputStyle: 'xml',
          showTokenCount: true,
          instructions: LAYERS_INSTRUCTIONS,
          showRepoStructure: true,
        },
      },

      // PrimeVue components - focused context
      {
        name: 'primevue-context',
        description: 'PrimeVue components documentation',
        include: Array.from(componentScan.primeComponents).map(
          (component) => `ai-docs/primevue/components/${component}.vue`,
        ),
        headerText: `PrimeVue Components\nGenerated: ${timestamp}\n\nComponents used in ${appName}:`,
        config: {
          removeComments: false,
          outputStyle: 'xml',
          showTokenCount: true,
          instructions: PRIMEVUE_INSTRUCTIONS,
          showRepoStructure: false,
        },
      },

      // Framework documentation
      {
        name: 'framework-docs-context',
        description: 'Framework documentation',
        include: ['ai-docs/nuxt/**/*.md', 'ai-docs/nitro/**/*.md'],
        headerText: `Framework Documentation\nGenerated: ${timestamp}\n\nNuxt and Nitro documentation relevant to ${appName}.`,
        config: {
          removeEmptyLines: true,
          outputStyle: 'markdown',
          showTokenCount: true,
          instructions: FRAMEWORK_INSTRUCTIONS,
          showRepoStructure: false,
        },
      },
    ]
  }

  async generateConfigs(
    appName: string,
    componentScan: ComponentScanResult,
    packageScan: PackageScanResult,
  ) {
    const contexts = this.generateContexts(appName, componentScan)

    const baseConfig = {
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
        ],
      },
      security: {
        enableSecurityCheck: true,
        excludePatterns: ['**/secrets/**', '**/config/**/*.{prod,staging}.*'],
      },
    }

    return contexts.map((context) => ({
      output: {
        filePath: `ai-context/${appName}/${context.name}.txt`,
        style: context.config?.outputStyle || 'markdown',
        removeComments: context.config?.removeComments ?? false,
        removeEmptyLines: context.config?.removeEmptyLines ?? false,
        copyToClipboard: context.config?.copyToClipboard ?? false,
        showLineNumbers: false,
        topFilesLength: 0,
      },
      include: context.include,
      ...baseConfig,
    }))
  }

  // Add method to analyze token counts for generated files
  async analyzeTokens(filePath: string): Promise<{
    totalTokens: number
    sections: { name: string; tokens: number }[]
  }> {
    const content = await fs.readFile(filePath, 'utf-8')

    // Split content into sections based on headers
    const sections = content.split(/(?=^#+ )/m)

    return {
      totalTokens: this.estimateTokenCount(content),
      sections: sections.map((section) => {
        const name = section.split('\n')[0].replace(/^#+ /, '') || 'Unknown Section'
        return {
          name,
          tokens: this.estimateTokenCount(section),
        }
      }),
    }
  }
}
