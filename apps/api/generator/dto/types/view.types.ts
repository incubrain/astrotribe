import type { ComputedColumnMetadata } from './field.types'

export interface ViewMetadata {
  sourceQuery: string
  materialized: boolean
  updatable: boolean
  dependencies: string[]
  computedColumns: ComputedColumnMetadata[]
}
