<template>
  <div class="fixed left-0 flex-col hidden w-full h-full py-8 pl-8 lg:relative foreground lg:flex">
    <ul class="w-full">
      <li
        v-for="page in pages"
        :key="page.id"
        class="flex items-center justify-between w-full cursor-pointer"
      >
        <NuxtLink
          :to="page.slug"
          class="flex flex-row items-center justify-center w-full overflow-hidden group"
        >
          <span
            :class="
              route.path.split('/')[2] === page.slug.split('/')[2]
                ? 'w-full background p-3 flex items-center justify-start gap-3 rounded-[.5rem_0_0_.5rem] text-sm'
                : 'w-full p-3 flex items-center justify-start gap-3 rounded-[.5rem_0_0_.5rem] text-sm'
            "
          >
            <UIcon
              :name="page.icon"
              class="w-[20px] h-[20px]"
            />
            {{ page.name }}
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
