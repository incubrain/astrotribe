// cli/flows/search/actions.ts

import path from 'path'
import fs from 'fs/promises'
import chalk from 'chalk'
import { FEATURE_CONFIGS } from '../../configs/features'
import { ComponentScanner } from '../../scanners/component-scanner'
import { PackageScanner } from '../../scanners/package-scanner'
import { RepomixRunner } from '../repomix-runner'
import { FeatureConfigBuilder } from '../../configs/feature-builder'
import type { RepomixConfig } from '../../types'

interface SearchContext {
  searchTerm: string
  excludePatterns: string
  searchComponents: boolean
  searchPackages: boolean
  runImmediately: boolean
}

export const handleSearch = async (context: SearchContext) => {
  console.log(chalk.blue(`\nSearching for: ${context.searchTerm}`))

  const results = {
    components: new Set<string>(),
    packages: new Set<string>(),
    files: new Set<string>(),
  }

  // Scan components if enabled
  if (context.searchComponents) {
    console.log(chalk.gray('Scanning components...'))
    const componentScanner = new ComponentScanner()
    const apps = await getApps()

    for (const app of apps) {
      try {
        const scanResult = await componentScanner.scan(app, {
          debug: process.env.DEBUG === 'true',
          searchTerm: context.searchTerm,
        })

        // Add custom components that match the search term
        scanResult.customComponents?.forEach((component) => {
          results.components.add(`${scanResult.appName}:${component}`)
        })

        // Add matching file paths
        scanResult.fileMatches?.forEach((file) => {
          results.files.add(`${scanResult.appName}:${file}`)
        })

        if (process.env.DEBUG === 'true') {
          console.log(`Scan results for ${scanResult.appName}:`, {
            components: [...(scanResult.customComponents || [])],
            files: [...(scanResult.fileMatches || [])],
          })
        }
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not scan app ${app}: ${error.message}`))
      }
    }
  }

  // Scan packages if enabled
  if (context.searchPackages) {
    console.log(chalk.gray('Scanning packages...'))
    const packageScanner = new PackageScanner()
    const apps = await getApps()

    for (const app of apps) {
      const scanResult = await packageScanner.scan(app)

      // Add packages that match the search term
      for (const dep of scanResult.dependencies) {
        if (dep.toLowerCase().includes(context.searchTerm.toLowerCase())) {
          results.packages.add(dep)
        }
      }
    }
  }

  // Generate repomix config
  const config = {
    description: `Generated config for search term: ${context.searchTerm}`,
    include: [
      // Add file matches if found
      ...[...results.files].map((f) => {
        const [app, file] = f.split(':')
        return `apps/${app}/${file}`
      }),
      // Add general search patterns
      `apps/**/*${context.searchTerm}*`,
      `libs/**/*${context.searchTerm}*`,
      // Add component-specific patterns
      ...[...results.components].map((c) => {
        const [app, component] = c.split(':')
        return `apps/${app}/**/${component}.*`
      }),
    ],
    ignore: {
      useGitignore: context.useGitignore,
      useDefaultPatterns: context.useDefaultPatterns,
      customPatterns: [
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
        '**/*.stories.*',
        ...context.excludePatterns
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
      ],
    },
    output: {
      filePath: `ai-context/${context.searchTerm.toLowerCase()}.txt`,
    },
  }

  // Save and return results...
  console.log(chalk.gray('\nScan Results:'))
  console.log('Components found:', results.components.size)
  console.log('Files matched:', results.files.size)
  results.components.forEach((c) => console.log(chalk.blue(`- ${c}`)))
  results.files.forEach((f) => console.log(chalk.gray(`- ${f}`)))

  return { ...context, results, config }
}

export const handleFeatureSelect = async (context: { featureId: string }) => {
  const featureConfig = FEATURE_CONFIGS[context.featureId]
  if (!featureConfig) {
    throw new Error(`Feature config not found: ${context.featureId}`)
  }

  console.log(chalk.blue(`\nGenerating context for feature: ${featureConfig.name}`))
  console.log(chalk.gray(featureConfig.description))

  const repomixConfig = {
    description: featureConfig.description,
    include: featureConfig.include,
    ignore: featureConfig.ignore,
    output: {
      filePath: `${featureConfig.outputConfig?.directory}/${featureConfig.outputConfig?.filename}.${featureConfig.outputConfig?.extension || 'txt'}`,
    },
  }

  const runner = new RepomixRunner()
  const configPath = await runner.saveConfig(repomixConfig, 'features')

  console.log(chalk.green('\nGenerated config:'), configPath)

  return {
    ...context,
    configPath,
    featureConfig,
  }
}

// cli/flows/search/actions.ts

export const handleAllFeatures = async () => {
  console.log(chalk.blue('\nGenerating configs for all features...'))

  const runner = new RepomixRunner()
  const results: Record<string, { configPath: string; success: boolean }> = {}

  const features = Object.entries(FEATURE_CONFIGS)
  console.log(chalk.gray(`Found ${features.length} features to process`))

  for (const [id, config] of features) {
    try {
      console.log(chalk.gray(`\nProcessing feature: ${config.name}`))

      // Scan for additional files and components
      const scanResults = await scanForFeature(config)

      // Merge scan results with config patterns
      const repomixConfig = {
        description: config.description,
        include: [
          ...config.include,
          ...scanResults.files.map((f) => f.path),
          ...scanResults.components.map((c) => `apps/**/${c}.*`),
        ],
        ignore: config.ignore,
        output: {
          filePath: path.join(
            config.outputConfig?.directory || 'ai-context',
            `${config.outputConfig?.filename}.${config.outputConfig?.extension}`,
          ),
        },
      }

      const configFilename = `${config.id}.json`
      const configPath = await runner.saveConfig(repomixConfig, 'features', configFilename)
      results[id] = { configPath, success: true }

      console.log(chalk.green(`Generated config for ${config.name}`))
      if (process.env.DEBUG === 'true') {
        console.log('DEBUG: Scan results:', scanResults)
        console.log('DEBUG: Final config:', repomixConfig)
      }

      // Run the search
      await runner.runConfig({
        path: configPath,
        name: config.name,
        content: repomixConfig,
      })
    } catch (error) {
      console.error(chalk.red(`Failed to generate config for ${config.name}:`), error)
      results[id] = { configPath: '', success: false }
    }
  }

  // Summary
  console.log(chalk.blue('\nGeneration Summary:'))
  for (const [id, result] of Object.entries(results)) {
    const config = FEATURE_CONFIGS[id]
    const status = result.success ? chalk.green('✓') : chalk.red('✗')
    console.log(`${status} ${config.name}`)
    if (result.success) {
      console.log(chalk.gray(`  Config: ${result.configPath}`))
      console.log(
        chalk.gray(
          `  Output: ${config.outputConfig?.directory}/${config.outputConfig?.filename}.${config.outputConfig?.extension}`,
        ),
      )
    }
  }

  return { results }
}

async function scanForFeature(config: FeatureConfig) {
  const results = {
    files: new Set<string>(),
    components: new Set<string>(),
  }

  // Get root project directory
  const rootDir = process.cwd()
  const appsDir = path.join(rootDir, 'apps')

  // Scan components
  const componentScanner = new ComponentScanner()
  const appNames = await fs.readdir(appsDir)

  for (const appName of appNames.filter((app) => !app.startsWith('.'))) {
    try {
      const appPath = path.join(appsDir, appName)
      const scanResult = await componentScanner.scan(appPath, {
        debug: process.env.DEBUG === 'true',
        searchTerm: config.id,
      })

      // Add custom components that match
      scanResult.customComponents?.forEach((component) => {
        results.components.add(component)
      })

      // Add matching files with relative paths
      scanResult.fileMatches?.forEach((file) => {
        // Create relative path from project root
        const relativePath = path.join('apps', appName, file)
        results.files.add(relativePath)
      })
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Could not scan app ${appName}: ${error.message}`))
    }
  }

  if (process.env.DEBUG === 'true') {
    console.log(`DEBUG: Scan results for ${config.name}:`)
    console.log('Components:', [...results.components])
    console.log('Files:', [...results.files])
  }

  return {
    components: [...results.components],
    files: [...results.files].map((f) => ({
      path: f,
      type: path.extname(f).slice(1),
    })),
  }
}

// Helper function to get all app directories
async function getApps(): Promise<string[]> {
  const appsDir = path.join(process.cwd(), 'apps')
  try {
    const apps = await fs.readdir(appsDir)
    return apps.filter((app) => !app.startsWith('.')).map((app) => path.join(appsDir, app))
  } catch (error) {
    console.error(chalk.red(`Error reading apps directory: ${error.message}`))
    return []
  }
}
