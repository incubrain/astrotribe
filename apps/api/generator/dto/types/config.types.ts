// tools/generators/dto/core/config.types.ts
import type { ModelMetadata } from './model.types'
import type { TemplateConfig } from './template.types'
import type { ValidationConfig } from './validation.types'

export interface CustomGenerator {
  name: string
  generate: (model: ModelMetadata) => Promise<void>
}

export interface GeneratorOptions {
  outputPath: string
  prettierConfig?: string
  documentation?: {
    enabled: boolean
    outputFormat: 'markdown' | 'html'
    includeExamples: boolean
  }
  validation?: {
    enabled: boolean
    useClassValidator: boolean
    useZod: boolean
  }
  transformation?: {
    enabled: boolean
    useCamelCase: boolean
    dateTransformation: boolean
  }
  typescript?: {
    strict: boolean
    generateInterfaces: boolean
    generateTypeGuards: boolean
  }
  includeGeneratedFields?: boolean
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface GeneratorConfig {
  templatesPath: string
  outputPath: string
  prettierConfig?: string
  types: TypeMappingConfig
  validation: ValidationConfig
  templates: TemplateConfig
  plugins: PluginConfig[]
  output: OutputConfig
  hooks: HooksConfig
}
export interface TypeMappingConfig {
  defaultMappings: Record<string, string>
  customMappings: Record<string, string>
  typeConverters: Record<string, TypeConverter>
  genericTypes: GenericTypeConfig[]
}

export interface TypeConverter {
  toTypeScript: (value: any) => string
  toDatabase: (value: any) => string
  validate: (value: any) => boolean
}

export interface GenericTypeConfig {
  name: string
  typeParameters: number
  template: string
}

export interface PluginConfig {
  name: string
  enabled: boolean
  options?: Record<string, any>
  beforeGenerate?: () => Promise<void>
  afterGenerate?: () => Promise<void>
  generators?: CustomGenerator[]
}

export interface OutputConfig {
  format: 'typescript' | 'javascript'
  moduleSystem: 'esm' | 'commonjs'
  fileNaming: FileNamingConfig
  structure: OutputStructureConfig
}

export interface FileNamingConfig {
  case: 'kebab' | 'camel' | 'pascal'
  prefix?: string
  suffix?: string
}

export interface OutputStructureConfig {
  baseDir: string
  separateDirectories: boolean
  generateIndex: boolean
}

export interface HooksConfig {
  beforeGeneration?: () => Promise<void>
  afterGeneration?: () => Promise<void>
  beforeModelGeneration?: (model: ModelMetadata) => Promise<void>
  afterModelGeneration?: (model: ModelMetadata) => Promise<void>
}
