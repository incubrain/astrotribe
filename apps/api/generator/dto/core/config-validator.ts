// tools/generators/dto/core/config-validator.ts

import { existsSync } from 'fs'
import type { GeneratorConfig, TypeConverter, ValidationRuleDefinition } from '../types'

/**
 * Validates the generator configuration to ensure all required options
 * are present and valid. This helps catch configuration errors early
 * in the generation process.
 */
export class ConfigValidator {
  /**
   * Main validation method that coordinates all validation checks
   */
  static async validateConfig(config: GeneratorConfig): Promise<void> {
    this.validateBasicConfig(config)
    this.validateTypeSystem(config.types)
    this.validateValidation(config.validation)
    this.validateTemplates(config.templates)
    this.validatePlugins(config.plugins)
    this.validateOutput(config.output)
    await this.validateHooks(config.hooks)
  }

  /**
   * Validates basic configuration options including paths and essential settings
   */
  private static validateBasicConfig(config: GeneratorConfig): void {
    if (!config.outputPath) {
      throw new Error('Output path must be specified')
    }

    // Validate prettier configuration if specified
    if (config.prettierConfig && !existsSync(config.prettierConfig)) {
      throw new Error(`Prettier config file not found: ${config.prettierConfig}`)
    }
  }

  /**
   * Validates type system configuration including custom mappings and converters
   */
  private static validateTypeSystem(types: GeneratorConfig['types']): void {
    // Validate custom type mappings
    Object.entries(types.customMappings).forEach(([dbType, tsType]) => {
      if (typeof tsType !== 'string') {
        throw new Error(`Invalid TypeScript type mapping for ${dbType}`)
      }
    })

    // Validate type converters
    Object.entries(types.typeConverters).forEach(([type, converter]) => {
      this.validateTypeConverter(type, converter)
    })

    // Validate generic type configurations
    types.genericTypes.forEach((genericType) => {
      if (genericType.typeParameters < 1) {
        throw new Error(`Generic type ${genericType.name} must have at least one type parameter`)
      }
      if (!genericType.template.includes('${type}')) {
        throw new Error(`Generic type ${genericType.name} template must include \${type}`)
      }
    })
  }

  /**
   * Validates validation configuration including custom rules
   */
  private static validateValidation(validation: GeneratorConfig['validation']): void {
    // Validate custom rules
    validation.customRules.forEach((rule) => {
      this.validateCustomRule(rule)
    })

    // Ensure required message templates exist
    const requiredTemplates = ['required', 'string', 'number', 'boolean']
    requiredTemplates.forEach((template) => {
      if (!validation.messageTemplates[template]) {
        throw new Error(`Missing required message template: ${template}`)
      }
    })
  }

  /**
   * Validates template configuration including paths and overrides
   */
  private static validateTemplates(templates: GeneratorConfig['templates']): void {
    // Validate template paths exist
    templates.templatePaths?.forEach((path) => {
      if (!existsSync(path)) {
        throw new Error(`Template path not found: ${path}`)
      }
    })

    // Validate template overrides
    Object.entries(templates.overrides || {}).forEach(([name, template]) => {
      if (typeof template !== 'string') {
        throw new Error(`Invalid template override for ${name}`)
      }
    })
  }

  /**
   * Validates plugin configuration including plugin existence and options
   */
  private static validatePlugins(plugins: GeneratorConfig['plugins']): void {
    plugins.forEach((plugin) => {
      if (!plugin.name) {
        throw new Error('Plugin must have a name')
      }
      if (plugin.generators?.some((g) => !g.name || !g.generate)) {
        throw new Error(`Invalid generator in plugin ${plugin.name}`)
      }
    })
  }

  /**
   * Validates output configuration including format and structure
   */
  private static validateOutput(output: GeneratorConfig['output']): void {
    const validFormats = ['typescript', 'javascript']
    if (!validFormats.includes(output.format)) {
      throw new Error(`Invalid output format: ${output.format}`)
    }

    const validModuleSystems = ['esm', 'commonjs']
    if (!validModuleSystems.includes(output.moduleSystem)) {
      throw new Error(`Invalid module system: ${output.moduleSystem}`)
    }
  }

  /**
   * Validates hook configuration ensuring all hooks are functions
   */
  private static async validateHooks(hooks: GeneratorConfig['hooks']): Promise<void> {
    Object.entries(hooks).forEach(([name, hook]) => {
      if (hook && typeof hook !== 'function') {
        throw new Error(`Invalid hook: ${name}`)
      }
    })
  }

  /**
   * Validates a type converter ensuring it has all required methods
   */
  private static validateTypeConverter(type: string, converter: TypeConverter): void {
    const requiredMethods = ['toTypeScript', 'toDatabase', 'validate']
    requiredMethods.forEach((method) => {
      if (typeof converter[method] !== 'function') {
        throw new Error(`Type converter for ${type} missing required method: ${method}`)
      }
    })
  }

  /**
   * Validates a custom validation rule ensuring it has all required properties
   */
  private static validateCustomRule(rule: ValidationRuleDefinition): void {
    if (!rule.name || !rule.decorator || !rule.validate) {
      throw new Error('Custom validation rule missing required properties')
    }
    if (typeof rule.validate !== 'function') {
      throw new Error(`Invalid validator function for rule: ${rule.name}`)
    }
  }
}
