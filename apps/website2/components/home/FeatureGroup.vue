<template>
  <div class="px-4 py-8">
    <h1 class="mb-4 text-center text-4xl font-bold">
      {{ title }}
    </h1>
    <p class="mb-8 text-center text-xl">
      {{ description }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 rounded-lg border border-color overflow-hidden">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="foreground border-color flex flex-col border p-4 lg:p-8 shadow-md"
      >
        <div class="flex items-center gap-2 pb-2">
          <Icon
            :name="feature.icon"
            class="text-xl text-primary-900"
          />
          <h3 class="text-xl font-semibold">
            {{ feature.title }}
          </h3>
        </div>
        <span class="text-sm">{{ feature.description }}

          <NuxtLink
            :to="feature.link"
            class="text-blue-800 hover:underline"
          >{{ feature.linkText }}
          </NuxtLink>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  icon: string
  title: string
  description: string
  link: string
  linkText: string
}

interface Props {
  title: string
  description: string
  features: Feature[]
}

const props = defineProps<Props>()
</script>
