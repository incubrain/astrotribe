<template>
  <div class="bg-white overflow-hidden max-w-[1200px]">
    <div class="relative">
      <VenueImgBlock
        :venue-id="s.venue.id"
        :images="images"
        class="mb-6"
      />
      <div class="absolute top-2 left-2 flex flex-col gap-3 items-center z-10">
        <img
          :src="util.venues.logo(s.venue.id, s.venue.logo)"
          alt=""
          class="object-contain bg-white border-4 border-slate-800 rounded-full overflow-hidden w-[60px] h-[60px] md:w-28 md:h-28 p-2"
        />
        <button
          class="bg-[#1d2f6d] text-white text-xs font-semibold leading-none px-2 py-1 md:px-4 md:py-2 rounded-md flex items-center justify-center flex-row gap-1"
        >
          10
          <Icon
            name="material-symbols:event-available"
            size="16px"
          />
        </button>
      </div>
    </div>
    <div class="max-w-[900px] flex flex-col">
      <div class="text-slate-600 card flex justify-between items-center">
        <div class="flex gap-4 items-center">
          <div class="flex flex-col">
            <h1 class="card-heading font-bold flex items-center">
              {{ s.venue.name }}
            </h1>
            <span class="card-subheading flex items-center">
              <Icon
                name="material-symbols:star"
                size="16px"
                class="text-yellow-400 mr-1"
              />
              {{ s.venue.avg_rating?.toPrecision(2) }}
            </span>
            <h3 class="card-body mt-4 flex items-center underline">
              <a
                :href="googleMapsLink"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-600 hover:text-blue-800"
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
        class="card"
        title="About us"
      />
      <CommonBortle :rating="s.venue.bortle_rating" />
      <h4 class="card-padding card-heading text-black"> Events </h4>
      <div class="card-grid">
        <CardEvent
          v-for="event in s.venue.events"
          :key="event.id"
          :event="event"
          :venue="s.venue"
          class="shadow-none border-black"
        />
      </div>
      <div class="h-full aspect-square shadow-sm min-h-[380px] overflow-hidden md:rounded-md">
        <h4 class="card-padding card-heading text-black"> Location </h4>
        <iframe
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
