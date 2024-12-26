// server/api/users/metrics/[action].ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const action = event.context.params?.action

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  try {
    switch (action) {
      case 'get':
        return await getUserMetrics(client, user.id)

      case 'track-source-visit': {
        const { newsId, timeSpent } = await readBody(event)
        return await trackSourceVisit(client, user.id, newsId, timeSpent)
      }

      case 'get-achievements':
        return await getAchievements(client, user.id)

      case 'update-title': {
        const { title } = await readBody(event)
        return await updateTitle(client, user.id, title)
      }

      case 'get-reading-time': {
        const { newsId: id } = await readBody(event)
        return await getReadingTime(client, user.id, id)
      }

      default:
        throw createError({
          statusCode: 400,
          message: 'Invalid action',
        })
    }
  } catch (error: any) {
    console.error(`Metrics API error (${action}):`, error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process metrics action',
    })
  }
})

async function getUserMetrics(client: any, userId: string) {
  // Get user metrics, they should already exist due to our DB triggers
  const { data: metrics, error } = await client
    .from('user_metrics')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error

  // Get today's activity for real-time tracking
  const today = new Date().toISOString().split('T')[0]
  const { data: todayVotes } = await client
    .from('votes')
    .select('created_at, vote_type')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`)
    .order('created_at', { ascending: false })

  const { data: todayBookmarks } = await client
    .from('bookmarks')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`)

  return {
    ...metrics,
    today_activity: {
      votes: todayVotes || [],
      bookmarks: todayBookmarks || [],
    },
  }
}

async function trackSourceVisit(client: any, userId: string, newsId: string, timeSpent: number) {
  // First record the visit
  const { error: visitError } = await client.from('content_source_visits').insert({
    user_id: userId,
    content_id: newsId,
  })

  if (visitError) throw visitError

  // Update reading time if provided
  if (timeSpent) {
    const { error: timeError } = await client
      .from('user_metrics')
      .update({
        total_reading_time: timeSpent,
      })
      .eq('user_id', userId)

    if (timeError) throw timeError
  }

  return await getUserMetrics(client, userId)
}

async function getAchievements(client: any, userId: string) {
  const { data: metrics, error } = await client
    .from('user_metrics')
    .select('achievements')
    .eq('user_id', userId)
    .single()

  if (error) throw error

  // Get completed achievements count
  const completedCount = countCompletedAchievements(metrics.achievements)

  return {
    achievements: metrics.achievements,
    stats: {
      completed: completedCount,
      total: getTotalAchievements(metrics.achievements),
    },
  }
}

async function updateTitle(client: any, userId: string, newTitle: string) {
  const { data: metrics, error } = await client
    .from('user_metrics')
    .select('titles')
    .eq('user_id', userId)
    .single()

  if (error) throw error

  // Verify title is unlocked
  if (!metrics.titles.unlocked_titles.includes(newTitle)) {
    throw createError({
      statusCode: 400,
      message: 'Title not unlocked',
    })
  }

  const { data: updatedMetrics, error: updateError } = await client
    .from('user_metrics')
    .update({
      titles: {
        ...metrics.titles,
        current_title: newTitle,
      },
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError) throw updateError
  return updatedMetrics
}

async function getReadingTime(client: any, userId: string, newsId: string) {
  const { data, error } = await client
    .from('source_visits')
    .select('created_at')
    .eq('user_id', userId)
    .eq('content_id', newsId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) throw error

  return {
    lastVisit: data?.[0]?.created_at || null,
  }
}

// Utility functions
function updateFavoriteSources(currentSources: string[], newSource: string) {
  const sourceList = [...(currentSources || [])]
  if (!sourceList.includes(newSource)) {
    sourceList.push(newSource)
  }
  return sourceList.slice(-5) // Keep only last 5 sources
}

function countCompletedAchievements(achievements: any) {
  let count = 0
  for (const category in achievements) {
    for (const achievement in achievements[category]) {
      if (achievements[category][achievement] === true) {
        count++
      }
    }
  }
  return count
}

function getTotalAchievements(achievements: any) {
  let count = 0
  for (const category in achievements) {
    count += Object.keys(achievements[category]).length
  }
  return count
}
