<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { ref, onMounted } from 'vue'

export interface NewsCardT {
  id: string
  title: string
  description: string
  authorName: string
  published_at?: string
  featured_image: string
  created_at: string
  url: string
  comments: number
  score?: number
}

interface Props {
  news: NewsCardT
}

const props = defineProps<Props>()
const voteStore = useVoteStore()

const { isNewsBookmarked, toggleBookmark } = useBookmarks()

const showModal = ref(false)
const modalContent = ref('')
const currentVote = ref<number | null>(null)
const score = ref(props.news.score || 0)
const bookmarked = computed(() => isNewsBookmarked.value(props.news.id))

const handleBookmark = async () => {
  try {
    await toggleBookmark({
      id: props.news.id,
      type: 'news',
      title: props.news.title,
      thumbnail: props.news.featured_image,
      url: props.news.url,
    })
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
</script>

<template>
  <div class="rounded-lg relative border border-color">
    <div class="p-4 flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <NuxtImg
            :src="`https://picsum.photos/24/24?random=${news.id}`"
            alt="Author"
            class="w-6 h-6 rounded-full"
            width="24"
            height="24"
          />
          <span class="text-sm">{{ news.authorName }}</span>
        </div>
        <h2 class="text-xl font-bold mb-2">{{ news.title }}</h2>
        <div class="flex items-center text-sm mb-4">
          <span>{{ useTimeAgo(news.published_at ?? news.created_at).value }}</span>
          <span class="mx-2">•</span>
          <span>{{ readTime }}</span>
        </div>
      </div>
      <div>
        <div class="mb-4">
          <NuxtImg
            :provider="news.featured_image ? 'supabase' : undefined"
            :src="news.featured_image || 'fallback-news.jpg'"
            :alt="news.title"
            class="w-full h-auto rounded-lg"
            width="400"
            height="200"
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center bg-primary-950 py-1 px-2 rounded-xl">
              <VoteButton
                :content-id="news.id"
                direction="up"
                :initial-vote-type="currentVote"
                @vote-change="handleVoteChange"
              />
              <span class="text-sm font-medium pl-1 pr-2">{{ displayScore }}</span>
              <VoteButton
                :content-id="news.id"
                direction="down"
                :initial-vote-type="currentVote"
                @vote-change="handleVoteChange"
              />
            </div>
            <button
              class="flex items-center gap-2 text-sm hover:text-gray-600"
              @click="openModal('Comments')"
            >
              <Icon
                name="mdi:comment-outline"
                size="20px"
              />
              <span>{{ news.comments }}</span>
            </button>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="hover:text-gray-600"
              @click="handleBookmark"
            >
              <Icon
                :name="bookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
                size="20px"
                :class="{ 'text-primary-500': bookmarked }"
              />
            </button>
            <NuxtLink
              :to="news.url"
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="hover:text-gray-600"
            >
              <Icon
                name="mdi:link-variant"
                size="20px"
              />
            </NuxtLink>
          </div>
        </div>
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
