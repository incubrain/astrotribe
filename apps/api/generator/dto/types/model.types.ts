import type { DocumentationMetadata } from './documentation.types'
import type { FieldMetadata, RelationshipMetadata } from './field.types'
import type { ViewMetadata } from './view.types'

export interface ModelMetadata {
  name: string
  documentation?: DocumentationMetadata
  fields?: FieldMetadata[]
  relations?: RelationshipMetadata[]
  isView?: boolean
  viewMetadata?: ViewMetadata
}
