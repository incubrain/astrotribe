<template>
  <PrimeMenu
    :model="pages"
    :pt="{
      root: 'h-full flex flex-col rounded-none border-color',
      menu: 'pt-8'
    }"
  >
    <template #start>
      <div class="pt-4 px-2">
        <NuxtLink
          to="/"
          class="items-center gap-2 flex"
        >
          <div
            class="p-1 h-[28px] w-[28px] md:h-[38px] md:w-[38px] bg-white rounded-full overflow-hidden border"
          >
            <NuxtImg
              src="/astronera-logo.jpg"
              class="w-full h-full dark:opacity-90"
            />
          </div>
          <h1 class="pl-2 text-xl font-bold cursor-pointer leading-none tracking-normal">
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
  </PrimeMenu>
</template>

<script setup lang="ts">
const { pages } = usePages()
const route = useRoute()
</script>

<style scoped></style>
