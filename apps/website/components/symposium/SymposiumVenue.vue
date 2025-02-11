<script setup lang="ts">
const venues = [
  {
    icon: 'mdi:video-box',
    main: 'Zoom*',
    button: 'Zoom',
    website: 'https://www.zoom.com/',
    about:
      '<b><u>*For Invitees Only</u></b><br/>The meeting ID and password will be shared <b>with the invitees</b>',
    color: 'blue',
  },
  {
    icon: 'mdi:youtube',
    about: 'The event will be broadcasted live on our website as well as on our YouTube channel',
    main: 'YouTube',
    button: 'YouTube',
    website: 'https://youtube.com/live/1ycX0A1jE7Q',
    color: 'red',
  },
]
</script>

<template>
  <div>
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
        <p v-html="venue.about" />
        <div class="mt-2 row-start-2 h-full w-full space-y-4 text-left leading-6">
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
            {{ venue.button }}
          </PrimeButton>
        </div>
      </div>
    </div>
  </div>
</template>
