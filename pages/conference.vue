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
    </CommonHero>
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
          alignement="left"
          title="Champion the Stars"
          body="Become a beacon for preserving our night skies. Share your expertise, advocate for the celestial wonders, and inspire attendees to join the cause."
        >
          <UButton
            color="white"
            to="https://docs.google.com/forms/d/1x57pwaPy1SR6vIEsalR-koz1ypwYtTZFvc8I0dvJXZE/edit?usp=drivesdk"
            block
          >
            Register as a Speaker
          </UButton>
        </HomeCtaSecond>
        <HomeCtaSecond
          alignement="left"
          title="Attend Online or In-Person"
          body="Join us in Manali under clear night skies or virtually from home. Delve into captivating sessions and connect with astronomy enthusiasts."
        >
          <UButton
            color="white"
            to="https://forms.gle/FU9QT3QAXy63G3qQA"
            block
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
