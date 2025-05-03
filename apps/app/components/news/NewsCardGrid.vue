<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { useBookmarkStore } from '@/stores/useBookmarkStore'
import { useVotesStore } from '@/stores/useVotesStore'
import { extractPlainText } from '~/utils/extractPlainText'

// Define props with better typing
interface NewsCardProps {
  news: {
    id: string
    content_type: string
    title: string
    url: string
    hot_score: number
    vote_count?: number
    created_at: string
    updated_at: string
    published_at: string | null
    featured_image: string | null
    author: string | null
    description: string | null
    source_id: string | null
    details?: {
      categories?: Array<{ name: string; isPrimary: boolean }>
      tags?: string[]
      summaries?: Record<string, Array<{ id: string; summary: string; version: number }> | null>
      readTime?: number
      company_name?: string
      company_logo?: string
      source_name?: string
    }
  }
}

const props = defineProps<NewsCardProps>()

// Setup stores
const bookmarkStore = useBookmarkStore()
const voteStore = useVotesStore()

// Local card state
const isFlipped = ref(false)
const isBookmarked = computed(() =>
  bookmarkStore.isBookmarked(props.news.id, props.news.content_type),
)
const displayScore = computed(() => voteStore.getScore(props.news.id) ?? props.news.vote_count ?? 0)
const currentVote = computed(() => voteStore.getVoteType(props.news.id))

// Handle voting
const handleVote = async (voteType: number) => {
  try {
    await voteStore.submitVote(props.news.id, voteType, props.news.content_type)
  } catch (error: any) {
    console.error('Error submitting vote:', error)
  }
}

// Toggle bookmark
const toggleBookmark = async () => {
  try {
    await bookmarkStore.handleToggleBookmark({
      id: props.news.id,
      type: props.news.content_type,
      title: props.news.title,
      description: props.news.description,
      thumbnail: props.news.featured_image,
      url: props.news.url,
      author: props.news.author,
    })
  } catch (error: any) {
    console.error('Error toggling bookmark:', error)
  }
}

// Extract category badges
const categories = computed(() => props.news.details?.categories?.map((c) => c.name) || [])

// Extract the primary category
const primaryCategory = computed(() => {
  const primary = props.news.details?.categories?.find((c) => c.isPrimary)
  return primary?.name || categories.value[0] || 'News'
})

// Get source name from details
const sourceName = computed(() => {
  if (props.news.details?.source_name) return props.news.details.source_name

  // Try to extract from URL (SAFE STRING ONLY)
  if (props.news.url) {
    try {
      const hostname = props.news.url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
      return hostname
    } catch {
      return 'Source'
    }
  }
  return 'Source'
})

// Calculate reading time (fallback to estimate if not provided)
const readingTime = computed(() => {
  if (props.news.details?.readTime) return props.news.details.readTime

  // Estimate based on description length (avg reading speed: 200 words/min)
  if (props.news.description) {
    const wordCount = props.news.description.split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }
  return 2 // Default fallback
})

const summaryText = computed(() => {
  const uncleanText =
    props.news.details?.summaries?.undefined?.[0]?.summary ?? props.news.description
  const plainText = extractPlainText(uncleanText || '')
  return plainText.length > 400 ? plainText.slice(0, 400) + '...' : plainText
})

// Format published date
const publishedTimeAgo = computed(() => {
  if (!props.news.published_at) return ''
  return useTimeAgo(new Date(props.news.published_at)).value
})

// Handle interaction based on device
const handleCardClick = (event: MouseEvent) => {
  // Don't flip if clicking on a link or button
  const target = event.target as HTMLElement
  if (target.closest('a') || target.closest('button')) {
    event.stopPropagation()
    return
  }
  isFlipped.value = !isFlipped.value
}

const handleMouseEnter = () => {
  isFlipped.value = true
}

const handleMouseLeave = () => {
  isFlipped.value = false
}

// Metrics tracking
const { trackNewsVisit } = useUserMetricsStore()
let cleanupVisit: (() => Promise<void>) | null = null

// Track when user visits source
const handleSourceVisit = async () => {
  cleanupVisit = await trackNewsVisit(props.news.id)
}

// Clean up when component is unmounted
onBeforeUnmount(async () => {
  if (cleanupVisit) {
    await cleanupVisit()
  }
})

// Image fallback
const fallbackImage = '/images/news_fallback.jpg'
const imageSource = computed(() => props.news.featured_image || fallbackImage)

const clippedSummary = computed(() => {
  const uncleanText =
    props.news.details?.summaries?.undefined?.[0]?.summary ?? props.news.description
  const plainText = extractPlainText(uncleanText || '')
  return plainText.length > 200 ? plainText.slice(0, 200) + '...' : plainText
})
</script>

<template>
  <div
    class="bg-primary-950 border border-primary-800/30 rounded-lg p-4 flex flex-col justify-between h-full hover:bg-primary-900 transition"
  >
    <div>
      <!-- Category & Source -->
      <div class="flex items-center justify-between mb-3 text-xs text-primary-500">
        <NewsCategoryBadge :category="primaryCategory" />
        <span>{{ sourceName }}</span>
      </div>

      <div class="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <span>{{ publishedTimeAgo }}</span>
        <span>•</span>
        <span>{{ readingTime }}m read</span>
      </div>

      <!-- Title -->
      <h3
        class="text-xl font-bold mb-2 line-clamp-2"
        :title="news.title"
      >
        {{ news.title }}
      </h3>

      <!-- Summary -->
      <p class="text-sm text-gray-300 leading-relaxed mb-4">
        {{ clippedSummary }}
      </p>

      <!-- Tags -->
      <div
        v-if="news.details?.tags?.length"
        class="flex flex-wrap gap-2 mb-4"
      >
        <PrimeChip
          v-for="tag in news.details.tags.slice(0, 5)"
          :key="tag"
          class="bg-primary-800/50 text-xs"
        >
          {{ tag }}
        </PrimeChip>
      </div>
    </div>

    <!-- Footer -->
    <!-- Actions (BOTTOM) -->
    <div class="flex items-center justify-between pt-4 border-t border-primary-800/50 mt-4">
      <!-- Vote buttons -->
      <div class="flex items-center gap-3">
        <button
          :class="currentVote === 1 ? 'text-green-500' : ''"
          class="w-5 h-5 flex items-center justify-center"
          @click.stop="handleVote(1)"
          >▲</button
        >
        <span>{{ displayScore }}</span>
        <button
          :class="currentVote === -1 ? 'text-red-500' : ''"
          class="w-5 h-5 flex items-center justify-center"
          @click.stop="handleVote(-1)"
          >▼</button
        >
      </div>

      <!-- Bookmark + Article -->
      <div class="flex items-center gap-3">
        <button
          :class="isBookmarked ? 'text-amber-500' : ''"
          class="w-5 h-5 flex items-center justify-center"
          @click.stop="toggleBookmark"
          >🔖</button
        >
        <NuxtLink
          :to="news.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 text-sm font-medium hover:text-primary-400 transition"
          @click.stop="handleSourceVisit"
        >
          <span>Article</span>
          <Icon
            name="mdi:arrow-top-right"
            class="w-3 h-3"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
