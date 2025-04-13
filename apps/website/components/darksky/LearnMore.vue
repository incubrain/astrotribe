<script setup lang="ts">
interface InfoCard {
  title: string
  content: string
  blogSlug?: string // Slug for blog post link
  icon: string
}

const props = defineProps<{
  cards: InfoCard[]
  title?: string
  subtitle?: string
}>()

const { stars, isClient } = useStarfield(20, 2)
const { conf } = useAnimation()
</script>

<template>
  <section class="learn-more-section py-16 relative overflow-hidden rounded-xl">
    <!-- Background elements -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900/80 to-primary-950 rounded-xl"
    ></div>

    <!-- Animated stars background -->
    <div
      v-if="isClient"
      class="absolute inset-0 pointer-events-none"
    >
      <div
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full bg-white"
        :style="star.style"
      />
    </div>

    <!-- Content wrapper -->
    <div class="wrapper relative z-10">
      <!-- Section header -->
      <div
        v-motion
        class="text-center mb-12"
        :initial="conf.sectionTitle.initial"
        :visible="conf.sectionTitle.enter"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">
          {{ title || 'Learn More About Dark Skies' }}
        </h2>
        <p class="text-xl text-primary-200 max-w-3xl mx-auto">
          {{
            subtitle ||
            'Discover the importance of dark sky preservation and how light pollution affects our environment'
          }}
        </p>
      </div>

      <!-- Information cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <IBGlass
          v-for="(card, index) in cards"
          :key="index"
          v-motion
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="low"
          class="h-full rounded-lg"
          :initial="conf.fadeUp.initial"
          :visible="{
            ...conf.fadeUp.enter,
            transition: { ...conf.fadeUp.enter.transition, delay: index * 0.1 },
          }"
        >
          <div class="flex flex-col h-full p-6">
            <!-- Card header with icon -->
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-primary-900/50 rounded-full">
                <Icon
                  :name="card.icon"
                  class="text-primary-400"
                  size="24"
                />
              </div>
              <h3 class="text-xl font-bold text-white">{{ card.title }}</h3>
            </div>

            <!-- Main content -->
            <div class="flex-grow">
              <p class="text-primary-100">{{ card.content }}</p>
            </div>

            <!-- Blog post link -->
            <div
              v-if="card.blogSlug"
              class="mt-4 pt-2 border-t border-primary-800/50"
            >
              <NuxtLink
                :to="`/blog/darksky-conservation/${card.blogSlug}`"
                class="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Read more
                <Icon
                  name="mdi:arrow-right"
                  class="ml-1"
                />
              </NuxtLink>
            </div>
          </div>
        </IBGlass>
      </div>
    </div>
  </section>
</template>
