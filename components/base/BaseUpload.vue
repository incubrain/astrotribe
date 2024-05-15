<script setup lang="ts">
const onUpload = (event: any) => {
  console.log(event)
}

const handleSelect = (event) => {
  console.log('selectEvent', event)
}
</script>
<template>
  <div>
    <PrimeFileUpload
      name="demo[]"
      url="/api/upload"
      accept="image/*"
      :max-file-size="1000000"
      @select="handleSelect"
      @upload="onUpload"
    >
      <template #empty>
        <p>Drag and drop files to here to upload.</p>
      </template>
    </PrimeFileUpload>
  </div>
</template>

<style scoped></style>
