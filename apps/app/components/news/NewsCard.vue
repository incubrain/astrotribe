<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { ref, onMounted } from 'vue'

// Updated interface to match new content structure
interface NewsCardT {
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
  company_id: string | null
  details: {
    // Type-specific details stored in JSONB
    categories?: Array<{ name: string; isPrimary: boolean }>
    tags?: string[]
    summaries?: {
      undefined?: Array<{ id: string; summary: string; version: number }> | null
      beginner?: Array<{ id: string; summary: string; version: number }> | null
      intermediate?: Array<{ id: string; summary: string; version: number }> | null
      expert?: Array<{ id: string; summary: string; version: number }> | null
    }
    company_name?: string
    company_logo?: string
  }
}

interface Props {
  news: NewsCardT
}

const props = defineProps<Props>()

// Helper to get data from either direct properties or details JSONB
const getContentProperty = <T,>(
  directValue: T | null | undefined,
  detailsPath?: string,
  defaultValue?: T,
): T | undefined => {
  if (directValue !== null && directValue !== undefined) {
    return directValue
  }

  if (detailsPath && props.news.details) {
    const pathParts = detailsPath.split('.')
    let value: any = props.news.details

    for (const part of pathParts) {
      if (!value || typeof value !== 'object') return defaultValue
      value = value[part]
    }

    return value !== null && value !== undefined ? value : defaultValue
  }

  return defaultValue
}

// Update computed properties
const sourceDisplay = computed(() => {
  const companyName = getContentProperty(null, 'company_name')
  const author = props.news.author

  if (companyName && author) {
    return `${author} • ${companyName}`
  } else if (companyName) {
    return companyName
  } else if (author) {
    return author
  }
  return 'Unknown source'
})

const hasSummary = computed(() => {
  const summaries = getContentProperty<any>(null, 'summaries.undefined')
  return summaries?.[0]?.summary !== undefined
})

const summary = computed(() => {
  if (hasSummary.value) {
    const summaries = getContentProperty<any>(null, 'summaries.undefined')
    return summaries[0].summary
  }
  return props.news.description
})

const voteStore = useVoteStore()
const isFlipped = ref(false)

const showModal = ref(false)
const modalContent = ref('')
const votes = ref(props.news.hot_score || 0)

const currentVote = computed(() => voteStore.getVoteType(props.news.id))
const displayScore = computed(() => voteStore.getScore(props.news.id) ?? props.news.vote_count ?? 0)

const bookmarkStore = useBookmarkStore()
const isBookmarked = computed(() =>
  bookmarkStore.isBookmarked(props.news.id, props.news.content_type),
)

const formatSourceName = (name: string) => {
  // Remove common suffixes like .com, .org, etc. (we might need them for things like space.com, astronomy.com etc)
  // .replace(/\.(com|org|net|io|ai)$/, '')
  return name
}

const readTime = computed(() => {
  // Calculate read time based on content length
  // This is a placeholder, replace with actual logic
  return '2m read time'
})

onMounted(async () => {
  try {
    if (voteStore.getScore(props.news.id) == null)
      voteStore.setVotes(props.news.id, props.news.hot_score || 0)
  } catch (error: any) {
    console.error('Error fetching vote status:', error)
  }
})

const handleVoteChange = ({ change }: { voteType: number | null; change: number }) => {
  votes.value += change
}

const openModal = (feature: string) => {
  modalContent.value = `The ${feature} feature is coming soon! Stay tuned for updates.`
  showModal.value = true
}

const imageSource = computed(() => {
  // if (props.news.featured_image) {
  //   return props.news.featured_image
  // }
  // You can choose either random or deterministic fallbacks
  // return getRandomFallbackImage() // Random each time
  return 'fallback-news.jpg'
  // return null
})

// Handle clicks for touch devices
const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.closest('a') || target.closest('button')) {
    event.stopPropagation()
    return
  }
  isFlipped.value = !isFlipped.value
}

