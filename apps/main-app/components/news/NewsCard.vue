<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { ref } from 'vue'
import type { NewsCardT } from '@/types/news'

const props = defineProps({
  news: {
    type: Object as () => NewsCardT,
    required: true,
  },
})

const readTime = computed(() => {
  // Calculate read time based on content length
  // This is a placeholder, replace with actual logic
  return '2m read time'
})

const showModal = ref(false)
const modalContent = ref('')

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
            :src="`https://picsum.photos/400/200?random=${news.id}`"
            :alt="news.title"
            class="w-full h-auto rounded-lg"
            width="400"
            height="200"
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <PrimeButton
              class="!p-2"
              severity="contrast"
              outlined
              @click="openModal('Upvote')"
            >
              <Icon name="mdi:arrow-up" />
            </PrimeButton>
            <span>{{ news.upvotes }}</span>
            <PrimeButton
              class="!p-2"
              severity="contrast"
              outlined
              @click="openModal('Downvote')"
            >
              <Icon name="mdi:arrow-down" />
            </PrimeButton>
            <PrimeButton
              class="!p-2"
              severity="contrast"
              outlined
              @click="openModal('Comments')"
            >
              <Icon name="mdi:comment-outline" />
            </PrimeButton>
            <span>{{ news.comments }}</span>
          </div>
          <div class="flex items-center gap-2">
            <PrimeButton
              class="!p-2"
              severity="contrast"
              outlined
              @click="openModal('Bookmark')"
            >
              <Icon name="mdi:bookmark-outline" />
            </PrimeButton>
            <NuxtLink
              :to="news.url"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <PrimeButton
                class="!p-2"
                severity="contrast"
                outlined
              >
                <Icon name="mdi:link-variant" />
              </PrimeButton>
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
