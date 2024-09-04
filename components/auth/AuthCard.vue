<script setup lang="ts">
import type { TitleType } from '@/types/content'

defineProps({
  title: {
    type: Object as PropType<TitleType>,
    default: () => ({
      main: 'main title',
      subtitle: 'subtitle',
      label: 'label'
    })
  },
  helpUrl: {
    type: String,
    default: '/auth/login'
  },
  showTitle: {
    type: Boolean,
    default: false
  }
})

const currentUser = useCurrentUser()
const { haveUserSession } = storeToRefs(currentUser)
</script>

<template>
  <div class="space-between flex min-h-full flex-col space-y-4">
    <div class="flex h-full w-full flex-row items-center justify-center gap-4 py-8 text-white">
      <div class="border-color group relative rounded-full border bg-white p-4 hover:invert">
        <NuxtLink
          to="/"
          class="flex items-center justify-center"
        >
          <IBImage
            class="group-hover:opacity-0"
            :img="{
              src: 'astronera-logo.jpg',
              alt: 'AstronEra Logo',
              width: '60',
              height: '60'
            }"
          />
          <p class="absolute mx-auto my-auto hidden text-black group-hover:flex"> Go Home </p>
        </NuxtLink>
      </div>
      <div class="w-full">
        <h2 class="text-3xl font-extrabold lg:text-center">{{ title.main }}</h2>
        <span class="flex items-center gap-4 text-center font-bold lg:justify-center">
          {{ title.subtitle }}
          <NuxtLink
            v-if="helpUrl && title.label"
            :to="helpUrl"
            class="text-primary-500 underline"
          >
            <PrimeButton>
              {{ title.label }}
            </PrimeButton>
          </NuxtLink>
        </span>
      </div>
    </div>
    <PrimeCard>
      <template
        #title
        v-if="showTitle && haveUserSession"
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
      </template>
      <template #content>
        <div class="flex flex-col gap-4 xl:gap-6">
          <slot name="content" />
        </div>
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
    </PrimeCard>
  </div>
</template>

<style scoped></style>
