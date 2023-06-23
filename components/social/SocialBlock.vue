<template>
  <div class="flex flex-col">
    <h2 v-if="hasTitle" class=" text-xl lg:text-2xl font-semibold leading-normal">Follow us</h2>
    <div class="flex w-full gap-2 mt-2">
      <IconSocial v-for="s in socials" :key="s.platform" :platform="s.platform" :link="s.link" />
    </div>
  </div>
</template>

<script setup lang="ts">

interface Social {
  platform: string
  link: string
}

defineProps({
  socials: {
    type: Array as PropType<Social[]>,
    required: true
  },
  hasTitle: {
    type: Boolean,
    default: true
  }
})

</script>

<style scoped></style>
