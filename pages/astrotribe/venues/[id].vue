<template>
  <div class="mx-auto overflow-hidden">
    <div class="relative">
      <ImageCarousel
        :images="images"
        class="mb-6 md:rounded-md"
      />
      <div class="absolute z-10 flex flex-col items-center gap-3 top-2 left-2">
        <NuxtImg
          class="object-contain p-2 overflow-hidden border-2 rounded-full bg-light w-14 h-14 md:w-20 md:h-20"
          :src="
            storage.image.optimized({
              bucket: 'venues',
              folderPath: `${s.venue.id}/logo`,
              fileType: 'venue-logo',
              file: s.venue.logo,
              isPrivate: false,
              transform: { width: 80, height: 80, fit: 'cover', quality: 75 }
            })
          "
          width="80"
          height="80"
          :alt="`${s.venue.name} logo`"
        />
        <UButton
          class="flex flex-row items-center justify-center gap-1 px-2 py-1 text-xs font-semibold leading-none rounded-md md:px-4 md:py-2"
          color="primary"
        >
          10
          <UIcon
            name="i-material-symbols-event-available"
            class="w-4 h-4 md:w-6 md:h-6"
          />
        </UButton>
      </div>
    </div>
    <div
      class="max-w-[1080px] mx-auto flex flex-col foreground p-0 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 md:rounded-md"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 p-4 md:p-0">
          <div class="flex flex-col">
            <h1 class="flex items-center text-lg font-semibold md:text-xl xl:text-2xl">
              {{ s.venue.name }}
            </h1>
            <span class="flex items-center">
              <UIcon
                name="i-material-symbols-star"
                class="w-5 h-5 mr-1 text-yellow-400"
              />
              {{ s.venue.avg_rating?.toPrecision(2) }}
            </span>
            <h3 class="flex items-center mt-4 text-xs underline md:text-sm xl:text-base">
              <a
                :href="googleMapsLink"
                target="_blank"
                rel="noopener noreferrer"
                class="link"
              >
                {{ fullAddress }}
              </a>
            </h3>
          </div>
        </div>
      </div>
      <CommonBlockText
        v-if="s.venue.body"
        :body="s.venue.body"
        title="About us"
        class="p-4 md:p-0"
      />
      <CommonBortle
        v-if="s.venue.bortle_rating"
        :rating="s.venue.bortle_rating"
        class="p-4 md:p-0"
      />
      <h4 class="p-4 text-lg font-semibold md:text-xl xl:text-2xl md:p-0"> Events </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-4 xl:gap-8">
        <CardEvent
          v-for="event in s.venue.events"
          :key="event.id"
          :event="event"
          :venue="s.venue"
          class="shadow-none background"
        />
      </div>
      <h4 class="p-4 text-lg font-semibold md:text-xl xl:text-2xl md:p-0"> Location </h4>
      <div class="aspect-square shadow-sm h-[380px] overflow-hidden md:rounded-md">
        <iframe
          class="h-full"
          width="100%"
          height="100%"
          style="border: 0"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBUvoTKNiRUwSrT7Z8BaD30LU1Bm3v0mto
                          &q=ChIJM2Ck_VMd6DsR8LTGwkkLwU0+Pawana+Nagar,+Maval,+Shilimb,+Maharashtra+410406,+India"
        >
        </iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params

const v = useVenuesStore()
const storage = useStorage()
const util = useUtils()

const images = await v.getVenueImages({ venueId: Number(id) })
v.getVenueSingle({ venueId: Number(id) })

const s = appState()

const fullAddress = computed(() => {
  console.log('venue.location', s.venue.location)
  if (!s.venue.location) return ''
  return `${s.venue.location?.address}, ${s.venue.location.city}, ${s.venue.location.state}, ${s.venue.location.country}`
})
const googleMapsLink = computed(() => {
  const formattedAddress = fullAddress.value.split(' ').join('+')
  return `https://www.google.com/maps/search/${formattedAddress}`
})
</script>

<style lang="scss"></style>
