import path from 'path'
import fs from 'fs/promises'
import chalk from 'chalk'
import { RepomixConfigGenerator } from './generators/repomix'
import { PackageScanner } from './scanners/packages'
import { ComponentScanner } from './scanners/components'

export class ProjectScanner {
  private componentScanner: ComponentScanner
  private packageScanner: PackageScanner
  private configGenerator: RepomixConfigGenerator

  constructor() {
    this.componentScanner = new ComponentScanner()
    this.packageScanner = new PackageScanner()
    this.configGenerator = new RepomixConfigGenerator()
  }

  async scanApp(appName: string) {
    console.log(chalk.blue(`Scanning ${appName}...`))

    const appPath = path.join(process.cwd(), 'apps', appName)

    // Verify app exists
    try {
      await fs.access(appPath)
    } catch {
      throw new Error(`App directory not found: ${appPath}`)
    }

    const [componentScan, packageScan] = await Promise.all([
      this.componentScanner.scanApp(appName, appPath),
      this.packageScanner.scanApp(appName, appPath),
    ])

    const configs = await this.configGenerator.generateConfigs(appName, componentScan, packageScan)

    return {
      componentScan,
      packageScan,
      configs,
    }
  }

  async saveConfigs(appName: string, configs: any[]) {
    // Create base directories
    const configDir = path.join('repomix-configs', appName)
    const contextDir = path.join('ai-context', appName)

    await Promise.all([
      fs.mkdir(configDir, { recursive: true }),
      fs.mkdir(contextDir, { recursive: true }),
    ])

    // Save each config
    await Promise.all(
      configs.map(async (config) => {
        const fileName = path.basename(config.output.filePath, '.txt') + '.json'
        const configPath = path.join(configDir, fileName)
        await fs.writeFile(configPath, JSON.stringify(config, null, 2))
        console.log(chalk.green(`Generated config: ${configPath}`))
      }),
    )
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const appName = process.argv[2]

  if (!appName) {
    console.error(chalk.red('Usage: npm run ai:scan <appName>'))
    process.exit(1)
  }

  const scanner = new ProjectScanner()

  scanner
    .scanApp(appName)
    .then(async ({ configs }) => {
      await scanner.saveConfigs(appName, configs)
      console.log(chalk.blue('\nNext steps:'))
      console.log('1. Review generated configs in repomix-configs/' + appName)
      console.log('2. Run repomix with each config:')
      configs.forEach((config) => {
        console.log(
          `   npx repomix --config repomix-configs/${appName}/${path.basename(config.output.filePath, '.txt')}.json`,
        )
      })
    })
    .catch((error) => {
      console.error(chalk.red(`\nError: ${error.message}`))
      process.exit(1)
    })
}
