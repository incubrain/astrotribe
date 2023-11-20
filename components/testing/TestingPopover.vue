<template>
  <div
    v-if="TEST_MODE === 'true'"
    class="absolute bottom-2 left-2 z-50"
  >
    <UPopover>
      <UButton
        color="white"
        label="Testing"
        trailing-icon="i-heroicons-chevron-up-20-solid"
      />
      <template #panel>
        <div class="w-full grid grid-cols-[120px_1fr] gap-4 xl:gap-8 p-4 xl:p-8">
          <div class="flex flex-col gap-4 justify-start items-start w-full">
            <h4 class="text-xl font-semibold">Settings</h4>
            <div class="flex flex-col gap-2">
              <TestingSettings
                v-for="(feature, i) in features"
                :key="i"
                :feature="feature"
              />
            </div>
          </div>
          <div class="w-full grid gap-4 xl:gap-8 grid-flow-row">
            <TestingFeatureAuth v-if="settings.authOn" />
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import type { TestingSettingsType } from '@/types/testing'

const { TEST_MODE } = useRuntimeConfig().public

type FeatureKeys = keyof TestingSettingsType

const features: FeatureKeys[] = ['authOn']

const testing = useTestingStore()
const { settings } = storeToRefs(testing)
</script>

<style scoped></style>
