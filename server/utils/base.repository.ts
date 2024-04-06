import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/supabase/schema.gen'

class Logger {
  constructor(private context: string) {}

  error(message: string) {
    console.error(`[${this.context}] ${message}`)
  }

  info(message: string) {
    console.info(`[${this.context}] ${message}`)
  }
}

export abstract class BaseRepository<T> {
  private client!: SupabaseClient<Database>
  protected logger: Logger

  constructor(loggerPrefix: string) {
    this.logger = new Logger(loggerPrefix)
  }

  async initClient() {
    this.client = await dbClient(useEvent())
  }

  async clientQuery(queryFunc: (client: SupabaseClient<Database>) => Promise<any>) {
    await this.initClient() // Ensure the client is initialized with current session data
    return queryFunc(this.client) // Execute the query function passed as an argument
  }

  protected handleErrors(response: { data?: any; error?: any }) {
    if (response.error) throw new Error(response.error.message)
    return response.data
  }

  // Define abstract methods that all repositories must implement
  abstract create(entity: T): Promise<T>
  abstract update(entity: T): Promise<T>
  abstract delete(id: number | string): Promise<void>
  abstract findById(id: number | string): Promise<T | null>
}
