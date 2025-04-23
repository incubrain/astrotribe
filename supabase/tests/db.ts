import pg from 'pg'

const { Client } = pg

let client: pg.Client | null = null

const db = async (): Promise<pg.Client> => {
  if (client) return client

  client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
  })

  await client.connect()
  console.log('🟢 Connected to local Supabase Postgres')
  return client
}

export default db
