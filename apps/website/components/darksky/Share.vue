<script setup lang="ts">
interface SharePlatform {
  name: string
  icon: string
  url: string
  btnClass: string
}

const props = defineProps<{
  platforms: SharePlatform[]
  tags: string[]
  pageUrl: string
  introText?: string
}>()

const shareOnPlatform = (platform: string, baseUrl: string) => {
  const shareText = encodeURIComponent(
    'Join me in protecting our night skies from light pollution. Learn more about dark sky preservation and what you can do to help. #DarkSkyPreservation',
  )
  const shareUrl = encodeURIComponent(props.pageUrl)

  let shareLink = ''

  switch (platform) {
    case 'Twitter':
      shareLink = `${baseUrl}?text=${shareText}&url=${shareUrl}`
      break
    case 'Facebook':
      shareLink = `${baseUrl}?u=${shareUrl}`
      break
    case 'LinkedIn':
      shareLink = `${baseUrl}?url=${shareUrl}&summary=${shareText}`
      break
    default:
      shareLink = baseUrl
  }

  window.open(shareLink, '_blank')
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  // TODO: Show a notification/toast when copied
}
</script>

<template>
  <section class="py-16 my-8">
    <LandingTitle
      title="Spread Awareness"
      subtitle="Help others learn about the importance of dark sky preservation"
      class="mb-12"
    />

    <div class="px-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div class="md:col-span-7">
          <LandingGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="mixed"
            intensity="low"
            interactive
          >
            <h3 class="text-2xl font-bold mb-4 text-white">Why Sharing Matters</h3>
            <p class="text-base mb-4">
              {{
                introText ||
                "Light pollution affects everyone, yet many people aren't aware of its impacts. By sharing information about dark sky preservation, you can help others understand why it matters and what they can do to help."
              }}
            </p>
            <p class="text-base mb-6">
              Use the hashtags #DarkSkyPreservation, #FightLightPollution, and #AstronEra to join
              the conversation and connect with others who care about protecting our night skies.
            </p>

            <div class="p-4 bg-primary-800/50 rounded-lg border border-primary-700/30 mb-6">
              <p class="text-sm italic text-gray-300">
                "The stars are the heritage of all humanity. But with increasing light pollution,
                fewer and fewer people can see them. Let's change that. #DarkSkyPreservation"
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <span
                v-for="(tag, index) in tags"
                :key="index"
                class="bg-primary-700/50 px-3 py-1 rounded-full text-sm text-primary-300"
              >
                {{ tag }}
              </span>
            </div>
          </LandingGlass>
        </div>

        <div class="md:col-span-5 min-h-full">
          <LandingGlass
            class="min-h-full"
            hover-effect="glow"
            glow-color="blue"
            gradient="mixed"
            intensity="low"
            interactive
          >
            <h3 class="text-xl font-bold mb-6 text-white text-center">Share This Initiative</h3>

            <div class="flex flex-col justify-between gap-8 h-full flex-grow">
              <div class="flex flex-col space-y-4">
                <div
                  v-for="(platform, index) in platforms"
                  :key="index"
                >
                  <PrimeButton
                    class="w-full flex justify-between items-center"
                    :class="platform.btnClass"
                    @click="shareOnPlatform(platform.name, platform.url)"
                  >
                    <span class="flex items-center">
                      <Icon
                        :name="platform.icon"
                        class="mr-3"
                        size="24"
                      />
                      Share on {{ platform.name }}
                    </span>
                    <Icon name="mdi:share" />
                  </PrimeButton>
                </div>
              </div>

              <div class="p-4 bg-primary-800/50 rounded-lg border border-primary-700/30">
                <h4 class="text-sm font-bold mb-2 text-primary-400">Direct Link:</h4>
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    :value="pageUrl"
                    readonly
                    class="bg-primary-900/50 text-white text-sm p-2 rounded border border-primary-700/30 flex-grow"
                  />
                  <PrimeButton
                    severity="secondary"
                    @click="copyToClipboard(pageUrl)"
                  >
                    <Icon name="mdi:content-copy" />
                  </PrimeButton>
                </div>
              </div>
            </div>
          </LandingGlass>
        </div>
      </div>
    </div>
  </section>
</template>
