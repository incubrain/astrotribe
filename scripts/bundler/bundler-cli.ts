// cli/index.ts
import path from 'path'
import fs from 'fs/promises'
import { execSync } from 'child_process'
import { Command } from 'commander'
import glob from 'fast-glob'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { FEATURE_CONFIGS } from './feature-configs'
import type { RepomixConfig, ContextConfig } from './bundler-types'
import { RepomixConfigGenerator } from './bundler'

const program = new Command()

async function saveConfig(config: RepomixConfig, mode: string): Promise<string> {
  const configDir = path.join('repomix-configs', mode)
  await fs.mkdir(configDir, { recursive: true })

  const configPath = path.join(configDir, `${path.basename(config.output.filePath, '.txt')}.json`)

  // Save config relative to bundler directory
  await fs.writeFile(
    path.join(process.cwd(), 'scripts', 'bundler', configPath),
    JSON.stringify(config, null, 2),
  )

  return configPath // Return relative path
}

async function handleSearch(term: string, options: any) {
  try {
    console.log(chalk.blue(`\nSearching for: ${term}`))
    const generator = new RepomixConfigGenerator()

    // Check if it's a known feature
    if (FEATURE_CONFIGS[term.toLowerCase()]) {
      console.log(chalk.gray(`Using predefined feature config for "${term}"`))
    }

    const configs = await generator.generateConfigs({
      mode: 'search',
      searchTerm: term,
      exclude: options.exclude?.split(','),
    })

    // Save configs
    const savedPaths = await Promise.all(
      configs.map((config) => saveConfig(config as RepomixConfig, 'search')),
    )

    // Show results
    console.log(chalk.green('\nGenerated configs:'))
    savedPaths.forEach((path) => console.log(`- ${path}`))

    // Ask to run repomix
    if (options.run || (await shouldRunRepomix())) {
      await runRepomix(savedPaths)
    } else {
      console.log(chalk.blue('\nTo run repomix later:'))
      savedPaths.forEach((path) => {
        console.log(`npx repomix --config ${path}`)
      })
    }
  } catch (error: any) {
    console.error(chalk.red(`\nError: ${error.message}`))
    process.exit(1)
  }
}

async function handleApp(appName: string, options: any) {
  try {
    console.log(chalk.blue(`\nGenerating configs for app: ${appName}`))

    // Get component and package scan results
    const { ComponentScanner } = await import('./scanners/components')
    const { PackageScanner } = await import('./scanners/packages')

    const componentScanner = new ComponentScanner()
    const packageScanner = new PackageScanner()

    const [componentScan, packageScan] = await Promise.all([
      componentScanner.scanApp(appName, path.join(process.cwd(), 'apps', appName)),
      packageScanner.scanApp(appName, path.join(process.cwd(), 'apps', appName)),
    ])

    const generator = new RepomixConfigGenerator()
    const configs = await generator.generateConfigs({
      mode: 'app',
      appName,
      componentScan,
      packageScan,
    })

    // Save configs
    const savedPaths = await Promise.all(
      configs.map((config) => saveConfig(config as RepomixConfig, 'apps')),
    )

    console.log(chalk.green('\nGenerated configs:'))
    savedPaths.forEach((path) => console.log(`- ${path}`))

    // Ask to run repomix
    if (options.run || (await shouldRunRepomix())) {
      await runRepomix(savedPaths)
    } else {
      console.log(chalk.blue('\nTo run repomix later:'))
      savedPaths.forEach((path) => {
        console.log(`npx repomix --config ${path}`)
      })
    }
  } catch (error: any) {
    console.error(chalk.red(`\nError: ${error.message}`))
    process.exit(1)
  }
}

async function shouldRunRepomix(): Promise<boolean> {
  const { run } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'run',
      message: 'Run repomix now?',
      default: true,
    },
  ])
  return run
}

