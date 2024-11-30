<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { ref, onMounted } from 'vue'

export interface Company {
  id: string
  name: string
  logo_url?: string
}

export interface NewsCardT {
  id: string
  title: string
  description: string
  author: string
  published_at?: string
  featured_image: string
  created_at: string
  url: string
  comments: number
  score?: number
  company_id?: string
  companies?: Company
}

interface Props {
  news: NewsCardT
}

const props = defineProps<Props>()
const voteStore = useVoteStore()
const isFlipped = ref(false)

const showModal = ref(false)
const modalContent = ref('')
const currentVote = ref<number | null>(null)
const score = ref(props.news.score || 0)

const bookmarkStore = useBookmarkStore()
const bookmarked = computed(() => bookmarkStore.isBookmarked(props.news.id))
const showBookmarkFeedback = ref(false)

const folderStore = useFolderStore()

const handleBookmark = async () => {
  const folder = folderStore.getDefaultFolder

  console.log('Bookmarking news:', props.news.id, folder.id)
  try {
    await bookmarkStore.toggleBookmark({
      id: props.news.id,
      type: 'news',
      title: props.news.title,
      thumbnail: props.news.featured_image,
      url: props.news.url,
      author: props.news.author,
      folder_id: folder.id,
    })
    showBookmarkFeedback.value = true
    setTimeout(() => {
      showBookmarkFeedback.value = false
    }, 1000)
  } catch (error) {
    console.error('Error handling bookmark:', error)
  }
}

const displayScore = computed(() => {
  const currentScore = voteStore.getScore(props.news.id) ?? score.value

  // Only show negative numbers if user has downvoted
  if (currentScore < 0 && currentVote.value !== -1) {
    return 0
  }
  return currentScore
})

const sourceDisplay = computed(() => {
  const company = props.news.companies
  const author = props.news.author

  if (company?.name && author) {
    return `${author} • ${company.name}`
  } else if (company?.name) {
    return company.name
  } else if (author) {
    return author
  }
  return 'Unknown source'
})

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
      voteStore.setVotes(props.news.id, props.news.score || 0)
  } catch (error) {
    console.error('Error fetching vote status:', error)
  }
})

const handleVoteChange = ({ change }: { voteType: number | null; change: number }) => {
  score.value += change
}

const openModal = (feature: string) => {
  modalContent.value = `The ${feature} feature is coming soon! Stay tuned for updates.`
  showModal.value = true
}

const imageSource = computed(() => {
  if (props.news.featured_image) {
    return props.news.featured_image
  }
  // You can choose either random or deterministic fallbacks
  // return getRandomFallbackImage() // Random each time
  return 'fallback.jpg'
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
        bookmarked ? 'border-amber-500/30 golden-glow' : 'border-color',
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
                  :src="news.companies?.logo_url ?? `https://picsum.photos/24/24?random=${news.id}`"
                  alt="Source"
                  class="w-full h-full object-cover"
                  width="24"
                  height="24"
                />
              </div>
              <!-- Source and author info -->
              <div class="flex flex-col min-w-0">
                <span
                  v-if="news.companies?.name"
                  class="font-medium text-sm truncate"
                >
                  {{ formatSourceName(news.companies.name) }}
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
            <div class="mb-4">
              <div class="relative w-full pb-[56.25%]">
                <NuxtImg
                  :provider="news.featured_image ? 'supabase' : undefined"
                  :src="imageSource"
                  :alt="news.title"
                  class="absolute inset-0 w-full h-full object-cover rounded-lg"
                  sizes="sm:100vw md:50vw lg:400px"
                />
              </div>
            </div>
            <NewsActions
              :news-id="news.id"
              :score="displayScore"
              :comments-count="news.comments"
              :bookmarked="bookmarked"
              :url="news.url"
              :current-vote="currentVote"
              card-side="front"
              :on-bookmark="handleBookmark"
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
            class="text-xl font-bold mb-4 line-clamp-3 min-h-[3.5rem]"
            :title="news.title"
          >
            {{ news.title }}</h3
          >
          <p class="text-base overflow-y-auto flex-grow">{{ news.description }}</p>
        </div>

        <!-- Back side actions -->
        <NewsActions
          :news-id="news.id"
          :score="displayScore"
          :comments-count="news.comments"
          :bookmarked="bookmarked"
          :url="news.url"
          :current-vote="currentVote"
          card-side="back"
          :on-bookmark="handleBookmark"
          :on-source-visit="handleSourceVisit"
          @vote-change="handleVoteChange"
          @open-modal="openModal"
        />
      </div>
    </div>
  </div>

  <PrimeDialog
    v-model:visible="showModal"
    modal
    header="Coming Soon"
    :style="{ width: '50vw' }"
  >
    <p>{{ modalContent }}</p>
  </PrimeDialog>
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

.golden-glow {
  box-shadow:
    0 0 15px 1px rgba(251, 191, 36, 0.1),
    0 0 25px 2px rgba(251, 191, 36, 0.05),
    inset 0 0 15px 1px rgba(251, 191, 36, 0.05);
  animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%,
  100% {
    box-shadow:
      0 0 15px 1px rgba(251, 191, 36, 0.1),
      0 0 25px 2px rgba(251, 191, 36, 0.05),
      inset 0 0 15px 1px rgba(251, 191, 36, 0.05);
  }
  50% {
    box-shadow:
      0 0 20px 2px rgba(251, 191, 36, 0.15),
      0 0 35px 4px rgba(251, 191, 36, 0.1),
      inset 0 0 20px 2px rgba(251, 191, 36, 0.1);
  }
}
</style>
