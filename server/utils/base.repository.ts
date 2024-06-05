import type { SupabaseClient } from '@supabase/supabase-js'
import { BaseRepositoryAdmin } from './base.repository.admin'
import type {
  DeleteInput,
  SelectInput,
  InsertInput,
  UpdateInput,
  UpsertInput,
  Database,
  TableKey
} from './base.interface'

import { useLogger } from './base.logger'
import { serverSupabaseClient } from '#supabase/server'
import { handleDBErrors } from './base.error-handler'
import { constructQuery } from './base.construct-query'
import { processResponse } from './base.process-response'

interface ModelConstructor<T> {
  new (data: T): T
}

interface BaseConstructor<T> {
  loggerPrefix: string
  Model: ModelConstructor<T>
}

export abstract class BaseRepository<T> extends BaseRepositoryAdmin<T> {
  private client!: SupabaseClient<Database>
  protected Model: ModelConstructor<T>
  protected log

  constructor({ loggerPrefix, Model }: BaseConstructor<T>) {
    super(Model)
    this.log = useLogger(loggerPrefix)
    this.Model = Model
  }

  async initClient() {
    this.client = await serverSupabaseClient<Database>(useEvent())
  }

  async clientQuery(queryFunc: (client: SupabaseClient<Database>) => Promise<any>) {
    await this.initClient() // Ensure the client is initialized with current session data
    return queryFunc(this.client) // Execute the query function passed as an argument
  }

  async selectOne<K extends TableKey>(input: SelectInput<T, K>): Promise<T | T[]> {
    this.log.info(`selectOne ${input.filterBy}`)
    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'select' })
    )
    this.log.info('selectOne data retrieved')
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T
  }

  async selectMany<K extends TableKey>(input: SelectInput<T, K>): Promise<T[]> {
    this.log.info(`selectMany ${input.tableName}`)
    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'select' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T[]
  }

  async updateOne<K extends TableKey>(input: UpdateInput<T, K>): Promise<T> {
    this.log.info('updateOne')
    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'update' })
    )

    this.log.info('updateOne return', response)
    return handleDBErrors(response, this.log)
  }

  async updateMany<K extends TableKey>(input: UpdateInput<T, K>): Promise<T> {
    this.log.info('update')

    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'update' })
    )

    return handleDBErrors(response, this.log)
  }

  async insertOne<K extends TableKey>(input: InsertInput<T, K>): Promise<T> {
    this.log.info('insert')
    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'insert' })
    )
    return handleDBErrors(response, this.log)
  }

  async inserteMany<K extends TableKey>(input: InsertInput<T, K>): Promise<T> {
    this.log.info('inserteMany')
    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'insert' })
    )
    return handleDBErrors(response, this.log)
  }

  async upsertOne<K extends TableKey>(input: UpsertInput<T, K>): Promise<T> {
    this.log.info('upsert')

    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'upsert' })
    )

    return handleDBErrors(response, this.log)
  }

  async upsertMany<K extends TableKey>(input: UpsertInput<T, K>): Promise<T> {
    this.log.info('upsertMany')
    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'upsert' })
    )

    return handleDBErrors(response, this.log)
  }

  async deleteOne<K extends TableKey>(input: DeleteInput<T, K>): Promise<void> {
    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'delete' })
    )

    return handleDBErrors(response, this.log)
  }

  async deleteMany<K extends TableKey>(input: DeleteInput<T, K>): Promise<void> {
    const response = await this.clientQuery(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'delete' })
    )

    return handleDBErrors(response, this.log)
  }
}
