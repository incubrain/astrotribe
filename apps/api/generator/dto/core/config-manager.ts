// tools/generators/dto/core/config-manager.ts

import { cosmiconfig } from 'cosmiconfig'
import { defaultConfig } from './default-config'
import { ConfigValidator } from './config-validator'
import type {
  GeneratorConfig,
  ValidationRuleDefinition,
  TypeConverter,
  PluginConfig,
  GeneratorOptions,
} from '../types'

/**
 * Manages the configuration for the DTO generator, handling loading,
 * validation, and merging of configuration from multiple sources.
 */
export class ConfigurationManager {
  private config: GeneratorConfig

  constructor() {
    this.config = defaultConfig
  }

  /**
   * Loads configuration from all available sources and merges them
   * according to priority. Sources are loaded in this order:
   * 1. Default configuration
   * 2. Configuration file (.dtogenrc, package.json)
   * 3. Environment variables
   * 4. Command line arguments
   */
  async loadConfiguration(options: Partial<GeneratorOptions> = {}): Promise<GeneratorConfig> {
    // Load configuration file using cosmiconfig
    const explorer = cosmiconfig('dtogen')
    const result = await explorer.search()
    const fileConfig = result?.config || {}

    // Load environment variables
    const envConfig = this.loadEnvironmentConfig()

    // Convert GeneratorOptions to GeneratorConfig
    const configFromOptions: Partial<GeneratorConfig> = {
      outputPath: options.outputPath,
      prettierConfig: options.prettierConfig,
      validation: {
        enabledRules: options.validation?.enabled
          ? [
              'IsNotEmpty',
              'IsOptional',
              'IsString',
              'IsNumber',
              'IsBoolean',
              'IsDate',
              'IsEmail',
              'MinLength',
              'MaxLength',
              'Min',
              'Max',
            ]
          : [],
        customRules: [],
        messageTemplates: {
          required: '${field} is required',
          string: '${field} must be a string',
          number: '${field} must be a number',
          boolean: '${field} must be a boolean',
          date: '${field} must be a valid date',
          email: '${field} must be a valid email address',
          minLength: '${field} must be at least ${min} characters',
          maxLength: '${field} must be at most ${max} characters',
        },
        validators: {},
      },
    }

    // Merge configurations with priority
    this.config = this.mergeConfigurations([
      defaultConfig,
      fileConfig,
      envConfig,
      configFromOptions,
    ])

    // Validate final configuration
    await ConfigValidator.validateConfig(this.config)

    return this.config
  }

  /**
   * Registers a custom type mapping that can be used in the generator.
   * This allows adding support for new database types or overriding
   * existing type mappings.
   */
  registerCustomType(dbType: string, tsType: string, converter?: TypeConverter): void {
    this.config.types.customMappings[dbType] = tsType
    if (converter) {
      this.config.types.typeConverters[dbType] = converter
    }
  }

  /**
   * Registers a custom validation rule that can be used in generated DTOs.
   * This allows adding new validation decorators and rules beyond
   * what's built into the system.
   */
  registerValidationRule(rule: ValidationRuleDefinition): void {
    this.config.validation.customRules.push(rule)
  }

  /**
   * Registers a plugin that extends the generator's functionality.
   * Plugins can add new generators, modify the generation process,
   * or add new features to the generated code.
   */
  registerPlugin(plugin: PluginConfig): void {
    this.config.plugins.push(plugin)
  }

  /**
   * Gets the current configuration, optionally filtered to a specific section.
   */
  getConfig<K extends keyof GeneratorConfig>(section?: K): GeneratorConfig | GeneratorConfig[K] {
    if (section) {
      return this.config[section]
    }
    return this.config
  }

  /**
   * Merges multiple configuration objects, handling deep merging of
   * nested configuration options and arrays.
   */
  private mergeConfigurations(configs: Partial<GeneratorConfig>[]): GeneratorConfig {
    return configs.reduce((merged, config) => {
      return this.deepMerge(merged, config)
    }, {} as GeneratorConfig) as GeneratorConfig
  }

  /**
   * Loads configuration from environment variables, converting them
   * to the appropriate configuration structure.
   */
  private loadEnvironmentConfig(): Partial<GeneratorConfig> {
    const config: Partial<GeneratorConfig> = {}

    // Map environment variables to configuration options
    Object.entries(process.env).forEach(([key, value]) => {
      if (key.startsWith('DTOGEN_')) {
        this.setConfigValue(config, key.slice(7).toLowerCase(), value ?? '')
      }
    })

    return config
  }

  /**
   * Sets a configuration value from a flat key path, handling
   * nested configuration options.
   */
  private setConfigValue(config: any, key: string, value: string): void {
    const parts = key.split('_')
    let current = config

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      current[part] = current[part] || {}
      current = current[part]
    }

    const lastPart = parts[parts.length - 1]
    current[lastPart] = this.parseConfigValue(value)
  }

  /**
   * Parses a configuration value, converting strings to appropriate
   * types (boolean, number, etc.)
   */
  private parseConfigValue(value: string): any {
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false
    if (!isNaN(Number(value))) return Number(value)
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  /**
   * Performs a deep merge of configuration objects, properly handling
   * arrays and nested objects.
   */
  private deepMerge(target: any, source: any): any {
    if (!source) return target

    Object.keys(source).forEach((key) => {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        target[key] = this.deepMerge(target[key] || {}, source[key])
      } else {
        target[key] = source[key]
      }
    })

    return target
  }
}
