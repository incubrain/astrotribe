<template>
  <div class="h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] flex flex-row relative">
    <div
      class="hidden md:flex h-full border-r-[1px] border-gray-300 bg-[#E5E7EB] overflow-y-scroll w-[360px]"
    >
      <!-- this is the left bar -->
      <div class="flex flex-col text-[#000] text-sm cursor-pointer">
        <div class="flex flex-col w-full border-b-[1px] border-gray-300 p-4 gap-4">
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm text-[#26a85c] font-semibold rounded-full"> CATEGORY </p>
            <div class="flex gap-2">
              <UIcon
                name="i-material-symbols-thumb-up-outline-rounded"
                class="w-6 h-6"
              />
              <UIcon
                name="i-material-symbols-delete-outline"
                class="w-6 h-6"
              />
              <UIcon
                name="i-material-symbols-create-new-folder-outline"
                class="w-6 h-6"
              />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <img
              src="/images/team/drew-macgibbon.jpg"
              class="rounded-full h-[46px]"
            />
            <h3 class="text-lg font-semibold leading-6">
              Test title that is quite long and will spill over
            </h3>
          </div>
          <p class="text-xs"> By Drew MacGibbon, 12th Dec, 2022 </p>
        </div>
        <div class="flex flex-col w-full border-b-[1px] border-gray-300 p-4 gap-4">
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm text-[#26a85c] font-semibold rounded-full"> TWO WORDS </p>
            <div class="flex gap-2">
              <UIcon
                name="i-material-symbols-thumb-up-outline-rounded"
                class="w-6 h-6"
              />
              <UIcon
                name="i-material-symbols-delete-outline"
                class="w-6 h-6"
              />
              <UIcon
                name="i-material-symbols-create-new-folder-outline"
                class="w-6 h-6"
              />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <img
              src="/images/team/drew-macgibbon.jpg"
              class="rounded-full h-[46px]"
            />
            <h3 class="text-lg font-semibold leading-6"> Medium length for the title </h3>
          </div>
          <p class="text-xs"> By Drew MacGibbon, 12th Dec, 2022 </p>
        </div>
        <div class="flex flex-col w-full border-b-[1px] border-gray-300 p-4 gap-4">
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm text-[#26a85c] font-semibold rounded-full"> THREE WORD CATEGORY </p>
            <div class="flex gap-2">
              <UIcon
                name="i-material-symbols-thumb-up-outline-rounded"
                class="w-6 h-6"
              />
              <UIcon
                name="i-material-symbols-delete-outline"
                class="w-6 h-6"
              />
              <UIcon
                name="i-material-symbols-create-new-folder-outline"
                class="w-6 h-6"
              />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <img
              src="/images/team/drew-macgibbon.jpg"
              class="rounded-full h-[46px]"
            />
            <h3 class="text-lg font-semibold leading-6"> Test shorter title </h3>
          </div>
          <p class="text-xs"> By Drew MacGibbon, 12th Dec, 2022 </p>
        </div>
      </div>
    </div>
    <div class="flex w-full">
      <!-- this is the article section -->
      <!-- <AppifyTest /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Newsfeed'
})
</script>
