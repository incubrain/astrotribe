<template>
  <div class="">
    <CommonHero
      :img="{
        title: 'Featured image for the Dark Sky Conservation India Conference',
        src: 'images/milkyway-background.jpg',
        alt: 'Featured image for the Dark Sky Conservation India Conference'
      }"
      subtitle="Deadline 30th September 2023"
      title="CONFERENCE POSTER COMPETITION"
    >
      <NuxtImg
        class="rounded-full overflow-hidden"
        width="160px"
        height="160px"
        src="astronera-logo-with-text.jpg"
        alt="AstronEra Logo"
      />
      <NuxtImg
        src="images/trusted/dst.png"
        class="h-16 mx-auto lg:h-20"
      />
    </CommonHero>
    <div class="conference-wrap">
      <CompetitionAbout />
      <CommonTitle
        class="w-full lg:w-1/2 mx-auto foreground"
        :title="submission.title"
        :subtitle="submission.subtitle"
      >
        <div class="w-full leading-6 text-sm space-y-4 text-left row-start-2 h-full">
          <p class="font-normal">
            {{ submission.info }}
          </p>
          <ul>
            <li
              v-for="(prize, i) in submission.prizes"
              :key="`poster-prize-${i}`"
              class="list-disc mx-4"
            >
              <strong> {{ prize.title }}:</strong> {{ prize.body }}
            </li>
          </ul>
          <p class="font-normal">
            Join us in celebrating the wonder of the night sky and the imperative of its
            preservation. Your vision could pave the way to global acknowledgment at our
            international conference.
          </p>
          <div class="border-t border-color pt-4 space-y-4">
            <h3 class="text-xl xl:text-2xl font-bold">Create A Poster</h3>
            <UBadge variant="soft" color="sky" class="mr-4">Deadline 30th September 2023</UBadge>
            <UBadge variant="soft" color="sky">Winners Selected 10th October 2023</UBadge>
          </div>
          <div class="flex gap-4">
            <a
              href="/competition/astronera-poster-competition-details.pdf"
              target="_blank"
            >
              <UButton> Full Brief </UButton>
            </a>
            <UButton
              to="https://forms.gle/sYgukUyRhNs3cSZX8"
              target="_blank"
            >
              Submit Poster
            </UButton>
            <UButton to="/conference">Dark Skies Conference</UButton>
          </div>
        </div>
      </CommonTitle>
    </div>
  </div>
</template>

<script setup lang="ts">
const submission = {
  title: 'Competition Prizes',
  subtitle: 'One Winner Per Theme (6 total)',
  info: 'The entrants must complete the online registrations and the submission must include, (but are not limited to) the points listed in the brief as a whole. For each of our competition themes, one exemplary participant will be crowned the winner. These distinguished winners will receive',
  prizes: [
    {
      title: 'Exclusive Invitation',
      body: 'An opportunity to attend the prestigious International Dark Sky Preservation and Astro-tourism Conference set in the scenic landscapes of Manali, Himachal Pradesh.'
    },
    {
      title: 'Travel Bursary',
      body: 'A financial aid of Rs. 10,000 will be granted to each winner to assist with their travel expenses.'
    },
    {
      title: 'Accommodation & Meals',
      body: 'Rest assured, your stay is on us! Winners will be provided with comfortable accommodations, along with complimentary meals, for the duration of the conference.'
    }
  ]
}

definePageMeta({
  name: 'Poster Competition',
  layout: 'home'
})
</script>
