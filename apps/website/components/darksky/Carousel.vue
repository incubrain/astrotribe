<script setup lang="ts">
interface CarouselItem {
  title: string
  subtitle: string
  image: string
  shortDescription: string
}

defineProps<{
  items: CarouselItem[]
  interval?: number
}>()

const contentRef = ref<HTMLElement | null>(null)

const scrollToContent = () => {
  if (contentRef.value) {
    contentRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="relative w-full">
    <AppCarousel
      :items="items"
      type="darksky"
      :interval="interval || 8000"
    >
      <template #default="{ item }: { item: CarouselItem }">
        <div>
          <DarkskyHero
            :img="{
              src: item.image,
              alt: item.title,
              width: 1920,
              height: 1080,
            }"
            :title="{
              main: item.title,
              subtitle: '',
              centered: true,
            }"
            :object-position="`object-centered`"
            fit="cover"
          >
            <!-- Condensed description with better contrast -->
            <div
              class="max-w-xl bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-lg"
            >
              <p class="text-white text-lg font-medium">{{ item.shortDescription }}</p>
            </div>
          </DarkskyHero>
        </div>
      </template>
    </AppCarousel>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-0 right-0 flex justify-center z-30">
      <button
        class="flex flex-col items-center gap-2 text-white bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-black/50 transition-all duration-300"
        @click="scrollToContent"
      >
        <span class="text-sm font-medium">Explore Dark Sky Initiatives</span>
        <Icon
          name="mdi:chevron-down"
          size="24px"
          class="animate-bounce"
        />
      </button>
    </div>
  </section>
</template>
