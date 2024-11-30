// repomix-runner.ts
import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs/promises'
import { glob } from 'glob'
import inquirer from 'inquirer'
import chalk from 'chalk'

interface RepomixConfig {
  path: string
  name: string
  content: any
}

interface ModeInfo {
  id: string
  name: string
  configCount: number
}

export class RepomixRunner {
  private async ensureDirectories(config: RepomixConfig): Promise<void> {
    try {
      // Extract output directory from config
      const configContent = config.content
      if (configContent && configContent.output && configContent.output.filePath) {
        const outputDir = path.dirname(path.join(process.cwd(), configContent.output.filePath))
        await fs.mkdir(outputDir, { recursive: true })
        console.log(chalk.gray(`Ensured output directory exists: ${outputDir}`))
      }
    } catch (error) {
      console.error(chalk.yellow(`Warning: Could not create output directory: ${error.message}`))
    }
  }

  async runConfig(config: RepomixConfig): Promise<boolean> {
    try {
      console.log(chalk.blue(`\nGenerating context: ${config.name}`))

      // Ensure output directory exists
      await this.ensureDirectories(config)

      // Log the config being used (for debugging)
      console.log(chalk.gray('Using config:'), JSON.stringify(config.content, null, 2))

      execSync(`npx repomix --config "${config.path}"`, {
        stdio: 'inherit',
        env: {
          ...process.env,
          DEBUG: 'repomix:*', // Enable debug logging for repomix
        },
      })

      console.log(chalk.green(`Successfully generated: ${config.name}`))
      return true
    } catch (error) {
      console.error(chalk.red(`Failed to generate context: ${config.name}`))
      console.error(chalk.red('Error details:'), error)
      return false
    }
  }

  async runConfigs(configs: RepomixConfig[]): Promise<boolean> {
    let success = true

    for (const config of configs) {
      // Add validation for config structure
      if (!config.content || !config.content.output || !config.content.output.filePath) {
        console.error(chalk.red(`Invalid config structure for ${config.name}`))
        console.error('Expected structure:', {
          output: {
            filePath: 'path/to/output.txt',
          },
        })
        success = false
        continue
      }

      const result = await this.runConfig(config)
      success = success && result
    }

    return success
  }

  async getAvailableModes(): Promise<ModeInfo[]> {
    const configsDir = path.join(process.cwd(), 'repomix')

    try {
      await fs.access(configsDir)
    } catch {
      console.log(chalk.yellow('No configs directory found'))
      return []
    }

    const modes = await fs.readdir(configsDir)
    const modeInfos: ModeInfo[] = []

    for (const mode of modes) {
      const configs = await this.getConfigs(mode)
      if (configs.length > 0) {
        modeInfos.push({
          id: mode,
          name: mode.charAt(0).toUpperCase() + mode.slice(1), // Capitalize first letter
          configCount: configs.length,
        })
      }
    }

    return modeInfos
  }

  async saveConfig(config: any, mode: string, filename?: string): Promise<string> {
    try {
      const configsDir = path.join(process.cwd(), 'repomix', mode)
      await fs.mkdir(configsDir, { recursive: true })

      const configName = filename || `${mode}-${Date.now()}.json`
      const configPath = path.join(configsDir, configName)

      await fs.writeFile(configPath, JSON.stringify(config, null, 2))

      if (process.env.DEBUG === 'true') {
        console.log('DEBUG: Saved config to:', configPath)
      }

      return path.relative(process.cwd(), configPath)
    } catch (error) {
      console.error(chalk.red(`Failed to save config: ${error.message}`))
      throw error
    }
  }

  async getConfigs(mode: string): Promise<RepomixConfig[]> {
    const configDir = path.join(process.cwd(), 'repomix', mode)

    try {
      await fs.access(configDir)
    } catch {
      console.log(chalk.yellow(`No configs found for ${mode}`))
      return []
    }

    const files = await glob('*.json', { cwd: configDir })

    const configs = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(configDir, file)
        try {
          const content = JSON.parse(await fs.readFile(filePath, 'utf-8'))

          // Validate config structure
          if (!content.output?.filePath) {
            console.warn(chalk.yellow(`Warning: Invalid config structure in ${file}`))
            return null
          }

          return {
            path: filePath,
            name: path.basename(file, '.json'),
            content,
          }
        } catch (error) {
          console.error(chalk.red(`Error reading config ${file}:`), error)
          return null
        }
      }),
    )

    // Filter out invalid configs
    return configs.filter((config): config is RepomixConfig => config !== null)
  }

  private async getAllConfigs(): Promise<Record<string, RepomixConfig[]>> {
    const configsDir = path.join(process.cwd(), 'repomix')

    try {
      await fs.access(configsDir)
    } catch {
      console.log(chalk.yellow('No configs directory found'))
      return {}
    }

    const modes = await fs.readdir(configsDir)
    const result: Record<string, RepomixConfig[]> = {}

    for (const mode of modes) {
      const configs = await this.getConfigs(mode)
      if (configs.length > 0) {
        result[mode] = configs
      }
    }

    return result
  }

  async run(mode?: string) {
    if (mode) {
      return this.runForMode(mode)
    }
    return this.runAll()
  }

  private async runForMode(mode: string) {
    const configs = await this.getConfigs(mode)

    if (configs.length === 0) {
      return false
    }

    const { selectedConfigs } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedConfigs',
        message: 'Select configs to run:',
        choices: configs.map((config) => ({
          name: `${config.name} (${config.content.description || 'No description'})`,
          value: config,
          checked: false,
        })),
        pageSize: 10,
        loop: false,
      },
    ])

    if (selectedConfigs.length === 0) {
      console.log(chalk.yellow('No configs selected'))
      return false
    }

    let success = true
    for (const config of selectedConfigs) {
      const result = await this.runConfig(config)
      success = success && result
    }

    console.log(chalk.green(`\nCompleted repomix generation for ${mode}`))
    return success
  }

  private async runAll() {
    const allConfigs = await this.getAllConfigs()
    const modes = Object.keys(allConfigs)

    if (modes.length === 0) {
      console.log(chalk.yellow('No configs found'))
      return false
    }

    const { selectedMode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedMode',
        message: 'Select mode:',
        choices: modes.map((mode) => ({
          name: `${mode} (${allConfigs[mode].length} configs)`,
          value: mode,
        })),
        pageSize: 10,
      },
    ])

    return this.runForMode(selectedMode)
  }
}
