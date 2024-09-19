<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'

defineProps({
  links: {
    type: Array,
    required: true,
  },
  showDevHelpers: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const isExpanded = ref(false)
</script>

<template>
  <div
    class="background fixed left-0 top-0 z-[100] h-full transition-all duration-300 ease-in-out hover:overflow-visible"
    :class="{ 'w-[60px]': !isExpanded, 'w-[180px]': isExpanded }"
    @mouseenter="isExpanded = true"
    @mouseleave="isExpanded = false"
  >
    <PrimeMenu
      :model="links"
      :pt="{
        root: 'min-h-full flex flex-col rounded-none border-none p-0 w-full h-full hidden lg:flex',
        menu: 'pt-8',
      }"
    >
      <template #start>
        <div
          class="flex min-h-[60px] items-center p-3"
          :class="{ 'justify-center': !isExpanded, 'justify-start': isExpanded }"
        >
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
          >
            <Icon
              v-if="!isExpanded"
              name="mdi:rocket"
              size="20px"
            />
            <h1
              v-else
              class="text-lg flex cursor-pointer whitespace-nowrap font-bold leading-none tracking-normal"
            >
              ASTRO
              <strong class="text-highlight"> TRIBE </strong>
            </h1>
          </NuxtLink>
        </div>
      </template>
      <template #submenuheader="{ item }">
        <p v-if="isExpanded">something here to {{ item }}</p>
      </template>
      <template #item="{ item }">
        <div class="w-full">
          <NuxtLink
            :to="item.slug"
            class="block w-full"
          >
            <span
              class="relative flex w-full items-center rounded-[.5rem_0_0_.5rem] p-3.5 text-sm"
              :class="[
                route.path === item.slug ? 'foreground' : '',
                isExpanded ? 'justify-start' : 'justify-center',
              ]"
            >
              <Icon
                :name="item.icon"
                class="flex shrink-0"
                size="20px"
              />
              <span
                v-show="isExpanded"
                class="overflow-hidden whitespace-nowrap pl-4"
              >
                {{ item.label }}
              </span>
            </span>
          </NuxtLink>
        </div>
      </template>
    </PrimeMenu>
  </div>
</template>

<style scoped></style>
