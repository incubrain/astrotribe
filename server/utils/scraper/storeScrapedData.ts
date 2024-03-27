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

  console.log('storing', data)

  try {
    let query = db.from(tableName).upsert(data, { ignoreDuplicates: false })
    if (conflictRow) {
      query = db.from(tableName).upsert(data, { onConflict: conflictRow, ignoreDuplicates: false })
    }
    console.log('query', query)
    const { error: newsError } = await query

    console.log('storingError', newsError)

    if (newsError?.message) {
      console.error(`error storing ${tableName}:`, data[0].link, newsError.message)
    }
  } catch (error) {
    console.error('error storing data', error)
  }
}

//   "path": "/rest/v1/papers?select=*&offset=0&limit=6&order=published_at.desc",
//   "path": "/rest/v1/news?select=*&offset=0&limit=6&order=published_at.desc",
