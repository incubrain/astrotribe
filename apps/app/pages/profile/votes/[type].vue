<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const voteStore = useVotesStore()

const voteString = computed(() => route.params.type)
const voteType = computed(() => (voteString.value === 'upvoted' ? 1 : -1))
const posts = ref([])
const isLoading = ref(false)

const fetchVotedPosts = async () => {
  isLoading.value = true
  try {
    posts.value = await voteStore.fetchVotedPosts(voteType.value)
  } catch (error: any) {
    console.error('Error fetching voted posts:', error)
  } finally {
    isLoading.value = false
  }
}

// Initialize vote store if needed
onMounted(async () => {
  if (Object.keys(voteStore.votes).length === 0) {
    await voteStore.fetchUserVotes()
  }
  fetchVotedPosts()
})

// Update posts when route type changes
watch(() => voteString, fetchVotedPosts)
</script>

<template>
  <div class="p-4 md:p-8">
    <h1 class="text-2xl font-bold pb-4 md:pb-8 text-center">
      {{ voteString === 'upvoted' ? 'Upvoted' : 'Downvoted' }} Posts
    </h1>

    <div
      v-if="isLoading"
      class="flex justify-center py-8"
    >
      <PrimeSpinner />
    </div>

    <div
      v-else-if="posts.length === 0"
      class="text-center py-8"
    >
      No posts found
    </div>

    <div
      v-else
      class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 max-w-[940px]"
    >
      <NewsCard
        v-for="post in posts"
        :key="post.id"
        :news="post"
      />
    </div>
  </div>
</template>
