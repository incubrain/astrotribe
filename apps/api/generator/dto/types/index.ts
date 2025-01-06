export * from './field.types'
export * from './view.types'
export * from './postgresql.types'
export * from './config.types'

/**
 * Configuration options for the DTO generator
 */
export interface GeneratorOptions {
  outputPath: string
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

/**
 * Metadata for a field in a model
 */
export interface FieldMetadata {
  name: string
  type: string
  isRequired: boolean
  isList: boolean
  isUnique: boolean
  isId: boolean
  isReadOnly: boolean
  hasDefaultValue: boolean
  documentation?: string
  isGenerated?: boolean
  kind: 'scalar' | 'enum' | 'object'
  nativeType?: string | null
}

/**
 * Metadata for a relation in a model
 */
export interface RelationMetadata {
  name: string
  type: string
  isRequired: boolean
  isList: boolean
}

/**
 * Documentation metadata
 */
export interface DocumentationMetadata {
  description?: string
  example?: string
}

/**
 * Metadata for a model
 */
export interface ModelMetadata {
  name: string
  documentation?: DocumentationMetadata
  fields: FieldMetadata[]
  relations: RelationMetadata[]
}
