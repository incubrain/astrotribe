<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { useBookmarkStore } from '@/stores/useBookmarkStore'
import { useVotesStore } from '@/stores/useVotesStore'

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
  layout?: 'grid' | 'list'
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

// Get summary text
const summaryText = computed(() => {
  const summaries = props.news.details?.summaries
  if (summaries?.undefined?.[0]) {
    return summaries.undefined[0].summary
  }
  return props.news.description
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
</script>

<template>
  <div
    class="group relative h-[450px] perspective-1000 hover:cursor-pointer"
    :class="{ 'h-[200px] flex': layout === 'list' }"
    @click="handleCardClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="relative w-full h-full transition-all duration-500 transform-style-preserve-3d border rounded-lg"
      :class="[
        { 'rotate-y-180': isFlipped },
        isBookmarked ? 'border-amber-500/30' : 'border-primary-800/30',
        { flex: layout === 'list' },
      ]"
    >
      <!-- Front of card -->
      <div
        class="absolute w-full h-full backface-hidden"
        :class="{ flex: layout === 'list' }"
      >
        <div
          class="p-4 flex flex-col justify-between h-full w-full"
          :class="{ 'flex-row gap-4': layout === 'list' }"
        >
          <div :class="{ 'w-2/3': layout === 'list' }">
            <!-- Category & Source -->
            <div class="flex items-center justify-between mb-3">
              <NewsCategoryBadge :category="primaryCategory" />
              <span class="text-xs text-primary-500 font-medium">{{ sourceName }}</span>
            </div>

            <!-- Title & Metadata -->
            <h3
              class="text-xl font-bold mb-2 line-clamp-3"
              :class="{ 'text-lg line-clamp-2': layout === 'list' }"
              :title="news.title"
            >
              {{ news.title }}
            </h3>
            <div class="flex items-center text-xs text-gray-400 mb-4">
              <span>{{ publishedTimeAgo }}</span>
              <span class="mx-2">•</span>
              <span class="flex items-center">
                <Icon
                  name="mdi:clock-outline"
                  class="w-3 h-3 mr-1"
                />
                {{ readingTime }}m read
              </span>
            </div>
          </div>

          <!-- Image and Actions -->
          <div :class="{ 'w-1/3': layout === 'list' }">
            <div
              v-if="imageSource && layout !== 'list'"
              class="mb-4"
            >
              <div class="relative w-full pb-[56.25%]">
                <NuxtImg
                  :src="imageSource"
                  :alt="news.title"
                  class="absolute inset-0 w-full h-full object-cover rounded-lg"
                  sizes="sm:100vw md:50vw lg:400px"
                />
              </div>
            </div>

            <!-- Action bar -->
            <div class="flex items-center justify-between">
              <!-- Vote buttons -->
              <div class="flex items-center gap-1 bg-primary-950/70 rounded-lg p-1">
                <button
                  class="p-1 rounded hover:bg-primary-800/50 transition-colors"
                  :class="currentVote === 1 ? 'text-green-500' : ''"
                  @click.stop="handleVote(1)"
                >
                  <Icon
                    name="mdi:arrow-up-bold"
                    class="w-5 h-5"
                  />
                </button>
                <span class="text-sm font-medium px-1">{{ displayScore }}</span>
                <button
                  class="p-1 rounded hover:bg-primary-800/50 transition-colors"
                  :class="currentVote === -1 ? 'text-red-500' : ''"
                  @click.stop="handleVote(-1)"
                >
                  <Icon
                    name="mdi:arrow-down-bold"
                    class="w-5 h-5"
                  />
                </button>
              </div>

              <!-- Bookmark & Source buttons -->
              <div class="flex items-center gap-2">
                <button
                  class="p-1 rounded hover:bg-primary-800/50 transition-colors"
                  :class="isBookmarked ? 'text-amber-500' : ''"
                  @click.stop="toggleBookmark"
                >
                  <Icon
                    :name="isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
                    class="w-5 h-5"
                  />
                </button>
                <NuxtLink
                  :to="news.url"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  class="p-1 rounded hover:bg-primary-800/50 transition-colors"
                  @click.stop="handleSourceVisit"
                >
                  <Icon
                    name="mdi:link-variant"
                    class="w-5 h-5"
                  />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back of card -->
      <div
        class="absolute w-full h-full backface-hidden rotate-y-180 bg-primary-950 rounded-lg p-4 flex flex-col"
      >
        <!-- Back side content -->
        <div class="flex-grow overflow-hidden flex flex-col">
          <h3
            class="text-xl font-bold mb-4 line-clamp-1"
            :title="news.title"
          >
            {{ news.title }}
          </h3>
          <div
            v-if="summaryText"
            class="flex-grow overflow-y-scroll overflow-x-hidden"
          >
            <p class="text-sm text-gray-300 leading-relaxed break-words">
              {{ summaryText }}
            </p>
          </div>
          <div
            v-else
            class="flex-grow overflow-y-scroll overflow-x-hidden"
          >
            <p class="text-sm text-gray-300 leading-relaxed break-words">
              {{ news.description }}
            </p>
          </div>

          <!-- Tags -->
          <div
            v-if="news.details?.tags && news.details.tags.length > 0"
            class="mt-4 flex flex-wrap gap-2"
          >
            <PrimeChip
              v-for="tag in news.details.tags.slice(0, 5)"
              :key="tag"
              class="bg-primary-800/50 text-xs"
            >
              {{ tag }}
            </PrimeChip>
            <PrimeChip
              v-if="news.details.tags.length > 5"
              class="bg-primary-800/50 text-xs"
            >
              +{{ news.details.tags.length - 5 }} more
            </PrimeChip>
          </div>
        </div>

        <!-- Back side actions -->
        <div class="flex items-center justify-between pt-4 border-t border-primary-800/50 mt-4">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1 bg-primary-950/70 rounded-lg p-1">
              <button
                class="p-1 rounded hover:bg-primary-800/50 transition-colors"
                :class="currentVote === 1 ? 'text-green-500' : ''"
                @click.stop="handleVote(1)"
              >
                <Icon
                  name="mdi:arrow-up-bold"
                  class="w-5 h-5"
                />
              </button>
              <span class="text-sm font-medium px-1">{{ displayScore }}</span>
              <button
                class="p-1 rounded hover:bg-primary-800/50 transition-colors"
                :class="currentVote === -1 ? 'text-red-500' : ''"
                @click.stop="handleVote(-1)"
              >
                <Icon
                  name="mdi:arrow-down-bold"
                  class="w-5 h-5"
                />
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="p-1 rounded hover:bg-primary-800/50 transition-colors"
              :class="isBookmarked ? 'text-amber-500' : ''"
              @click.stop="toggleBookmark"
            >
              <Icon
                :name="isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
                class="w-5 h-5"
              />
            </button>
            <NuxtLink
              :to="news.url"
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 transition-colors px-3 py-1 rounded-md text-sm font-medium"
              @click.stop="handleSourceVisit"
            >
              <span>Read Full Article</span>
              <Icon
                name="mdi:arrow-top-right"
                class="w-4 h-4"
              />
            </NuxtLink>
          </div>
        </div>
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
</style>
