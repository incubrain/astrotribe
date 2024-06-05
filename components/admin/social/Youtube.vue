<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">YouTube Channel Metrics</h1>
    <div
      v-if="youtube"
      class="mb-4"
    >
      <PrimeCard>
        <template #header>
          <h2 class="text-xl font-semibold">Channel Statistics</h2>
        </template>
        <p>Channel {{ youtube }}</p>
        <!-- <p>Subscriber Count: {{ youtube.subscriberCount }}</p>
        <p>Total Views: {{ youtube.viewCount }}</p>
        <p>Total Videos: {{ youtube.videoCount }}</p> -->
      </PrimeCard>
    </div>
    <div v-if="youtube && youtube?.videos?.length">
      <h2 class="text-xl font-semibold mb-2">Recent Videos</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PrimeCard
          v-for="video in youtube.videos"
          :key="video.id.videoId"
          class="w-full"
        >
          <template #header>
            <div class="flex items-center">
              <img
                :src="video.snippet.thumbnails.default.url"
                alt="Thumbnail"
                class="w-16 h-16 mr-4"
              />
              <h3 class="text-lg font-medium">{{ video.snippet.title }}</h3>
            </div>
          </template>
          <p>Published At: {{ new Date(video.snippet.publishedAt).toLocaleDateString() }}</p>
          <p v-if="video.statistics">Views: {{ video.statistics.viewCount }}</p>
          <p v-if="video.statistics">Likes: {{ video.statistics.likeCount }}</p>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    default: 'AstronEra'
  }
})
const social = useSocialStore()
const { youtube } = storeToRefs(social)

onMounted(() => {
  social.getYoutubeAnalytics(props.id)
})
</script>

<style scoped></style>
