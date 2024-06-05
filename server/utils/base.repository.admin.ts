import type { SupabaseClient } from '@supabase/supabase-js'
import {
  DeleteInput,
  BaseOperationInput,
  SelectInput,
  InsertInput,
  UpdateInput,
  UpsertInput,
  Database,
  TableKey
} from './base.interface'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { handleDBErrors } from './base.error-handler'
import { constructQuery } from './base.construct-query'
import { processResponse } from './base.process-response'
import { useServerLogger } from '#imports'

interface ModelConstructor<T> {
  new (data: T): T
}

export abstract class BaseRepositoryAdmin<T> {
  private clientAdmin!: SupabaseClient<Database>
  protected Model: ModelConstructor<T>
  protected log = useServerLogger('BaseRepositoryAdmin')

  constructor(Model: ModelConstructor<T>) {
    this.Model = Model
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

    if (!user) {
      return false
    }

    if (user.app_metadata.role === 'admin' || user.app_metadata.role === 'super_admin') {
      return true
    }

    return false
  }

  async adminSelectOne<K extends TableKey>(input: SelectInput<T, K>): Promise<T | T[]> {
    this.log.info(`adminSelectOne ${input.filterBy}`)
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'select' })
    )
    this.log.info('selectOne data retrieved')
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T
  }

  async adminSelectMany<K extends TableKey>(input: SelectInput<T, K>): Promise<T[]> {
    this.log.info(`adminSelectMany ${input.tableName}`)
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'select' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T[]
  }

  async adminInsertOne<K extends TableKey>(input: InsertInput<T, K>): Promise<T> {
    this.log.info('adminInsertOne')
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'insert' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T
  }

  async adminInsertMany<K extends TableKey>(input: InsertInput<T, K>): Promise<T[]> {
    this.log.info('adminInsertMany')
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'insert' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T[]
  }

  async adminUpdateOne<K extends TableKey>(input: UpdateInput<T, K>): Promise<T> {
    this.log.info('adminUpdateOne')
    const response = await this.clientQueryAdmin(async (client) => {
      console.log('client', client)
      return await constructQuery<T, K>({ client, input, operation: 'update' })
    })
    this.log.info(`adminUpdateOne return ${JSON.stringify(response)}`)
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T
  }

  async adminUpdateMany<K extends TableKey>(input: UpdateInput<T, K>): Promise<T[]> {
    this.log.info('adminUpdateMany')
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'update' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T[]
  }

  async adminUpsertOne<K extends TableKey>(input: UpsertInput<T, K>): Promise<T> {
    this.log.info('adminUpsertOne')
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'upsert' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T
  }

  async adminUpsertMany<K extends TableKey>(input: UpsertInput<T, K>): Promise<T[]> {
    this.log.info('adminUpsertMany')
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'upsert' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T[]
  }

  async adminDeleteOne<K extends TableKey>(input: DeleteInput<T, K>): Promise<T> {
    this.log.info('adminDeleteOne')
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'delete' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T
  }

  async adminDeleteMany<K extends TableKey>(input: DeleteInput<T, K>): Promise<T[]> {
    this.log.info('adminDeleteMany')
    const response = await this.clientQueryAdmin(
      async (client) => await constructQuery<T, K>({ client, input, operation: 'delete' })
    )
    return processResponse(handleDBErrors(response, this.log), this.Model, this.log) as T[]
  }
}