async function validateConfig(configPath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'scripts', 'bundler', configPath)
    const config = JSON.parse(await fs.readFile(fullPath, 'utf-8'))

    // Convert any absolute paths to relative
    config.include = config.include.map((file: string) => {
      return path.isAbsolute(file) ? path.relative(rootDir, file) : file
    })

    // Check files exist
    let totalFiles = 0
    for (const pattern of config.include) {
      // Use the relative pattern
      const matches = await glob(pattern, {
        cwd: rootDir,
        ignore: config.ignore?.customPatterns || [],
        dot: true,
      })
      totalFiles += matches.length

      if (process.env.DEBUG) {
        console.log(chalk.gray(`\nPattern: ${pattern}`))
        console.log(chalk.gray(`Found ${matches.length} matches:`))
        matches.forEach((file) => console.log(chalk.gray(`  - ${file}`)))
      }
    }

    if (totalFiles === 0) {
      console.error(chalk.red('No files match the include patterns'))
      if (process.env.DEBUG) {
        console.log('Patterns tried:')
        config.include.forEach((pattern: string) => console.log(`- ${pattern}`))
      }
      return false
    }

    // Update config with relative paths
    await fs.writeFile(
      fullPath,
      JSON.stringify(
        {
          ...config,
          output: {
            ...config.output,
            filePath: path.join('ai-context', path.basename(config.output.filePath)),
          },
        },
        null,
        2,
      ),
    )

    return true
  } catch (error) {
    console.error(chalk.red(`Config validation failed: ${error.message}`))
    return false
  }
}

async function runRepomix(configPaths: string[]) {
  for (const configPath of configPaths) {
    try {
      console.log(chalk.blue(`\nValidating config: ${path.basename(configPath)}`))

      if (!(await validateConfig(configPath))) {
        console.error(chalk.red('Skipping invalid config'))
        continue
      }

      // Convert config path to be relative to bundler directory
      const bundlerPath = path.join('scripts', 'bundler', configPath)

      console.log(chalk.blue(`Running repomix for: ${path.basename(configPath)}`))

      execSync(`npx repomix --config "${bundlerPath}" --verbose`, {
        stdio: 'inherit',
        cwd: process.cwd(), // Keep cwd as project root
        env: {
          ...process.env,
          DEBUG: 'repomix:*',
        },
      })

      // For verification, also update output path check
      const config = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'scripts', 'bundler', configPath), 'utf-8'),
      )
      const outputPath = path.join('scripts', 'bundler', config.output.filePath)

      try {
        await fs.access(path.join(process.cwd(), outputPath))
        const stats = await fs.stat(path.join(process.cwd(), outputPath))
        if (stats.size === 0) {
          console.error(chalk.red('Output file is empty'))
        } else {
          console.log(chalk.green(`Successfully generated context (${stats.size} bytes)`))
        }
      } catch (error) {
        console.error(chalk.red('Output file was not created'), error)
      }
    } catch (error) {
      console.error(chalk.red(`Failed to generate context: ${error.message}`))
      if (process.env.DEBUG) {
        console.error('Full error:', error)
      }
    }
  }
}

program.name('bundler').description('Generate and run repomix configs').version('1.0.0')

program
  .command('search <term>')
  .description('Search across the repo and generate config')
  .option('-e, --exclude <patterns>', 'patterns to exclude (comma separated)', '')
  .option('-r, --run', 'run repomix immediately')
  .action(handleSearch)

program
  .command('app <name>')
  .description('Generate configs for an app')
  .option('-r, --run', 'run repomix immediately')
  .action(handleApp)

program
  .command('features')
  .description('List available feature configs')
  .action(() => {
    console.log(chalk.blue('\nAvailable Features:'))
    Object.entries(FEATURE_CONFIGS).forEach(([key, config]) => {
      console.log(chalk.green(`\n${key}:`))
      console.log(`  Description: ${config.description}`)
      if (config.relatedFeatures?.length) {
        console.log(`  Related: ${config.relatedFeatures.join(', ')}`)
      }
    })
  })

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse()
}
