<template>
  <div
    class="flex-col hidden w-full min-h-full py-8 lg:relative background lg:flex border-r border-color"
  >
    <ul class="w-full sticky top-24">
      <li
        v-for="page in pages"
        :key="page.id"
        class="flex items-center justify-between w-full cursor-pointer pl-8"
      >
        <NuxtLink
          :to="page.slug"
          class="flex flex-row items-center justify-center w-full overflow-hidden group"
        >
          <span
            :class="
              route.path.split('/')[2] === page.slug.split('/')[2]
                ? 'w-full foreground p-3 flex items-center justify-start gap-3 rounded-[.5rem_0_0_.5rem] text-sm'
                : 'w-full p-3 flex items-center justify-start gap-3 rounded-[.5rem_0_0_.5rem] text-sm'
            "
          >
            <Icon
              :name="page.icon"
              class="w-[20px] h-[20px]"
            />
            {{ page.label }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { pages } = usePages()
const route = useRoute()
</script>

<style scoped></style>
