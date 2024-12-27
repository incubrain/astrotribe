<script setup lang="ts">
// components/VoteButton.vue
import { computed, ref } from 'vue'

interface Props {
  contentId: string
  contentType?: string
  count?: number
  direction: 'up' | 'down'
  cardSide: 'front' | 'back'
}

const props = withDefaults(defineProps<Props>(), {
  contentType: 'news',
  count: 0,
})

const emit = defineEmits<{
  (e: 'vote-change', value: { voteType: number | null; change: number }): void
}>()

const voteStore = useVoteStore()
const notification = useNotification()
const animationRef = ref()

const currentVoteType = computed(() => voteStore.getVoteType(props.contentId))
const isPending = computed(() => voteStore.isVotePending(props.contentId))

const isActive = computed(() => {
  return props.direction === 'up' ? currentVoteType.value === 1 : currentVoteType.value === -1
})

onMounted(async () => {
  await voteStore.fetchUserVotes()
})

const handleVote = async () => {
  if (isPending.value) return

  const voteType = props.direction === 'up' ? 1 : -1

  // Trigger animation
  animationRef.value?.triggerAnimation()

  try {
    const result = await voteStore.submitVote(props.contentId, voteType, props.contentType)
    if (result) {
      emit('vote-change', {
        voteType: voteStore.getVoteType(props.contentId),
        change: result.change,
      })
    }
  } catch (error: any) {
    console.error('Vote error:', error)
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
