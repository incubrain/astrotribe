// tools/generators/dto/core/default-config.ts

import type { GeneratorConfig } from '../types'

/**
 * Default configuration for the DTO generator.
 * This provides sensible defaults for all configuration options
 * while allowing overrides through other configuration sources.
 */
export const defaultConfig: GeneratorConfig = {
  // Base configuration with essential paths
  templatesPath: './templates',
  outputPath: 'src/generated',
  prettierConfig: undefined,

  // Type system configuration with standard type mappings
  types: {
    defaultMappings: {
      // PostgreSQL to TypeScript type mappings
      varchar: 'string',
      text: 'string',
      char: 'string',
      int2: 'number',
      int4: 'number',
      int8: 'number',
      float4: 'number',
      float8: 'number',
      decimal: 'number',
      numeric: 'number',
      bool: 'boolean',
      timestamp: 'Date',
      timestamptz: 'Date',
      date: 'Date',
      time: 'string',
      timetz: 'string',
      interval: 'string',
      uuid: 'string',
      json: 'Record<string, any>',
      jsonb: 'Record<string, any>',
      bytea: 'Buffer',
    },
    customMappings: {},
    typeConverters: {},
    genericTypes: [
      {
        name: 'Array',
        typeParameters: 1,
        template: '${type}[]',
      },
      {
        name: 'Nullable',
        typeParameters: 1,
        template: '${type} | null',
      },
    ],
  },

  // Validation configuration
  validation: {
    enabledRules: [
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
    ],
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

  // Template configuration
  templates: {
    templatePaths: [],
    overrides: {},
    variables: {
      projectName: 'Generated DTOs',
      author: 'DTO Generator',
      version: '1.0.0',
    },
    functions: {},
  },

  // Plugin configuration
  plugins: [],

  // Output configuration
  output: {
    format: 'typescript',
    moduleSystem: 'esm',
    fileNaming: {
      case: 'kebab',
      prefix: '',
      suffix: '.dto',
    },
    structure: {
      baseDir: 'src/generated',
      separateDirectories: true,
      generateIndex: true,
    },
  },

  // Hooks configuration
  hooks: {},
}
