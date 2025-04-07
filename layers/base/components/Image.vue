<script lang="ts" setup>
const props = defineProps({
  img: {
    type: Object,
    required: true,
  },
  noShrink: {
    type: Boolean,
    default: false,
  },
})

const imageUrl = ref(null)

watch(
  () => props.img.src,
  (newVal) => {
    imageUrl.value = newVal
  },
  { immediate: true },
)

const uuid = useId()
function loadFallbackImage(error: Error) {
  console.error(`Image loading error for: ${JSON.stringify(props.img)}`, error)
  imageUrl.value = `images/defaults/${props.img.type ?? 'fallback'}.jpg`
}
</script>

<template>
  <NuxtImg
    v-if="imageUrl"
    :key="`image-${uuid}`"
    v-bind="$attrs"
    :src="imageUrl"
    :alt="img.alt"
    :width="img.width"
    :height="img.height"
    :format="img.format"
    :quality="img.quality"
    :loading="img.loading"
    crossorigin="anonymous"
    @error="loadFallbackImage"
  />
</template>
