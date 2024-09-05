<template>
  <div class="w-full h-full p-12 example-avatar">
    <button @click="tester">
      clicker
    </button>
    <p>{{ files }}</p>
    <button
      class="p-6 mt-4 bg-red-200"
      @click="tester2"
    >
      clicker2
    </button>
    <p>{{ files2 }}</p>
  </div>
</template>

<script setup>
const files = ref(null)
const files2 = ref(null)

const tester = async () => {
  const { data, error } = await download.folder('9465747a-47a0-46ac-93a7-5151e62b8eff', true)
  if (error) {
    return console.error(error)
  }
  files.value = data
}

const tester2 = async () => {
  const { data, error } = await download.avatar('9465747a-47a0-46ac-93a7-5151e62b8eff', true)
  if (error) {
    return console.error(error)
  }
  files2.value = data
}
</script>

<style scoped></style>
