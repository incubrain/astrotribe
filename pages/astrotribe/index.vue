<script setup lang="ts">
import BaseFeedback from '~/components/base/BaseFeedback.vue'

definePageMeta({
  name: 'AstroTribe',
  layout: 'app'
})

const userStore = useCurrentUser()
const { profile } = storeToRefs(userStore)

const comingSoon = [
  'Add images to news articles',
  'Create and store text embeddings for News',
  'All Indian astronomy companies added',
  'AI generated summaries for news',
  'Admin dashboard'
]
</script>

<template>
  <div class="grid w-full grid-cols-1 md:grid-cols-2 p-4 md:p-0 gap-4 xl:gap-8 lg:grid-cols-3">
    <PrimeCard
      class="border border-color"
      :pt="{ body: 'justify-between h-full' }"
    >
      <template #content>
        <h1 class="pb-4 text-2xl font-semibold"> Welcome {{ profile?.given_name ?? '' }} 👋 </h1>
        <h3 class="pb-4 text-lg font-semibold text-primary-600">
          AstroTribe Is Currently In Open Alpha
        </h3>
        <p>
          This means we have limited functionality, navigate around to preview the application The
          good news is that we will be rolling out new features every month!
        </p>
      </template>
    </PrimeCard>
    <PrimeCard class="border border-color">
      <template #content>
        <div class="space-y-4">
          <h3 class="text-xl font-semibold"> News Hub </h3>
          <p class="text-base text-slate-200">
            Stay updated with the latest developments in astronomy from leading agencies like NASA,
            ISRO, ESA, and private sector companies like Dhruva Space and SpaceX.
          </p>
        </div>
      </template>
      <template #footer>
        <NuxtLink to="/astrotribe/news">
          <PrimeButton outlined> Explore the Hub </PrimeButton>
        </NuxtLink>
      </template>
    </PrimeCard>
    <PrimeCard
      class="border border-color"
      :pt="{ body: 'justify-between h-full' }"
    >
      <template #content>
        <div class="space-y-4">
          <h3 class="text-xl font-semibold"> Business Zone </h3>
          <p class="text-base text-slate-200">
            Explore the universe's frontiers with our comprehensive directory of space agencies and
            private companies. India is our first focus, then we go global!
          </p>
        </div>
      </template>
      <template #footer>
        <NuxtLink to="/astrotribe/companies">
          <PrimeButton outlined> Search Companies </PrimeButton>
        </NuxtLink>
      </template>
    </PrimeCard>
    <PrimeCard
      class="border border-color"
      :pt="{ body: 'justify-between h-full' }"
    >
      <template #content>
        <div class="space-y-4">
          <h3 class="text-xl font-semibold"> Community </h3>
          <p class="text-base text-slate-200">
            Connect, learn, and collaborate with astronomy enthusiasts and professionals worldwide
            in our vibrant global community.
          </p>
        </div>
      </template>
      <template #footer>
        <NuxtLink to="/astrotribe/users">
          <PrimeButton outlined> Start Connecting </PrimeButton>
        </NuxtLink>
      </template>
    </PrimeCard>
    <div class="md:col-start-2 row-span-2 lg:col-start-3 md:row-start-1 space-y-4">
      <PrimeInlineMessage severity="info"> Features Coming in May 2024! </PrimeInlineMessage>
      <ul>
        <li
          v-for="item in comingSoon"
          :key="item"
          class="py-2"
        >
          <Icon
            name="mdi:chevron-right"
            size="16"
            class="text-primary-500"
          />
          <span class="pl-2">{{ item }}</span>
        </li>
      </ul>
      <BaseFeedback cta="Have an idea? We would love to hear it!" />
    </div>
  </div>
</template>

<style scoped></style>
