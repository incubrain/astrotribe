<script setup lang="ts">
interface Resource {
  title: string
  description: string
  url: string
  icon: string
}

defineProps<{
  resources: Resource[]
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <section>
    <h3 class="text-center py-16 w-full text-xl font-bold underline underline-offset-4"
      >RESOURCES</h3
    >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(resource, index) in resources"
        :key="index"
      >
        <IBGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="low"
          interactive
          padding
          class="h-full"
        >
          <div class="flex flex-col h-full justify-between">
            <div class="h-full">
              <div class="mb-4">
                <Icon
                  :name="resource.icon"
                  size="36"
                  class="text-primary-400"
                />
              </div>

              <h3 class="text-xl font-bold mb-3 text-white">{{ resource.title }}</h3>
              <p class="text-base mb-6 flex-grow">{{ resource.description }}</p>
            </div>

            <div class="mt-auto">
              <NuxtLink
                :to="resource.url"
                target="_blank"
              >
                <PrimeButton
                  severity="secondary"
                  outlined
                  class="w-full"
                >
                  Visit Resource
                  <Icon
                    name="mdi:open-in-new"
                    class="ml-2"
                  />
                </PrimeButton>
              </NuxtLink>
            </div>
          </div>
        </IBGlass>
      </div>
    </div>
  </section>
</template>
