<template>
  <div>
    <ImageHero
      :img="img"
      :title="title"
      :subtitle="subtitle"
      object-position="object-bottom"
      fit="cover"
    >
      <slot />
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
