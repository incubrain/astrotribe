import type { ValidationRule, TransformationRule } from './rules.types'

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
  validationRules?: ValidationRule[]
  transformationRules?: TransformationRule[]
}

export interface RelationshipMetadata {
  name: string
  type: string
  relationType: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many'
  isRequired: boolean
  isArray: boolean
  foreign: {
    model: string
    field: string
  }
}

export interface ComputedColumnMetadata {
  name: string
  expression: string
  dependsOn: string[]
  returnType: string
}
