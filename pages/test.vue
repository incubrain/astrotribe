<template>
  <div class="pt-36 wrapper">
    <!-- <SearchBar /> -->

    <div class="p-4 w-full h-full">
      <div
        v-for="item in chat"
        class="foreground p-4 rounded-md border border-color"
      >
        {{ item }}
      </div>
      <!-- <iframe
        src="https://www.youtube.com/embed/videoseries?list=Fireship"
        width="480"
        height="400"
      ></iframe> -->
      <!-- title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen -->
      <BaseYT />
      <PrimeButton @click="test"> test</PrimeButton>
      youtubeData: {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
const chatStore = useChatStore()
const { chat } = storeToRefs(chatStore)
const data = ref(null)

const test = async () => {
  const response = await $fetch('/api/social/youtube', {
    query: {
      channelName: 'Fireship' 
    }
  })

  console.log('clientRes', response)

  data.value = response.data
}
</script>

<style scoped></style>
