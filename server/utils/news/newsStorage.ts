import { H3Event } from 'h3'

export default async function newsStorage(formattedPosts: any[], event: H3Event) {
  const supabase = dbClientAdmin(event)
  const { data: newsData, error: newsError } = await supabase
    .from('news')
    .upsert(formattedPosts, { onConflict: 'url', ignoreDuplicates: false })
    .select()

  if (newsError) {
    console.error('error storing posts:', formattedPosts[0].link, newsError)
    return
  }

  if (!newsData) {
    console.error('no data returned from supabase')
  }
}
