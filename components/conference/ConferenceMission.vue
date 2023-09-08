<template>
  <div class="w-full bg-primary-600 dark:bg-primary-800">
    <div class="conference-wrap">
      <div class="grid items-start grid-cols-1 gap-8 xl:gap-12 lg:grid-cols-2 w-full">
        <div class="flex flex-col lg:flex-row gap-6 xl:gap-12">
          <CommonTitle
            :title="mission.title"
            :subtitle="mission.subtitle"
            :has-border="false"
          />
        </div>
        <div class="p-4 xl:p-8 foreground rounded-md w-full h-full">
          <p>some info about manali</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mission = {
  title: 'Our Mission',
  subtitle: 'some info about the mission',
  points: [
    'Supported by a Department of Science & Technology, Government of India grant, this conference aspires to cultivate awareness, collaboration, and actionable strategies for dark sky conservation and sustainable astrotourism. By inspiring individuals, communities, and nations to protect our celestial heritage, we aspire to create a legacy of starlit skies for generations to come.',
    'We extend a warm invitation to researchers, educators, policymakers, artists, and all passionate about the night sky. Join us in this transformative journey as we collectively shape a brighter future for our shared cosmos.',
    'For inquiries and participation details, please visit the conference website or contact our organizing committee at [Email Address].',
    'Stay tuned for updates as we embark on this remarkable voyage to preserve the beauty of the night sky and propel astrotourism towards sustainability.',
    'Illuminate Tomorrow: For a Radiant Legacy. ✨'
  ]
}
</script>
