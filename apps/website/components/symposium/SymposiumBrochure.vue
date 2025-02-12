<script setup lang="ts">
const pdfUrl = '/symposium/brochure_symposium_2025.pdf' // Replace with your actual PDF path

const downloadPdf = () => {
  const link = document.createElement('a')
  link.href = pdfUrl
  link.download = 'Brochure.pdf'
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
        :src="`${pdfUrl}#page=1&zoom=FitH&toolbar=0&navpanes=0&scrollbar=0`"
        frameborder="0"
        class="w-full h-full blur-sm pointer-events-none"
      ></iframe>
      <PrimeButton
        @click="downloadPdf"
        class="!absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
      >
        Download Brochure
      </PrimeButton>
    </div>
  </div>
</template>
