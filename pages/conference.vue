<template>
  <div>
    <CommonHero
      :img="{
        title: 'Featured image for the Dark Sky Conservation India Conference',
        src: 'conference/shweta-kulkarnin-milkyway-galaxy-manali.jpg',
        alt: 'Featured image for the Dark Sky Conservation India Conference'
      }"
      subtitle="24th-26th November 2023"
      title="Dark Sky Conservation India Conference"
    >
      <NuxtImg
        class="rounded-full overflow-hidden"
        width="160px"
        height="160px"
        src="conference/conference-logo.png"
        alt="Conference logo"
      />
      <NuxtImg
        src="images/trusted/dst.png"
        class="h-16 mx-auto lg:h-20"
      />
    </CommonHero>
    <div class="wrapper padded-x flex flex-col gap-6 xl:gap-12 py-6 xl:py-12">
      <LazyConferenceAbout />
      <LazyConferenceVenue />
    </div>
    <LazyConferenceVisitManali />
    <div class="wrapper padded-x flex flex-col gap-6 xl:gap-12 py-6 xl:py-12">
      <!-- <LazyConferenceScheduleTabs /> -->
      <LazyConferenceSpeakers />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Conference',
  layout: 'home'
})
</script>
