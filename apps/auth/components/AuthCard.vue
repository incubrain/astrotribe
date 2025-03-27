<script setup lang="ts">
import type { TitleType } from '@/types/content'

const { websiteURL } = useRuntimeConfig().public

defineProps({
  title: {
    type: Object as PropType<TitleType>,
    default: () => ({
      main: 'main title',
      subtitle: 'subtitle',
      label: 'label',
    }),
  },
  helpUrl: {
    type: String,
    default: '/login',
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  noFooter: {
    type: Boolean,
    default: false,
  },
})

// const currentUser = useCurrentUser()
// const { haveUserSession } = storeToRefs(currentUser)
</script>

<template>
  <div class="space-between flex min-h-full flex-col space-y-4">
    <div class="flex h-full flex-row items-center justify-center gap-4 text-white mx-auto">
      <div class="border-color group relative rounded-full border bg-white p-3 hover:invert">
        <NuxtLink
          :to="websiteURL"
          class="flex items-center justify-center"
        >
          <IBImage
            class="group-hover:opacity-0"
            :img="{
              src: 'astronera-logo.jpg',
              alt: 'AstronEra Logo',
              width: '60',
              height: '60',
            }"
          />
          <p class="absolute mx-auto my-auto hidden text-black group-hover:flex font-semibold text-sm"> Go Home </p>
        </NuxtLink>
      </div>
      <div class="w-full">
        <h2 class="text-2xl font-extrabold lg:text-start">
          {{ title.main }}
        </h2>
        <span class="flex items-center gap-2 text-start lg:justify-start">
          {{ title.subtitle }}
          <NuxtLink
            v-if="helpUrl && title.label"
            :to="helpUrl"
            class="underline"
          >
            <button
              class="!p-0 !m-0 leading-normal font-bold underline text-primary-500 hover:text-primary-400"
            >
              {{ title.label }}
            </button>
          </NuxtLink>
        </span>
      </div>
    </div>
    <PrimeCard class="max-w-sm w-full mx-auto py-2">
      <!-- <template
        v-if="showTitle && haveUserSession"
        #title
      >
        <div class="flex flex-col gap-4 xl:gap-6">
          <div>
            <AuthVerifiedWith class="w-full" />

            <div class="w-full pt-4">
              <PrimeDivider
                layout="horizontal"
                class="justify-left flex items-center"
              >
                <p>Or Login with</p>
              </PrimeDivider>
            </div>
          </div>
        </div>
      </template> -->
      <template #content>
        <div class="flex flex-col gap-4 xl:gap-6">
          <slot name="content" />
        </div>
      </template>
      <template
        v-if="!noFooter"
        #footer
      >
        <slot name="footer" />
      </template>
    </PrimeCard>
  </div>
</template>

<style scoped></style>
