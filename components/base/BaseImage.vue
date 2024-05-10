<script lang="ts" setup>
// const nonce = useNonce()

const props = defineProps({
  img: {
    type: Object,
    required: true
  }
})


const imageUrl = ref(props.img.src)
function handleError() {
  imageUrl.value = 'fallback.jpg'
}

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
    @error="handleError"
    crossorigin="anonymous"
    />
    <!-- :nonce="nonce" -->
</template>
