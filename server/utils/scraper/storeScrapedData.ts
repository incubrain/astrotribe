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

  let query = db.from(tableName).upsert(data, { ignoreDuplicates: false })
  if (conflictRow) {
    query = db
      .from(tableName)
      .upsert(data, { onConflict: conflictRow, ignoreDuplicates: false })
  }

  const { error: newsError } = await query

  if (newsError) {
    console.error(`error storing ${tableName}:`, data[0].link, newsError)
  }
}
