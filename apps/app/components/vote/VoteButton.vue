// components/VoteButton.vue
<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  contentId: string
  contentType?: string
  count?: number
  direction: 'up' | 'down'
  cardSide: 'front' | 'back'
}

const props = withDefaults(defineProps<Props>(), { contentType: 'news', count: 0 })

const voteStore = useVotesStore()
const notification = useNotification()
const animationRef = ref()

// Convert direction to vote type (1 for up, -1 for down)
const voteType = computed(() => (props.direction === 'up' ? 1 : -1))

const currentVoteType = computed(() => voteStore.getVoteType(props.contentId))
const isPending = computed(() => voteStore.isVotePending(props.contentId))

const isActive = computed(() => {
  return props.direction === 'up' ? currentVoteType.value === 1 : currentVoteType.value === -1
})

onMounted(async () => {
  await voteStore.fetchUserVotes()
})

const handleVote = async () => {
  try {
    // Pass the content type from the new unified structure
    await voteStore.submitVote(props.contentId, voteType.value, props.contentType)
    // Optionally trigger animation
    if (animationRef.value) {
      animationRef.value.triggerAnimation()
    }
  } catch (error: any) {
    notification.error({ summary: 'Vote Error', message: 'Failed to submit vote' })
  }
}
</script>

<template>
  <div class="relative flex items-center justify-center">
    <VoteAnimate
      ref="animationRef"
      :direction="direction"
      :show-particles="direction === 'up'"
      :content-id="`${contentId}_${cardSide}_${direction}`"
    >
      <button
        class="p-1 rounded-md flex transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          {
            'text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20':
              direction === 'up' && isActive,
            'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20':
              direction === 'down' && isActive,
            'text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400':
              !isActive,
          },
        ]"
        :disabled="isPending"
        @click="handleVote"
      >
        <Icon
          :name="direction === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down'"
          class="flex transition-transform duration-200"
          size="20px"
          :class="{ 'scale-125': isActive }"
        />
      </button>
    </VoteAnimate>
  </div>
</template>

<style>
/* Only keeping minimal required custom CSS for the scale transition */
.scale-125 {
  transform: scale(1.25);
}
</style>
