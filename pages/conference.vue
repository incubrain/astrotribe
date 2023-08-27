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
      <div class="grid items-start gap-6 xl:gap-12 grid-cols-1 md:grid-cols-2">
        <HomeCtaSecond
          title="Champion the Stars"
          body="Become a beacon for preserving our night skies. Share your expertise, advocate for the celestial wonders, and inspire attendees to join the cause."
        >
          <UButton
            color="white"
            to="https://docs.google.com/forms/d/1x57pwaPy1SR6vIEsalR-koz1ypwYtTZFvc8I0dvJXZE/edit?usp=drivesdk"
          >
            Register as a Speaker
          </UButton>
        </HomeCtaSecond>
        <HomeCtaSecond
          title="Attend Online or In-Person"
          body="Join us in Manali under clear night skies or virtually from home. Delve into captivating sessions and connect with astronomy enthusiasts."
        >
          <UButton
            color="white"
            to="https://forms.gle/FU9QT3QAXy63G3qQA"
          >
            Register as an Attendee
          </UButton>
        </HomeCtaSecond>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Conference',
  layout: 'home'
})
</script>
