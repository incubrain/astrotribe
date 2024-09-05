<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
      Twitter Post Metrics
    </h1>
    <div
      v-if="twitter"
      class="mb-4"
    >
      <PrimeCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Post Statistics
          </h2>
        </template>
        <p>Impressions: {{ twitter.impression_count }}</p>
        <p>Likes: {{ twitter.like_count }}</p>
        <p>Replies: {{ twitter.reply_count }}</p>
        <p>Retweets: {{ twitter.retweet_count }}</p>
        <p>Quote Tweets: {{ twitter.quote_count }}</p>
        <p>URL Link Clicks: {{ twitter.url_link_clicks }}</p>
        <p>User Profile Clicks: {{ twitter.user_profile_clicks }}</p>
      </PrimeCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  postId: {
    type: String,
    required: true
  }
})

const social = useSocialStore()
const { twitter } = storeToRefs(social)

onMounted(() => {
  social.getTwitterAnalytics(props.postId)
})
</script>

<style scoped></style>
