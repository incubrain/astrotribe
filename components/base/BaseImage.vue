<script lang="ts" setup>
const nonce = useNonce()
const uuid = useId()

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
    v-bind="$attrs"
    v-if="imageUrl"
    :src="imageUrl"
    :alt="img.alt"
    :width="img.width"
    :height="img.height"
    :format="img.format"
    :quality="img.quality"
    :loading="img.loading"
    @error="loadFallbackImage"
    :key="`image-${uuid}`"
    :nonce="nonce"
    crossorigin="anonymous"
  />
</template>
