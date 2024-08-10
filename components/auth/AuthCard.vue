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
  <div class="space-y-4 min-h-full flex flex-col space-between">
    <div class="flex gap-4 flex-row py-8 w-full justify-center items-center text-white h-full">
      <div class="p-4 bg-white rounded-full border border-color group hover:invert relative">
        <NuxtLink
          to="/"
          class="flex justify-center items-center"
        >
          <BaseImage
            class="group-hover:opacity-0"
            :img="{
              src: 'astronera-logo.jpg',
              alt: 'AstronEra Logo',
              width: '60',
              height: '60'
            }"
          />
          <p class="hidden absolute group-hover:flex mx-auto my-auto text-black"> Go Home </p>
        </NuxtLink>
      </div>
      <div class="w-full">
        <h2 class="lg:text-center text-3xl font-extrabold">{{ title.main }}</h2>
        <span class="text-center font-bold flex items-center gap-4 lg:justify-center">
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
                class="flex justify-left items-center"
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
