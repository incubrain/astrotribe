<script setup lang="ts">
definePageMeta({
  name: 'Conference',
})

// !todo: low priority - reduce the amount of text at the beginning of the page
// !todo: low priority - fix the styling of the conference schedule
// consider: creating a 20-30 second video of the conference to use as the Hero Section
</script>

<template>
  <div>
    <CommonHero
      :img="{
        src: 'conference/photos/IDSPAC23-ruchira-huchgol.jpg',
        alt: 'Featured image for the Dark Sky Conservation India Conference',
      }"
      :title="{
        centered: false,
        main: 'Dark Sky Conservation India Conference',
        subtitle: '24th-26th November 2023',
      }"
      position="object-top"
    >
      <IBImage
        :img="{
          width: '160px',
          height: '160px',
          src: 'conference/conference-logo.png',
          alt: 'Conference logo',
        }"
        class="overflow-hidden rounded-full"
      />
      <IBImage
        :img="{
          src: 'images/trusted/dst.png',
        }"
        class="mx-auto h-16 lg:h-20"
      />
    </CommonHero>
    <div class="wrapper padded-x flex flex-col gap-6 py-6 xl:gap-12 xl:py-12">
      <ConferenceAbout />
      <div class="flex flex-col gap-6 xl:gap-12">
        <div class="flex flex-col items-start gap-6 lg:flex-row xl:gap-12">
          <div class="space-y-4">
            <p class="text-sm font-bold uppercase text-primary-500 dark:text-primary-700">
              Conference Summary
            </p>
            <p>
              The conference effectively laid the groundwork for substantive discussions concerning
              the preservation of dark skies and the promotion of astro-tourism in India,
              successfully achieving its stated goals and objectives. In light of the insights
              garnered from this conference, the subsequent steps entail the organization of an
              in-person workshop spanning 2-3 days, aimed at convening stakeholders, government
              officials, engineers, architects, and space policy representatives.
            </p>
            <p>
              This workshop will be instrumental in addressing the issue of light pollution and
              formulating actionable solutions, thereby taking a significant stride toward
              preserving dark and tranquil skies.
            </p>
          </div>
          <div class="space-y-4">
            <p>
              Additionally, plans are underway to convene an online summit to synthesize the
              discussions held and distill key themes for consideration in future in-person
              conferences.
            </p>
            <p>
              Moreover, a collaborative endeavor is ongoing to host a dedicated in-person conference
              focusing on "Preserving the Night Sky for Astronomy and Sustainable Development,"
              which will bring together government officials and industry experts to engage in
              substantive discussions and collectively devise pragmatic solutions. Subsequent
              initiatives will include the dissemination of research findings through the
              publication of articles, reports, and papers across various platforms, including the
              CAP conference, IAU publications, and esteemed scientific journals.
            </p>
          </div>
        </div>
        <div>
          <IBImage
            :img="{
              src: 'conference/photos/IDSPAC23-group-photo.jpg',
              alt: 'Manu Allaya resort at night with the milky way in the background',
              width: '900',
              height: '460',
            }"
            class="mx-auto w-full rounded-md"
          />
          <p class="w-full p-4 text-center">
            Thank you to everyone who made this possible! ❤️
          </p>
          <div class="flex items-center justify-center">
            <a
              href="/conference/full-conference-report.pdf"
              target="_blank"
            >
              <PrimeButton> View Full Conference Report </PrimeButton>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper padded-x flex flex-col gap-6 py-6 xl:gap-12 xl:py-12">
      <ConferenceVenue class="py-16" />
      <ConferenceScheduleTabs />
      <ConferenceSpeakers />
    </div>
  </div>
</template>
