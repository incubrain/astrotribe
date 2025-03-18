<script setup lang="ts">
defineProps<{
  authors: any[]
}>()
</script>

<template>
  <div
    v-if="authors"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-8"
  >
    <div
      v-for="(author, i) in authors"
      :key="`author-${i}`"
      class="border-color foreground flex h-full flex-col items-center gap-4 rounded-xl border p-4 xl:p-8"
    >
      <div>
        <IBImage
          v-if="author"
          :img="{
            src: `images/team/${author.name.toLowerCase().replace(' ', '-')}.jpg`,
            alt: `${author.name} is an author on the AstronEra Blog`,
            width: 100,
            height: 100,
          }"
          class="h-full rounded-full sm:max-w-[100px]"
        />
      </div>
      <div
        v-if="author"
        class="w-full space-y-1 text-left"
      >
        <h4 class="text-xl font-semibold"> About {{ author.name }} </h4>
        <div class="flex items-center gap-2">
          <!-- <IBSocialBlock
            v-if="author.socials"
            size="24px"
            :socials="author.socials"
          /> -->
          <PrimeTag class="text-sm uppercase text-primary-600"> follow me </PrimeTag>
        </div>
        <p class="text-sm">
          {{ author.bio }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
