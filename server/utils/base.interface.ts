import type { UserDTOKey } from './user/user.dto'
import type { NewsDTOKey } from './news/news.dto'
import type { ResearchDTOKey } from './research/research.dto'
import type { CompanyDTOKey } from './company/company.dto'
import type { Database, Tables } from '~/supabase/schema.gen'

type DBTable = keyof Database['public']['Tables'] | keyof Database['public']['Views']
type DBColumns<T extends DBTable> = keyof Tables<T>
type TableSpecificColumns<T extends DBTable> = Partial<DBColumns<T>>

export { Database, Tables, DBTable }

// full list of filters here: https://postgrest.org/en/v12/references/api/tables_views.html#operators

type FilterKey =
  | 'eq'
  | 'match'
  | 'neq'
  | 'not'
  | 'gte'
  | 'gt'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is'
  | 'in'
  | 'contains'
  | 'containedBy'
  | 'rangeGt'
  | 'rangeGte'
  | 'rangeLt'
  | 'rangeLte'
  | 'rangeAdjacent'
  | 'overlaps'
  | 'textSearch'

interface Pagination {
  page?: number
  limit?: number
  from: number
  to: number
}

export type AllDTOKey = UserDTOKey | NewsDTOKey | ResearchDTOKey | CompanyDTOKey

export type GenericReturn<T> = Promise<T[] | T | null>

export type TableKey = keyof Database['public']['Tables'] | keyof Database['public']['Views']

export type FilterBy<T extends TableKey> = {
  columnName: TableSpecificColumns<T>
  operator: FilterKey
  value: string | boolean | number
}

export interface BaseOperationInput<T, K extends TableKey> {
  tableName: K
  data?: T | T[]
  selectStatement?: string
  filterBy?: FilterBy<K>
  pagination?: Pagination
  limit?: number
  isSingle?: boolean
  isReturned?: boolean
  conflictFields?: string[]
  ignoreDuplicates?: boolean
}

export interface SelectInput<T, K extends TableKey> extends BaseOperationInput<T, K> {
  selectStatement: string
}

export interface InsertInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  data: T | T[]
}

export interface UpsertInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  data: T | T[]
  onConflict: string[]
  ignoreDuplicates: boolean
}

export interface UpdateInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  data: T | T[]
  filterBy: FilterBy<K>
}

export interface DeleteInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  data: T | T[]
  filterBy: FilterBy<K>
}
