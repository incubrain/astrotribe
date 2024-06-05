import type { SupabaseClient } from '@supabase/supabase-js'
import type { BaseOperationInput, DBTable, Database } from './base.interface'

interface ConstructQueryInput<T, K extends DBTable> {
  client: SupabaseClient<Database>
  input: BaseOperationInput<T, K>
  operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert'
}

export async function constructQuery<T, K extends DBTable>({
  client,
  input,
  operation
}: ConstructQueryInput<T, K>) {
  let query

  switch (operation) {
    case 'select':
      query = client.from(input.tableName).select(input.selectStatement)
      break

    case 'insert':
      query = client.from(input.tableName).insert(input.data)
      break

    case 'update':
      query = client.from(input.tableName).update(input.data)
      break

    case 'delete':
      query = client.from(input.tableName).delete()
      break

    case 'upsert':
      query = client.from(input.tableName).upsert(input.data, input.conflict)
      break

    default:
      throw createError({ message: `Invalid constructQuery operation input ${operation}` })
  }

  if (input.filterBy) {
    query = query.filter(
      String(input.filterBy.columnName),
      input.filterBy.operator,
      input.filterBy.value
    )
  }

  if (input.orderBy) {
    input.orderBy.columnNames.forEach((columnName) => {
      query = query.order(columnName, { ascending: input.orderBy.ascending })
    })
  }

  if (input.pagination) {
    query = query.range(input.pagination.from, input.pagination.to)
  }

  if (input.limit) {
    query = query.limit(input.limit)
  }

  if (input.isSingle) {
    query = query.single()
  }

  if (input.isReturned) {
    query = query.select()
  }

  return await query
}
