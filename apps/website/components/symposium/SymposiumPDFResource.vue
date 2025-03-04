<script setup lang="ts">
const props = defineProps({
  pdf: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const downloadPdf = () => {
  const link = document.createElement('a')
  link.href = props.pdf
  link.download = `${props.label}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="relative w-full max-w-lg mx-auto">
    <!-- Blurred PDF Preview -->
    <div class="relative h-screen overflow-hidden rounded-lg border border-gray-300 shadow-lg">
      <iframe
        :src="`${pdf}#page=1&zoom=FitH&toolbar=0&navpanes=0&scrollbar=0`"
        frameborder="0"
        class="w-full h-full blur-sm pointer-events-none"
      ></iframe>
      <PrimeButton
        @click="downloadPdf"
        class="!absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
      >
        Download {{ label }}
      </PrimeButton>
    </div>
  </div>
</template>
