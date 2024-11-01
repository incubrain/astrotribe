<!-- components/VoteButton.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  contentId: string
  contentType?: string
  count?: number
  direction: 'up' | 'down'
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

const currentVoteType = computed(() => voteStore.getVoteType(props.contentId))
const isPending = computed(() => voteStore.isVotePending(props.contentId))

const isActive = computed(() => {
  return props.direction === 'up' ? currentVoteType.value === 1 : currentVoteType.value === -1
})

const handleVote = async () => {
  if (isPending.value) return

  const voteType = props.direction === 'up' ? 1 : -1

  try {
    const result = await voteStore.submitVote(props.contentId, voteType, notification)
    if (result) {
      emit('vote-change', {
        voteType: voteStore.getVoteType(props.contentId),
        change: result.change,
      })
    }
  } catch (error) {
    console.error('Vote error:', error)
  }
}
</script>

<template>
  <button
    :class="['hover:text-gray-600 transition-colors flex', { 'text-primary-500': isActive }]"
    :disabled="isPending"
    @click="handleVote"
  >
    <Icon
      :name="direction === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down'"
      size="20px"
    />
  </button>
</template>
