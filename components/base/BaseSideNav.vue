<script setup lang="ts">
const isDev = computed(() => useRuntimeConfig().public.nodeEnv === 'development')

defineProps({
  links: {
    type: Array,
    required: true
  },
  showDevHelpers: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
</script>

<template>
  <PrimeMenu
    :model="links"
    :pt="{
      root: 'min-h-full flex flex-col rounded-none border-none p-0 w-full h-full max-w-[10%] min-w-[140px] hidden lg:flex',
      menu: 'pt-8'
    }"
  >
    <template #start>
      <div class="min-h-[60px] flex justify-end items-center p-3">
        <NuxtLink
          to="/"
          class="items-center justify-end gap-2 flex"
        >
          <h1 class="text-lg font-bold cursor-pointer leading-none tracking-normal flex">
            ASTRO
            <strong class="text-highlight"> TRIBE </strong>
          </h1>
        </NuxtLink>
      </div>
    </template>
    <template #submenuheader="{ item }">
      <p>something here to {{ item }}</p>
    </template>
    <template #item="{ item }">
      <div>
        <NuxtLink
          :to="item.slug"
          class="w-full"
        >
          <span
            class="relative w-full p-3 flex items-center gap-3 rounded-[.5rem_0_0_.5rem] text-sm"
            :class="route.path === item.slug ? 'foreground justify-end' : ' justify-end '"
          >
            <div
              v-if="route.path === item.slug"
              class="absolute -bottom-4 right-0 h-4 w-4 background rounded-tr-xl z-10"
            ></div>
            <div
              v-if="route.path === item.slug"
              class="absolute -bottom-4 right-0 h-4 w-4 foreground"
            ></div>
            <div
              v-if="route.path === item.slug"
              class="absolute -top-4 right-0 h-4 w-4 background rounded-br-xl z-10"
            ></div>
            <div
              v-if="route.path === item.slug"
              class="absolute -top-4 right-0 h-4 w-4 foreground"
            ></div>
            {{ item.label }}
            <Icon
              :name="item.icon"
              class="w-[20px] h-[20px]"
            />
          </span>
        </NuxtLink>
      </div>
    </template>
    <template #end>
      <div class="h-full flex justify-end items-end">
        <BaseDevHelpers v-if="isDev && showDevHelpers" />
      </div>
    </template>
  </PrimeMenu>
</template>

<style scoped></style>
