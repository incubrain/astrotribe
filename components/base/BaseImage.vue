<script lang="ts" setup>
// const nonce = useNonce()

const props = defineProps({
  img: {
    type: Object,
    required: true
  }
})

const imageUrl = ref(null)

watch(
  () => props.img.src,
  (newVal) => {
    console.log('newVal', newVal)
    imageUrl.value = newVal
  },
  { immediate: true }
)

function loadFallbackImage() {
  imageUrl.value = `images/defaults/${props.img.type ?? 'fallback'}.jpg`
}
</script>

<template>
  <NuxtImg
    v-if="imageUrl"
    :src="imageUrl"
    :alt="img.alt"
    :width="img.width"
    :height="img.height"
    :format="img.format"
    :quality="img.quality"
    :loading="img.loading"
    @error="loadFallbackImage"
    crossorigin="anonymous"
  />
  <!-- :nonce="nonce" -->
</template>
