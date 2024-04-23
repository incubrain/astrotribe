<script lang="ts" setup>
const nonce = useNonce()

defineProps({
  img: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <NuxtImg
    :src="img.src"
    :alt="img.alt"
    :width="img.width"
    :height="img.height"
    :format="img.format"
    :quality="img.quality"
    :loading="img.loading"
    :nonce="nonce"
  />
</template>
