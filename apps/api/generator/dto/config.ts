// tools/generators/dto/config.ts
import { cosmiconfig } from 'cosmiconfig'
import type { GeneratorOptions } from './types'

/**
 * Configuration management for the DTO generator.
 * Handles loading and merging of configuration from multiple sources:
 * - Default configuration
 * - Configuration file (.dtogenrc, package.json, etc.)
 * - Command line arguments
 */
export class ConfigurationManager {
  private static readonly DEFAULT_CONFIG: GeneratorOptions = {
    outputPath: 'src/generated',
    documentation: {
      enabled: true,
      outputFormat: 'markdown',
      includeExamples: true,
    },
    validation: {
      enabled: true,
      useClassValidator: true,
      useZod: false,
    },
    transformation: {
      enabled: true,
      useCamelCase: true,
      dateTransformation: true,
    },
    typescript: {
      strict: true,
      generateInterfaces: true,
      generateTypeGuards: true,
    },
  }

  /**
   * Loads and merges configuration from all sources.
   */
  static async loadConfiguration(
    cliOptions: Partial<GeneratorOptions> = {},
  ): Promise<GeneratorOptions> {
    // Load configuration file using cosmiconfig
    const explorer = cosmiconfig('dtogen')
    const result = await explorer.search()

    // Merge configurations with priority: CLI > File > Default
    return {
      ...this.DEFAULT_CONFIG,
      ...(result?.config || {}),
      ...cliOptions,
    }
  }

  /**
   * Validates the configuration to ensure all required options are present
   * and have valid values.
   */
  static validateConfiguration(config: GeneratorOptions): void {
    // Validate output path
    if (!config.outputPath) {
      throw new Error('Output path is required')
    }

    // Validate documentation configuration
    if (config.documentation.enabled) {
      if (!['markdown', 'html'].includes(config.documentation.outputFormat)) {
        throw new Error('Invalid documentation format')
      }
    }

    // Add additional validation as needed
  }
}
