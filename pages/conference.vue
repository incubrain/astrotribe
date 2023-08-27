<template>
  <div class="">
    <ConferenceHero />
    <div class="conference-wrap">
      <LazyConferenceAbout />
      <LazyConferenceVenue />
    </div>
    <!-- <ConferenceMission />
    <div class="conference-wrap">
    </div> -->
    <LazyConferenceVisitManali />
    <div class="conference-wrap">
      <LazyConferenceSchedule />
      <!-- <ConferenceSpeakers /> -->
      <HomeCtaSecond
        title="Register to Become a Speaker"
        body="join us if you are awesome"
      >
        <UButton
          to="https://docs.google.com/forms/d/1x57pwaPy1SR6vIEsalR-koz1ypwYtTZFvc8I0dvJXZE/edit?usp=drivesdk"
        >
          Register Now
        </UButton>
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
