<template>
  <div class="flex items-center justify-center py-home w-full h-full">
    <div
      class="flex flex-col gap-10 justify-center items-center h-[360px] bg-primary w-full rounded-lg shadow-lg mx-auto"
    >
      <h4 class="head-2">
        {{ title }}
      </h4>
      <v-btn
        color="white"
        size="large"
      >
        <!-- <Icon
          :class="hasIcon ? 'flex' : 'hidden'"
          :name="icon"
        /> -->
        Join Free Today
      </v-btn>
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
