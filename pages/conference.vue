<template>
  <div class="">
    <ConferenceHero />
    <div class="conference-wrap">
      <ConferenceAbout />
      <ConferenceVenue />
    </div>
    <!-- <ConferenceMission />
    <div class="conference-wrap">
      <ConferenceSchedule />
      <ConferenceSpeakers />
    </div> -->
    <ConferenceVisitManali />
    <div class="conference-wrap">
      <HomeCtaSecond
        title="Register to Become a Speaker"
        body="join us if you are awesome"
      >
        <UButton to="link-to-form"> Register Now </UButton>
      </HomeCtaSecond>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Conference',
  layout: 'home'
})
</script>
