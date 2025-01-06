import type { ViewMetadata } from './view.types'

export interface DocumentationMetadata {
  description: string
  example: any
  deprecated?: boolean
  version?: string
  since?: string
}

export interface FieldMetadata {
  name: string
  type: string
  isRequired: boolean
  isArray: boolean
  documentation: DocumentationMetadata
  validationRules: ValidationRule[]
  transformationRules: TransformationRule[]
  isComputed: boolean
  computedMetadata?: ComputedColumnMetadata
}

export interface ValidationRule {
  decorator: string
  params?: any[]
  message?: string
}

export interface TransformationRule {
  type: 'toDate' | 'toString' | 'toNumber' | 'toBoolean' | 'custom'
  params?: any[]
}

export interface ComputedColumnMetadata {
  name: string
  expression: string
  dependsOn: string[]
  returnType: string
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

export interface NestedTypeMetadata {
  type: 'object' | 'enum' | 'array'
  properties?: FieldMetadata[]
  values?: string[]
  itemType?: FieldMetadata
}

export interface ModelMetadata {
  name: string
  documentation: DocumentationMetadata
  fields: FieldMetadata[]
  relationships: RelationshipMetadata[]
  // Add view-specific metadata
  isView: boolean
  viewMetadata?: ViewMetadata
}
