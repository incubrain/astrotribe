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
  <div class="grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-0 lg:grid-cols-3 xl:gap-8">
    <PrimeCard
      class="border-color border"
      :pt="{ body: 'justify-between h-full' }"
    >
      <template #content>
        <h1 class="pb-4 text-2xl font-semibold"> Welcome {{ profile?.given_name ?? '' }} 👋 </h1>
        <h3 class="text-lg pb-4 font-semibold text-primary-600">
          AstroTribe Is Currently In Open Alpha
        </h3>
        <p>
          This means we have limited functionality for now, but be sure to check back often as we
          will roll out new features regularly!
        </p>
      </template>
    </PrimeCard>
    <PrimeCard class="border-color border">
      <template #content>
        <div class="space-y-4">
          <h3 class="text-xl font-semibold"> Latest News </h3>
          <p class="text-base text-slate-200">
            Stay current with leading government space agencies and private sector companies from
            around the globe.
          </p>
        </div>
      </template>
      <template #footer>
        <NuxtLink to="/astrotribe/news">
          <PrimeButton outlined> Explore Now </PrimeButton>
        </NuxtLink>
      </template>
    </PrimeCard>
    <PrimeCard
      class="border-color border"
      :pt="{ body: 'justify-between h-full' }"
    >
      <template #content>
        <div class="space-y-4">
          <h3 class="text-xl font-semibold"> Companies </h3>
          <p class="text-base text-slate-200">
            Follow the companies that will take us to the Moon, Mars, and beyond. India is our first
            focus, then we go global!
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
      class="border-color border"
      :pt="{ body: 'justify-between h-full' }"
    >
      <template #content>
        <div class="space-y-4">
          <h3 class="text-xl font-semibold"> Community </h3>
          <p class="text-base text-slate-200">
            Connect, learn, and collaborate with astronomy enthusiasts and professionals worldwide.
          </p>
        </div>
      </template>
      <template #footer>
        <NuxtLink to="/astrotribe/users">
          <PrimeButton outlined> Start Connecting </PrimeButton>
        </NuxtLink>
      </template>
    </PrimeCard>
    <div class="row-span-2 space-y-4 md:col-start-2 md:row-start-1 lg:col-start-3">
      <PrimeInlineMessage severity="info"> Features Coming Soon! </PrimeInlineMessage>
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
