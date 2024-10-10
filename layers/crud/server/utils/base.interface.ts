type DBTable = keyof Database['public']['Tables'] & keyof Database['public']['Views']
type DBColumns<T extends DBTable> = keyof Tables<T>
type TableSpecificColumns<T extends DBTable> = Partial<DBColumns<T>>

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

export type GenericReturn<T> = Promise<T[] | T | null>

export type TableKey = keyof Database['public']['Tables'] | keyof Database['public']['Views']

export type FilterBy<T extends DBTable> = {
  columnName: TableSpecificColumns<T>
  operator: FilterKey
  value: string | boolean | number
}

type OrderBy<T extends DBTable> = {
  columnNames: TableSpecificColumns<T>[]
  ascending: boolean
  referenceTable?: string
}

type Conflict = {
  onConflict: string[]
  ignoreDuplicates: boolean
  count?: 'exact' | 'planned' | 'estimated'
  defaultToNull?: boolean
}

// todo: refactor to have options under select/insert/update/delete
// for instance we can group limit, pagination, selectStatement all under select
export interface BaseOperationInput<T, K extends DBTable> {
  tableName: K
  data?: T | T[]
  selectStatement?: string
  filterBy?: FilterBy<K> | false
  orderBy?: OrderBy<K> | false
  pagination?: Pagination | false
  limit?: number
  isSingle?: boolean
  isReturned?: boolean
  conflict?: Conflict
}

export interface SelectInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  selectStatement: string
}

export interface InsertInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  data: T | T[]
}

export interface UpsertInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  data: T | T[]
  conflict: Conflict
}

export interface UpdateInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  data: T | T[]
  filterBy: FilterBy<K>
}

export interface DeleteInput<T, K extends DBTable> extends BaseOperationInput<T, K> {
  data: T | T[]
  filterBy: FilterBy<K>
}

export type { Database, Tables, DBTable }
