<script setup lang="ts">
const { appLinks } = usePages()
const route = useRoute()

const isDev = computed(() => useRuntimeConfig().public.nodeEnv === 'development')
</script>

<template>
  <PrimeMenu
    :model="appLinks"
    :pt="{
      root: 'min-h-full flex flex-col rounded-none border-none p-0',
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
            :class="
              route.path.split('/')[2] === item.slug.split('/')[2]
                ? 'w-full foreground p-3 flex items-center justify-end gap-3 rounded-[.5rem_0_0_.5rem] text-sm'
                : 'w-full p-3 flex items-center justify-end gap-3 rounded-[.5rem_0_0_.5rem] text-sm'
            "
          >
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
        <BaseDevHelpers v-if="isDev" />
      </div>
    </template>
  </PrimeMenu>
</template>

<style scoped></style>
