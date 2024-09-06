<script setup lang="ts">
const isDev = computed(() => useRuntimeConfig().public.nodeEnv === 'development')

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
</script>

<template>
  <PrimeMenu
    :model="links"
    :pt="{
      root: 'min-h-full flex flex-col rounded-none border-none p-0 w-full h-full max-w-[10%] min-w-[140px] hidden lg:flex',
      menu: 'pt-8',
    }"
  >
    <template #start>
      <div class="flex min-h-[60px] items-center justify-end p-3">
        <NuxtLink
          to="/"
          class="flex items-center justify-end gap-2"
        >
          <h1 class="text-lg flex cursor-pointer font-bold leading-none tracking-normal">
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
            class="relative flex w-full items-center gap-3 rounded-[.5rem_0_0_.5rem] p-3 text-sm"
            :class="route.path === item.slug ? 'foreground justify-end' : 'justify-end'"
          >
            <div
              v-if="route.path === item.slug"
              class="background absolute -bottom-4 right-0 z-10 h-4 w-4 rounded-tr-xl"
            ></div>
            <div
              v-if="route.path === item.slug"
              class="foreground absolute -bottom-4 right-0 h-4 w-4"
            ></div>
            <div
              v-if="route.path === item.slug"
              class="background absolute -top-4 right-0 z-10 h-4 w-4 rounded-br-xl"
            ></div>
            <div
              v-if="route.path === item.slug"
              class="foreground absolute -top-4 right-0 h-4 w-4"
            ></div>
            {{ item.label }}
            <Icon
              :name="item.icon"
              class="h-[20px] w-[20px]"
            />
          </span>
        </NuxtLink>
      </div>
    </template>
  </PrimeMenu>
</template>

<style scoped></style>
