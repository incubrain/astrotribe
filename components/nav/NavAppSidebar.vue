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
      menu: 'pt-8',
      end: 'flex items-end justify-end h-full'
    }"
    :ptOptions="{ mergeSections: true, mergeProps: true }"
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
            :class="
              route.path.split('/')[2] === item.slug.split('/')[2]
                ? 'foreground flex w-full items-center justify-end gap-3 rounded-[.5rem_0_0_.5rem] p-3 text-sm'
                : 'flex w-full items-center justify-end gap-3 rounded-[.5rem_0_0_.5rem] p-3 text-sm'
            "
          >
            {{ item.label }}
            <Icon
              :name="item.icon"
              class="h-[20px] w-[20px]"
            />
          </span>
        </NuxtLink>
      </div>
    </template>
    <template #end>
      <div class="flex h-full items-end justify-end p-2">
        <!-- <BaseDevHelpers v-if="isDev" /> -->
         <div class="flex items-center justify-center foreground rounded-md p-2 gap-2">
           <iframe
             src="https://status.astronera.org/badge?theme=dark"
             width="120"
             height="30"
             frameborder="0"
             scrolling="no"
           ></iframe>
         </div>
      </div>
    </template>
  </PrimeMenu>
</template>

<style scoped></style>
