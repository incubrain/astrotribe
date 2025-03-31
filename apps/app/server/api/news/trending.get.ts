import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Get Supabase client
    const client = await serverSupabaseClient(event)

    // Fetch recent hot content to extract trending topics
    const { data, error } = await client
      .from('contents')
      .select('title, description, details, hot_score')
      .eq('content_type', 'news')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('hot_score', { ascending: false })
      .limit(20) // Limit to hottest items

    if (error) {
      throw error
    }

    // Extract topics from titles, descriptions, and tags
    const topics = extractTrendingTopics(data)

    return {
      data: topics.slice(0, 10), // Return top 10 topics
      error: null,
    }
  } catch (error: any) {
    console.error('Error fetching trending topics:', error)
    return {
      data: [
        // Fallback trending topics if API fails
        'Space Exploration',
        'NASA',
        'SpaceX',
        'Astronomy',
        'Black Holes',
        'Mars Mission',
        'Exoplanets',
        'Telescope',
        'ISS',
        'Astrophysics',
      ],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})

// Helper function to extract trending topics
function extractTrendingTopics(data: any[]): string[] {
  // Combine all text content
  const allText = data
    .map((item) => {
      return [item.title || '', item.description || '', ...(item.details?.tags || [])].join(' ')
    })
    .join(' ')

  // Common keywords to ignore
  const stopWords = new Set([
    'the',
    'and',
    'a',
    'an',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'as',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'from',
    'that',
    'this',
    'these',
    'those',
    'it',
    'its',
    'they',
    'them',
    'their',
    'there',
    'here',
    'where',
    'when',
    'how',
    'what',
    'why',
    'who',
  ])

  // Space-related keywords to prioritize
  const spaceKeywords = [
    'NASA',
    'SpaceX',
    'ESA',
    'Mars',
    'Moon',
    'Jupiter',
    'Saturn',
    'Venus',
    'Mercury',
    'Uranus',
    'Neptune',
    'Pluto',
    'Sun',
    'Solar',
    'Lunar',
    'Galaxy',
    'Universe',
    'Cosmic',
    'Telescope',
    'Astronaut',
    'Satellite',
    'Rover',
    'Rocket',
    'Launch',
    'Mission',
    'Space',
    'Astronomy',
    'Planets',
    'Stars',
    'Meteor',
    'Asteroid',
    'Comet',
    'Spacecraft',
    'ISS',
    'Orbit',
    'Black Hole',
    'Exoplanet',
    'Nebula',
    'Supernova',
    'Telescope',
    'Webb',
    'Hubble',
    'JWST',
    'Perseverance',
    'Curiosity',
    'Apollo',
    'Artemis',
  ]

  // Extract words, count frequencies, and filter for interesting topics
  const words = allText.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
  const wordFreq: Record<string, number> = {}

  words.forEach((word) => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })

  // Also add specific space keywords directly from the tags
  data.forEach((item) => {
    const tags = item.details?.tags || []
    tags.forEach((tag: string) => {
      if (tag) {
        spaceKeywords.forEach((keyword) => {
          if (tag.toLowerCase().includes(keyword.toLowerCase())) {
            const word = keyword.toLowerCase()
            wordFreq[word] = (wordFreq[word] || 0) + 3 // Give higher weight to keywords in tags
          }
        })
      }
    })
  })

  // Find bi-grams (two-word phrases) for more meaningful topics
  const bigramFreq: Record<string, number> = {}
  for (let i = 0; i < words.length - 1; i++) {
    if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
      const bigram = `${words[i]} ${words[i + 1]}`
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1
    }
  }

  // Combine single words and bigrams
  const topicFreq = { ...wordFreq, ...bigramFreq }

  // Sort by frequency
  const sortedTopics = Object.entries(topicFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => {
      // Capitalize properly
      return topic
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    })

  // Ensure we have some space keywords (fallback if nothing is extracted)
  if (sortedTopics.length < 5) {
    return spaceKeywords.slice(0, 10)
  }

  return sortedTopics
}