// Handle hover states
const handleMouseEnter = () => {
  isFlipped.value = true
}

const handleMouseLeave = () => {
  isFlipped.value = false
}

// METRICS
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
</script>

<template>
  <div
    class="group relative h-[450px] perspective-1000 hover:cursor-pointer"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="relative w-full h-full transition-all duration-500 transform-style-preserve-3d border rounded-lg"
      :class="[
        { 'rotate-y-180': isFlipped },
        isBookmarked ? 'border-amber-500/30 ' : 'border-color',
      ]"
    >
      <!-- Front of card -->
      <div class="absolute w-full h-full backface-hidden">
        <div class="p-4 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <!-- Company logo or random image -->
              <div class="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                <NuxtImg
                  :src="
                    news.details?.company_logo ?? `https://picsum.photos/24/24?random=${news.id}`
                  "
                  alt="Source"
                  class="w-full h-full object-cover"
                  width="24"
                  height="24"
                />
              </div>
              <!-- Source and author info -->
              <div class="flex flex-col min-w-0">
                <span
                  v-if="news.details?.company_name"
                  class="font-medium text-sm truncate"
                >
                  {{ formatSourceName(news.details.company_name) }}
                </span>
                <span
                  v-if="news.author"
                  class="text-xs text-gray-400 truncate"
                >
                  {{ news.author }}
                </span>
              </div>
            </div>
            <h3
              class="text-xl font-bold mb-2 line-clamp-3 min-h-[3.5rem]"
              :title="news.title"
            >
              {{ news.title }}
            </h3>
            <div class="flex items-center text-sm mb-4">
              {{ useTimeAgo(new Date(news.published_at ?? news.created_at)).value }}
              <span class="mx-2">•</span>
              <span>{{ readTime }}</span>
            </div>
          </div>
          <div>
            <div
              v-if="imageSource"
              class="mb-4"
            >
              <div class="relative w-full pb-[56.25%]">
                <div
                  class="absolute z-50 w-full h-full flex items-center justify-center text-white font-bold text-xl"
                >
                  <h5> IMAGES SOON </h5>
                </div>
                <!-- :provider="news.featured_image ? 'supabase' : undefined" -->
                <NuxtImg
                  :src="imageSource"
                  :alt="news.title"
                  class="absolute inset-0 w-full h-full object-cover rounded-lg"
                  sizes="sm:100vw md:50vw lg:400px"
                />
              </div>
            </div>
            <NewsActions
              :content="news"
              :score="displayScore"
              :comments-count="null"
              :bookmarked="isBookmarked"
              :url="news.url"
              :current-vote="currentVote"
              card-side="front"
              :on-source-visit="handleSourceVisit"
              @vote-change="handleVoteChange"
              @open-modal="openModal"
            />
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
            {{ news.title }}</h3
          >
          <div
            v-if="hasSummary"
            class="flex items-center w-full justify-center gap-2 pb-4 text-xs"
          >
            <p class="text-sm overflow-y-auto flex-grow">
              {{ summary }}
            </p>
          </div>
          <div
            v-else
            class="flex items-center w-full justify-center gap-2 pb-4 text-xs"
          >
            <p class="text-sm overflow-y-auto flex-grow">
              {{ news.description }}
            </p>
          </div>
        </div>

        <!-- Back side actions -->
        <NewsActions
          :score="displayScore"
          :comments-count="null"
          :bookmarked="isBookmarked"
          :url="news.url"
          :current-vote="currentVote"
          card-side="back"
          :content="news"
          :on-source-visit="handleSourceVisit"
          @vote-change="handleVoteChange"
          @open-modal="openModal"
        />
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

/* Optional: Add a smooth transition for the hover effect */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

/* Optional: Add hover state styles */
@media (hover: hover) {
  .hover\:cursor-pointer:hover {
    cursor: pointer;
  }
}
</style>
