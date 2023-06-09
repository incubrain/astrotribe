<template>
  <div class="example-avatar p-12 w-full h-full">
    <button @click="tester"> clicker </button>
    <p>{{ files }}</p>
    <button
      class="p-6 bg-red-200 mt-4"
      @click="tester2"
    >
      clicker2
    </button>
    <p>{{ files2 }}</p>
  </div>
</template>

<script setup>
const { download } = useStorage()

const files = ref(null)
const files2 = ref(null)

const tester = async () => {
  const { data, error } = await download.folder('9465747a-47a0-46ac-93a7-5151e62b8eff', true)
  console.log(data)
  if (error) {
    return console.log(error)
  }
  files.value = data
}

const tester2 = async () => {
  const { data, error } = await download.avatar('9465747a-47a0-46ac-93a7-5151e62b8eff', true)
  console.log(data)
  if (error) {
    return console.log(error)
  }
  files2.value = data
}
</script>

<style scoped></style>
