<template>
  <div class="relative h-full w-full flex flex-col items-center">
    <!-- Timeline events -->
    <div
      v-for="detail in details"
      :key="detail.id"
      class="w-full flex items-start border-r-2 border border-color relative"
    >
      <!-- Details -->
      <div class="flex flex-col justify-center w-full p-4">
        <h2 class="font-bold text-lg lg:leading-9 leading-7">
          {{ detail.title }}
        </h2>
        <p class="font-normal text-base leading-6 mt-4">
          {{ detail.description }}
        </p>
      </div>

      <!-- Circle and icon -->
      <div class="absolute w-[20px] h-[20px] right-[-10px] top-[-10px] z-10">
        <div class="p-1 absolute foreground rounded-full flex justify-center items-center">
          <UIcon
            :name="detail.icon"
            class="w-4 h-4 rounded-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Detail = {
  id: number
  title: string
  description: string
  icon: string
}

const details = ref<Detail[]>([
  {
    id: 1,
    title: 'Company founded',
    description: 'It is a long established in 1988',
    icon: 'i-material-symbols-home-rounded'
  },
  {
    id: 2,
    title: 'Product Launch',
    description: 'Product was launched in 1990',
    icon: 'i-material-symbols-rocket-launch-rounded'
  },
  {
    id: 3,
    title: 'Expansion',
    description: 'Company expanded to new markets in 1995',
    icon: 'i-material-symbols-globe-asia'
  }
])
</script>
