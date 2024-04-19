import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DeleteInput,
  SelectInput,
  BaseOperationInput,
  SelectInput,
  InsertInput,
  UpdateInput,
  UpsertInput,
  Database,
  TableKey
} from './base.interface'

import { logger } from './logger'
import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser
} from '#supabase/server'

interface ModelConstructor<T> {
  new (data: T): T
}

interface BaseConstructor<T> {
  loggerPrefix: string
  Model: ModelConstructor<T>
}

export abstract class BaseRepository<T> {
  private client!: SupabaseClient<Database>
  private clientAdmin!: SupabaseClient<Database>
  protected Model: ModelConstructor<T>
  protected logger

  constructor({ loggerPrefix, Model }: BaseConstructor<T>) {
    this.logger = logger.child({ loggerPrefix })
    this.Model = Model
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

  protected processResponse(data: any): T | T[] {
    try {
      return Array.isArray(data) ? data.map((item) => new this.Model(item)) : new this.Model(data)
    } catch (error) {
      this.logger.error('Data validation failed', error)
      throw createError({ message: 'Data validation failed: ' + error.message })
    }
  }

  private async constructSelectQuery<K extends TableKey>(
    client: SupabaseClient<Database>,
    input: BaseOperationInput<T, K>
  ) {
    let query = client.from(input.tableName).select(input.selectStatement)
    if (input.filterBy) {
      query = query.filter(
        String(input.filterBy.columnName),
        input.filterBy.operator,
        input.filterBy.value
      )
    }

    if (input.pagination) {
      query = query.range(input.pagination.from, input.pagination.to)
    }

    if (input.limit) {
      query = query.limit(input.limit)
    }

    return await query
  }

  // DATABASE LOGIC

  async selectOne<K extends TableKey>(input: SelectInput<T, K>): Promise<T | T[]> {
    this.logger.info(`selectOne ${input.filterBy}`)
    const response = await this.clientQuery(
      async (client) =>
        await client
          .from(input.tableName)
          .select(input.selectStatement)
          .filter(input.filterBy.columnName, input.filterBy.operator, input.filterBy.value)
          .single()
    )
    const data = this.handleDBErrors(response)
    return new this.Model(data) as T
  }

  async selectMany<K extends TableKey>(input: SelectInput<T, K>): Promise<T[]> {
    this.logger.info(`selectMany ${input.tableName}`)
    const response = await this.clientQuery(async (client) => {
      const query = this.constructSelectQuery<K>(client, input)
      return await query
    })
    const data = this.handleDBErrors(response)
    console.log('initial response', data)
    return this.processResponse(data) as T[]
  }

  async insertOne<K extends TableKey>(input: InsertInput<T, K>): Promise<T> {
    this.logger.info('insert')
    const response = await this.clientQuery(
      async (client) => await client.from(input.tableName).insert(input.data)
    )
    return this.handleDBErrors(response)
  }

  async insertOneRestricted<K extends TableKey>(input: InsertInput<T, K>): Promise<T> {
    this.logger.info('insert')
    const response = await this.clientQueryAdmin(
      async (client) => await client.from(input.tableName).insert(input.data).select()
    )
    return this.handleDBErrors(response)
  }

  async inserteMany<K extends TableKey>(input: InsertInput<T, K>): Promise<T> {
    this.logger.info('insert')
    const response = await this.clientQuery(
      async (client) => await client.from(input.tableName).insert(input.data).select()
    )
    return this.handleDBErrors(response)
  }

  async insertManyRestricted<K extends TableKey>(input: InsertInput<T, K>): Promise<T> {
    this.logger.info('insert')
    const response = await this.clientQueryAdmin(
      async (client) => await client.from(input.tableName).insert(input.data).select()
    )
    return this.handleDBErrors(response)
  }

  async updateById<K extends TableKey>(input: UpdateInput<T, K>): Promise<T> {
    this.logger.info('update')

    const response = await this.clientQuery(
      async (client) =>
        await client
          .from(input.tableName)
          .update(input.data)
          .eq(input.filterBy.columnName, input.filterBy.value)
    )
    return this.handleDBErrors(response)
  }

  async updateMany<K extends TableKey>(input: UpdateInput<T, K>): Promise<T> {
    this.logger.info('update')

    const response = await this.clientQuery(
      async (client) =>
        await client
          .from(input.tableName)
          .update(input.data)
          .eq(input.filterBy.columnName, input.filterBy.value)
    )

    return this.handleDBErrors(response)
  }

  async upsertOne<K extends TableKey>(input: UpsertInput<T, K>): Promise<T> {
    this.logger.info('upsert')

    const response = await this.clientQuery(
      async (client) =>
        await client.from(input.tableName).upsert(input.data, {
          onConflict: input.onConflict,
          ignoreDuplicates: input.ignoreDuplicates
        })
    )

    return this.handleDBErrors(response)
  }

  async upsertMany<K extends TableKey>(input: UpsertInput<T, K>): Promise<T> {
    this.logger.info('upsertMany')

    const response = await this.clientQuery(
      async (client) =>
        await client.from(input.tableName).upsert(input.data, {
          onConflict: input.onConflict,
          ignoreDuplicates: input.ignoreDuplicates
        })
    )

    return this.handleDBErrors(response)
  }

  async deleteById<K extends TableKey>(input: DeleteInput<T, K>): Promise<void> {
    // query = query.delete()
    const response = await this.clientQuery(
      async (client) =>
        await client
          .from(input.tableName)
          .delete()
          .eq(input.filterBy.columnName, input.filterBy.value)
    )

    return this.handleDBErrors(response)
  }

  async deleteMany<K extends TableKey>(input: DeleteInput<T, K>): Promise<void> {
    const response = await this.clientQuery(
      async (client) =>
        await client
          .from(input.tableName)
          .delete()
          .eq(input.filterBy.columnName, input.filterBy.value)
          .select()
    )

    return this.handleDBErrors(response)
  }
}

// !logic:low:med:2 - create a constructQuery function that takes multiple filters and applies the .eq() etc functions in a switch
