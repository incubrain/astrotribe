import type { UserDTOKey } from './user/user.dto'
import type { NewsDTOKey } from './news/news.dto'
import type { ResearchDTOKey } from './research/research.dto'
import type { CompanyDTOKey } from './company/company.dto'
import type { Database, Tables } from '~/supabase/schema.gen'

// type DBTable = keyof Database['public']['Tables']
// type DBColumns<T extends DBTable> = keyof Tables<T>
// type TableSpecificColumns<T extends DBTable> = Partial<Record<DBColumns<T>, true>>

export { Database, Tables }

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

export interface QueryFilter {
  type?: FilterKey
  field: string
  value: string | number | boolean
}

interface Pagination {
  page?: number
  limit?: number
  from: number
  to: number
}

export type AllDTOKey = UserDTOKey | NewsDTOKey | ResearchDTOKey | CompanyDTOKey

export interface FuncConfig<T> {
  data?: T | T[]
  dto: AllDTOKey
  criteria: {
    single?: boolean
    filters?: QueryFilter[] | null
    pagination?: Pagination
  }
}

export type GenericReturn<T> = Promise<T[] | T | null>

export type TableKey = keyof Database['public']['Tables'] | keyof Database['public']['Views']

// eq should map to db columns
export interface OperationInput<T> {
  operation: 'select' | 'update' | 'delete' | 'upsert' | 'insert'
  data?: T | T[]
  criteria: {
    single?: boolean
    filters?: QueryFilter[] | null
    pagination?: Pagination
    select?: string
    conflictFields?: string[]
    ignoreDuplicates?: boolean
  }
}

export interface SelectInput<T> extends OperationInput<T> {
  operation: 'select'
  criteria: {
    select: string
  }
}

export interface DeleteInput<T> extends OperationInput<T> {
  operation: 'delete'
  data: T | T[]
}

export interface CreateInput<T> extends OperationInput<T> {
  operation: 'insert'
  data: T | T[]
}

export interface UpsertInput<T> extends OperationInput<T> {
  operation: 'upsert'
  data: T | T[]
  criteria: {
    conflictFields: string[]
    ignoreDuplicates: boolean
  }
}

export interface UpdateInput<T> extends OperationInput<T> {
  operation: 'update'
  data: T | T[]
  criteria: {
    single: boolean
  }
}
