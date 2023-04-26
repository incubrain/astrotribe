<template>
  <div class="flex items-center justify-center py-home w-full h-full">
    <div
      class="flex flex-col gap-10 justify-center items-center h-[360px] bg-primary w-full rounded-xl shadow-lg mx-auto"
    >
      <h4 class="head-2"> {{ title }}</h4>
      <button class="btn-lg btn-inverted text-dark text-xl font-semibold">
        <!-- <Icon
          :class="hasIcon ? 'flex' : 'hidden'"
          :name="icon"
        /> -->
        Join Free Today
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String as PropType<string>,
    required: true
  },
  cta: {
    type: String as PropType<string>,
    required: true
  }
})
</script>

<style scoped></style>
