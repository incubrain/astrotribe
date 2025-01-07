export type TransformationType =
  | 'toDate'
  | 'toString'
  | 'toNumber'
  | 'toBoolean'
  | 'toArray'
  | 'trim'
  | 'lowercase'
  | 'uppercase'
  | 'custom'

export interface TransformationRule {
  type: TransformationType
  params?: any[]
  options?: {
    nullIfEmpty?: boolean
    preValidation?: boolean
    precision?: number
    format?: string
  }
  preValidate?: (value: any) => boolean
  transform?: (value: any) => any
}

export interface CompositeTransformationRule {
  rules: TransformationRule[]
  order: number[]
}

export interface ValidationMessageTemplates {
  required: string
  string: string
  number: string
  boolean: string
  date: string
  email: string
  minLength: string
  maxLength: string
  [key: string]: string
}

export interface ValidationContext {
  field: string
  value: any
  parameters?: Record<string, any>
  parent?: any
}

export type ValidatorFunction = (value: any) => boolean | Promise<boolean>

export interface ValidationRuleDefinition {
  name: string
  decorator: string
  parameters?: any[]
  message: string
  metadata?: {
    description?: string
    example?: string
    priority?: number
  }
  validate?: (value: any, context?: any) => boolean | Promise<boolean>
}

export interface ValidationRule {
  decorator: string
  parameters?: string[]
  message: string
}

export interface ValidationConfig {
  rules: ValidationRule[]
  messages: Record<string, string>
  customValidators: Record<string, ValidatorFunction>
}

export interface ValidationOptions {
  enabled: boolean
  useClassValidator: boolean
  useZod: boolean
  customRules?: ValidationRule[]
  customMessages?: Record<string, string>
  customValidators?: Record<string, ValidatorFunction>
}
