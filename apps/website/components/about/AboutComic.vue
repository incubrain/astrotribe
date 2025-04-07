<script setup lang="ts">
import { ref } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import AutoScroll from 'embla-carousel-auto-scroll'

interface ComicPanel {
  image: string
  alt: string
  caption?: string
}

interface ComicStrip {
  id: number
  title: string
  panels: ComicPanel[]
}

const props = defineProps({
  comics: {
    type: Array as PropType<ComicStrip[]>,
    required: true,
  },
  scrollSpeed: {
    type: Number,
    default: 2, // pixels per frame
  },
})

const [emblaRef, emblaApi] = useEmblaCarousel(
  {
    loop: true,
    dragFree: true, // required for continuous scroll
  },
  [
    AutoScroll({
      speed: props.scrollSpeed,
      startDelay: 1000,
      direction: 'forward',
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  ],
)
</script>

<template>
  <div class="comic-scroller-container">
    <div class="relative">
      <!-- Gradient masks for fade effect -->
      <div
        class="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-black to-transparent"
      ></div>
      <div
        class="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-black to-transparent"
      ></div>

      <!-- Embla Carousel -->
      <div
        ref="emblaRef"
        class="overflow-hidden"
      >
        <div class="embla__container flex">
          <div
            v-for="comic in comics"
            :key="`comic-${comic.id}`"
            class="flex-grow-0 flex-shrink-0 min-w-[300px] sm:min-w-[600px] lg:min-w-[900px] pl-4 first:pl-0 pr-4"
          >
            <IBGlass
              gradient="blue"
              intensity="low"
              class="h-full"
            >
              <div class="p-4">
                <h4 class="mb-4 text-xl font-bold">{{ comic.title }}</h4>
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div
                    v-for="(panel, index) in comic.panels"
                    :key="`panel-${index}`"
                    class="comic-panel relative overflow-hidden rounded bg-primary-900/50 transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
                  >
                    <img
                      :src="panel.image"
                      :alt="panel.alt"
                      class="h-40 w-full object-cover sm:h-48"
                    />
                    <div
                      v-if="panel.caption"
                      class="caption absolute bottom-0 w-full bg-primary-950/80 p-2 text-center text-sm backdrop-blur-sm"
                    >
                      {{ panel.caption }}
                    </div>
                  </div>
                </div>
              </div>
            </IBGlass>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Comic panel hover effects */
.comic-panel {
  position: relative;
  overflow: hidden;
}

.comic-panel .caption {
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.comic-panel:hover .caption {
  transform: translateY(0);
}

/* Add a subtle glow effect to panels on hover */
.comic-panel:hover {
  box-shadow: 0 0 15px rgba(var(--color-primary-600), 0.3);
}
</style>
