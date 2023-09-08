<template>
  <div>
    <ImageHero
      :img="img"
      :title="title"
      :subtitle="subtitle"
      object-position="object-bottom"
      fit="cover"
    >
      <div class="flex flex-col gap-4 bg-white rounded-md pb-6">
        <slot />
      </div>
    </ImageHero>
  </div>
</template>

<script setup lang="ts">

interface Image {
  title: string
  src: string
  alt: string
}

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  img: {
    type: Object as PropType<Image>,
    required: true
  }
})
</script>
