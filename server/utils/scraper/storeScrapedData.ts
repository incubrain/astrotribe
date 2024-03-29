import { H3Event } from 'h3'

interface StorageInput {
  event: H3Event
  data: any[]
  tableName: string
  conflictRow?: string
}

export default async function ({ event, data, tableName, conflictRow }: StorageInput) {
  const db = dbClientAdmin(event)

  if (!data.length) {
    console.error('no data to store')
    return
  }

  console.log(`storing ${data.length} rows in ${tableName} table`)

  try {
    let query = db.from(tableName).upsert(data, { ignoreDuplicates: false })
    if (conflictRow) {
      query = db.from(tableName).upsert(data, { onConflict: conflictRow, ignoreDuplicates: false })
    }
    const { error: newsError } = await query

    if (newsError) {
      console.error(`supabase error for ${tableName} table:`, newsError.message)
    }
  } catch (error) {
    console.error(`error storing rows in ${tableName}`, error)
  }
}

//   "path": "/rest/v1/papers?select=*&offset=0&limit=6&order=published_at.desc",
//   "path": "/rest/v1/news?select=*&offset=0&limit=6&order=published_at.desc",
