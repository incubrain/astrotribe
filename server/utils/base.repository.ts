import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DeleteInput,
  SelectInput,
  UpdateInput,
  UpsertInput,
  OperationInput,
  Database,
  TableKey
} from './base.interface'

import { logger } from './logger'
import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser
} from '#supabase/server'

interface BaseConstructor {
  loggerPrefix: string
  tableName: TableKey
}

export abstract class BaseRepository<T> {
  private client!: SupabaseClient<Database>
  private clientAdmin!: SupabaseClient<Database>
  protected logger
  protected tableName: TableKey

  constructor({ loggerPrefix, tableName }: BaseConstructor) {
    this.logger = logger.child({ loggerPrefix })
    this.tableName = tableName
  }

  async initClient() {
    this.client = await serverSupabaseClient<Database>(useEvent())
  }

  async clientQuery(queryFunc: (client: SupabaseClient<Database>) => Promise<any>) {
    await this.initClient() // Ensure the client is initialized with current session data
    return queryFunc(this.client) // Execute the query function passed as an argument
  }

  initClientAdmin() {
    this.clientAdmin = serverSupabaseServiceRole<Database>(useEvent())
  }

  clientQueryAdmin(queryFunc: (client: SupabaseClient<Database>) => Promise<any>) {
    this.initClientAdmin()
    return queryFunc(this.clientAdmin)
  }

  async isAdminUser() {
    const user = await serverSupabaseUser(useEvent())
    if (!user) return false
    // if (user.role !== 'admin') return false
    return false
  }

  protected handleDBErrors(response: { data?: any; error?: any }) {
    if (response.error) {
      this.logger.error(`handleDBErrors - Supabase Error: ${response.error.message}`)
      throw createError({ message: response.error.message })
    } else if (response.data) {
      return response.data
    }
    return null
  }

  protected async createQueryBuilder({
    operation,
    criteria,
    data
  }: OperationInput<T>): Promise<any> {
    this.logger.info('Creating query')
    await this.initClient()
    let query = this.client.from(this.tableName)

    switch (operation) {
      case 'select':
        query = query.select(criteria.select)
        break
      case 'update':
        query = query.update(data)
        break
      case 'delete':
        query = query.delete()
        break
      case 'upsert':
        query = query.upsert(data, { conflictTarget: criteria.conflictFields })
        break
    }

    // Apply filters
    if (criteria.filters) {
      this.logger.debug('criteria.filters:', criteria.filters)
      criteria.filters.forEach((filter) => {
        this.logger.debug('filter:', filter.type)
        query = query.eq(filter.field, filter.value)
      })
    }

    // Apply pagination
    if (criteria.pagination) {
      query = query.range(criteria.pagination.from, criteria.pagination.to)
    }

    if (criteria.single) {
      this.logger.info('Single record query')
      query = query.single()
    }

    this.logger.info(`Constructed query: ${JSON.stringify(query)}`)
    return query
  }

  async select(input: SelectInput<T>): Promise<T | T[]> {
    this.logger.info(`select ${input.criteria.select}`)
    const response = await this.createQueryBuilder(input)
    const data = this.handleDBErrors(response)
    return data
  }

  async create(input: CreateInput<T>): Promise<T> {
    this.logger.info('create')
    const response = await this.createQueryBuilder(input)
    const data = this.handleDBErrors(response)
    return data
  }

  async update(input: UpdateInput<T>): Promise<T> {
    this.logger.info('update')
    const response = await this.createQueryBuilder(input)
    const data = this.handleDBErrors(response)
    return data
  }

  async upsert(input: UpsertInput<T>): Promise<T> {
    this.logger.info('upsert')
    const response = await this.createQueryBuilder(input)
    const data = this.handleDBErrors(response)
    return data
  }

  async delete(input: DeleteInput<T>): Promise<void> {
    const response = await this.createQueryBuilder(input)
    this.handleDBErrors(response)
  }
}
