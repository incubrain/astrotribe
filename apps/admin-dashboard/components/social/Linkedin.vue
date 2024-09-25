<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
      LinkedIn Page Analytics
    </h1>
    <div
      v-if="linkedin"
      class="mb-4"
    >
      <PrimeCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Page Statistics
          </h2>
        </template>
        <p>Impressions: {{ linkedin.impressions }}</p>
        <p>Reactions: {{ linkedin.reactions }}</p>
        <p>Comments: {{ linkedin.comments }}</p>
        <p>Reposts: {{ linkedin.reposts }}</p>
      </PrimeCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
})

const social = useSocialStore()
const { linkedin } = storeToRefs(social)

onMounted(() => {
  social.getLinkedInAnalytics(props.postId)
})
</script>

<style scoped></style>
