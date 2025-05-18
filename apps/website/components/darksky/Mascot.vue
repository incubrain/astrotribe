<script setup lang="ts">
import type { TitleType } from '~/types/content'

// Define props expected by this component
const props = defineProps<{
  title?: TitleType
  comicImage?: string // Absolute URL or relative path from public folder
  taraImage?: string // Image for the Tara mascot, defaults if not provided
}>()

// --- Page URL & Sharing Setup ---
const pageUrl = ref('')
const shareErrorMessage = ref('')

// The specific share text requested
const shareText = computed(() =>
  encodeURIComponent(
    '#FollowTara and her journey to dim the lights across India and the globe so you and your family can enjoy the wonders of the night sky',
  ),
)

// Get the current page URL once mounted on the client-side
onMounted(() => {
  pageUrl.value = window.location.href
})

// --- Social Links ---
// Computed property to generate URLs for social sharing links
// Uses the current page URL and the specific share text
const socialLinks = computed(() => {
  const encodedUrl = encodeURIComponent(pageUrl.value)
  // Note: We don't include image here, relying on page's og:image meta tag
  return [
    {
      platform: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText.value}`,
      icon: 'mdi:twitter',
    },
    {
      platform: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: 'mdi:facebook',
    },
    {
      platform: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: 'mdi:linkedin',
    },
    {
      platform: 'WhatsApp',
      url: `https://wa.me/?text=${shareText.value}%20${encodedUrl}`, // Text first for WhatsApp is common
      icon: 'mdi:whatsapp',
    },
  ]
})

// --- Optional: Native Web Share API (URL + Text only) ---
const canShareNatively = ref(false)
onMounted(() => {
  // Check for navigator.share AFTER mount (client-side only)
  canShareNatively.value = !!navigator.share
})

async function shareNatively() {
  shareErrorMessage.value = ''
  if (!navigator.share) {
    shareErrorMessage.value = 'Native sharing not supported on this browser.'
    return
  }
  try {
    await navigator.share({
      title: props.title?.main || document.title, // Use component title or page title
      text: decodeURIComponent(shareText.value), // Decode for the native share sheet
      url: pageUrl.value,
    })
    console.log('Content shared successfully via native share!')
  } catch (error) {
    console.error('Error using native share:', error)
    // Don't show error for AbortError (user cancelled)
    if (error.name !== 'AbortError') {
      shareErrorMessage.value = `Could not share: ${error.message}`
    }
  }
}
</script>

<template>
  <section class="py-16">
    <LandingTitle
      :title="title?.main"
      :subtitle="title?.subtitle"
      class="mb-12"
    />

    <div class="flex flex-col md:flex-row gap-8 lg:gap-12 items-center px-4">
      <div class="w-full md:w-1/2 lg:w-3/5">
        <IBGlass
          hover-effect="glow"
          glow-color="orange"
          gradient="orange"
          intensity="low"
          class="p-4"
        >
          <div class="relative overflow-hidden rounded-lg">
            <IBImage
              v-if="props.comicImage"
              :img="{
                src: props.comicImage,
                alt: 'Tara the Firefly Comic Strip',
                width: 1200, // Adjust if necessary
              }"
              class="w-full aspect-auto object-fit"
            />
            <div
              v-else
              class="aspect-video bg-gray-700 flex items-center justify-center text-gray-400 rounded-lg"
            >
              Comic Image Placeholder
            </div>
          </div>
        </IBGlass>
        <div class="mt-6 w-full flex justify-center items-center">
          <NuxtLink to="/darksky-acknowledgement">
            <PrimeButton
              v-motion
              outlined
              severity="secondary"
              :initial="{ opacity: 0, scale: 0.9 }"
              :enter="{
                opacity: 1,
                scale: 1,
                transition: { type: 'spring', stiffness: 300, damping: 15, delay: 1.0 },
              }"
              class="px-6 py-3"
            >
              <Icon
                name="mdi:light-flood-down"
                class="mr-2"
              />
              We've teamed up with Dark Sky International
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>

      <div
        class="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center text-center md:items-start md:text-left gap-6"
      >
        <div class="relative">
          <IBImage
            :img="{
              src: props.taraImage || '/images/tara/tara-pose-cheerful.png', // Use prop or default
              alt: 'Tara the Firefly Mascot',
              width: 200, // Adjust size as needed
              height: 200, // Adjust size as needed
            }"
          />
          <div
            class="absolute inset-0 -z-1 bg-yellow-500/20 blur-2xl rounded-full animate-pulse"
          ></div>
        </div>

        <PrimeMessage
          severity="success"
          class="max-w-xs text-xl"
        >
          #FollowTara and her journey to dim the lights across India and the globe so you and your
          family can enjoy the wonders of the night sky
        </PrimeMessage>

        <div class="flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            v-if="canShareNatively"
            title="Share using system dialog"
            aria-label="Share using system dialog"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 transition-colors"
            @click="shareNatively"
          >
            <Icon
              name="mdi:share-variant"
              size="20"
              class="text-white"
            />
          </button>

          <a
            v-for="link in socialLinks"
            :key="link.platform"
            :href="link.url"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-primary-800 hover:bg-primary-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Share on ${link.platform}`"
            :title="`Share on ${link.platform}`"
          >
            <Icon
              :name="link.icon"
              size="20"
              class="text-white"
            />
          </a>
        </div>

        <p
          v-if="shareErrorMessage"
          class="text-red-400 text-sm mt-2"
        >
          {{ shareErrorMessage }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Basic pulse animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
