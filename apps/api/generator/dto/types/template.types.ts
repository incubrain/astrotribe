import type { ModelMetadata } from './model.types'
import type { DocumentationMetadata } from './documentation.types'
import type { ValidationRule } from './rules.types'
import type { TransformationRule } from './rules.types'

export type TemplateFunction = (context: any) => string

export interface TemplateContext {
  model: ModelMetadata
  imports?: string[]
  validationRules?: ValidationRule[]
  transformationRules?: TransformationRule[]
  documentation?: DocumentationMetadata
  [key: string]: any
}

export interface TemplateConfig {
  templatePaths?: string[]
  overrides?: Record<string, string>
  variables?: Record<string, any>
  functions?: Record<string, TemplateFunction>
}
