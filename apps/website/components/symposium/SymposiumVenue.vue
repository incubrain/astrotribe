<script setup lang="ts">
const venues = [
  {
    icon: 'mdi:video-box',
    main: 'Zoom',
    website: 'https://www.zoom.com/',
    about: 'The meeting ID and password will be shared soon',
    color: 'blue',
  },
  {
    icon: 'mdi:youtube',
    about: 'The event will be broadcasted live on our YouTube channel',
    main: 'YouTube',
    website: 'https://www.youtube.com/',
    color: 'red',
  },
]
</script>

<template>
  <CommonTitle :title="{ main: 'Venue' }" />
  <div class="relative grid grid-cols-1 items-start gap-6 lg:grid-cols-2 xl:gap-12">
    <div
      class="border-2 p-2 rounded"
      v-for="venue in venues"
    >
      <CommonTitle
        class="row-start-1"
        :title="venue"
      />
      <p>{{ venue.about }}</p>
      <div class="row-start-2 h-full w-full space-y-4 text-left leading-6">
        <PrimeButton
          class="gap-2 border-white"
          as="a"
          :href="venue.website"
          target="_blank"
          variant="outlined"
        >
          <Icon
            :name="venue.icon"
            :class="`text-${venue.color}-400 group-hover:text-sky-400 transition-colors duration-300`"
            size="36px"
          />
          {{ venue.main }}
        </PrimeButton>
      </div>
    </div>
    <CommonTitle :title="{ main: 'For Invites Only' }" />
  </div>
</template>
