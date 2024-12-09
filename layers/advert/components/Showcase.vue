<script setup lang="ts">
const { fetchAnalyticsOverview } = useAdsAdminStore()
</script>

<template>
  <div class="bg-[#030711] min-h-screen text-white">
    <!-- Hero Section -->
    <div class="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div
        class="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"
      />
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-[#030711]/80 to-[#030711]"
      />
      <div class="relative text-center px-4">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          A Cosmos to
          <span class="text-blue-400">Advertise</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Your gateway to reaching space enthusiasts, industry leaders, and cosmic innovators
        </p>
      </div>
    </div>

    <AdsPerformance />

    <!-- AD PACKAGES -->
    <AdsPackages />

    <!-- ROI Calculator Section -->
    <AdsRoiCalculator />

    <AdsContact />
  </div>
</template>
