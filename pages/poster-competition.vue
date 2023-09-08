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
    </CommonHero>
    <div class="conference-wrap">
      <CompetitionAbout />
      <CommonTitle
        class="w-full lg:w-1/2 mx-auto"
        :title="submission.title"
        :subtitle="submission.subtitle"
      >
        <div class="w-full leading-6 text-sm space-y-4 text-left row-start-2 h-full">
          <ul>
            <li
              v-for="(criteria, i) in submission.criteria"
              :key="`poster-criteria-${i}`"
              class="list-disc mx-4"
            >
              {{ criteria }}
            </li>
          </ul>
          <p class="font-normal">
            {{ submission.info }}
          </p>
          <div class="flex gap-4">
            <UButton
              to="https://forms.gle/sYgukUyRhNs3cSZX8"
              target="_blank"
            >
              Submit Poster
            </UButton>
            <a
              href="/competition/astronera-poster-competition-details.pdf"
              target="_blank"
            >
              <UButton> Full Brief </UButton>
            </a>
          </div>
        </div>
      </CommonTitle>
    </div>
  </div>
</template>

<script setup lang="ts">
const submission = {
  title: 'Submission',
  subtitle: 'Judging Criteria',
  info: 'The entrants must complete the online registrations and the submission must include, (but are not limited to) the points listed in the brief as a whole.',
  criteria: [
    'Importance of DARK SKY PRESERVATION.',
    'Dark Sky Conservation and implementation for SDG’s',
    'Satellite constellation becoming a hurdle for astronomy.',
    'Astro-tourism is a new frontier.',
    'Indian astronomy past and future.',
    'Increasing light pollution.'
  ]
}

definePageMeta({
  name: 'Poster Competition',
  layout: 'home'
})
</script>
