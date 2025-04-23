import db from './db'

async function main() {
  const client = await db()
  console.log('🟢 Connected to local Supabase Postgres')

  const insertQuery = `
    INSERT INTO public.contents (id, content_type, url, details, summary)
    VALUES (
      gen_random_uuid(),
      'news',
      'https://example.com/article',
      $1::jsonb,
      $2
    )
    RETURNING id;
  `

  const details = {
    body: 'The Indian Space Research Organisation (ISRO) is preparing for a new lunar mission...',
  }

  try {
    const result = await client.query(insertQuery, [
      JSON.stringify(details),
      'ISRO is preparing for a lunar mission.',
    ])
    console.log(`✅ Row inserted. Triggered webhooks for ID: ${result.rows[0].id}`)
  } catch (error) {
    console.error('❌ Failed to insert row:', error)
  } finally {
    await client.end()
    console.log('🔴 Connection closed')
  }
}

main()
