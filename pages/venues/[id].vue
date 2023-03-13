<template>
    <div>
        <div class="text-slate-600 pb-8 flex justify-between items-center">
            <div class="flex gap-4 items-center">
                <div class="bg-white border-4 border-slate-800 rounded-full overflow-hidden w-28 h-28 p-2 ">
                    <img src="/venue/hilton-logo.png" alt="" class="object-contain w-full h-full" />
                </div>
                <div class="flex flex-col">
                    <h1 class="text-2xl font-bold"> Hilton Shillim Estate Retreat & Spa</h1>
                    <h3 class="mt-1 flex items-center text-md">
                        <Icon name="uil:location-point" size="20px" class="mr-2" />
                        Pawana Nagar, Maval, Shilimb, Maharashtra 410406
                    </h3>
                </div>
            </div>
            <div>
                <button class="bg-blue-500 text-white text-md px-4 py-2 rounded-lg flex items-center">
                    10 events hosted
                    <Icon name="material-symbols:event-available" size="20px" class="ml-2" />
                </button>
            </div>
        </div>
        <VenueImgBlock />
        <div
            class="w-full relative grid grid-cols-1 lg:grid-cols-3 mt-6 gap-6 row-start-3 row-span-1 lg:col-start-2"
        >
            <div class="row-start-1 col-span-1 lg:col-span-3 w-full flex flex-wrap over gap-8 h-auto">
                <div class="flex items-center px-6 py-2 rounded-lg bg-white w-full flex-grow lg:max-w-[340px]">
                    <h4 class="pr-2 text-lg"> Our rating</h4>
                    <AppStars
                        :rating="4.5"
                        :starSize="28"
                    />
                </div>
                <div class="flex items-center rounded-lg bg-white min-w-[600px] w-full lg:w-2/6 flex-grow">
                    <CommonBortle />
                </div>
                <a
                    class="bg-blue-500 text-white text-md px-6 py-2 rounded-lg flex items-center justify-center w-full lg:w-[15%]"
                    href="https://www.hilton.com/en/hotels/pnqshhi-hilton-shillim-estate-retreat-and-spa/"
                    >
                    Book a stay
                    <Icon name="material-symbols:event-available" size="20px" class="ml-2" />
                </a>
            </div>
            <CommonBlockText
                :body="desc"
                title="About"
                class="col-span-1 row-start-2 lg:col-span-2 row-span-1"
            />
            <div class="bg-white rounded-lg overflow-hidden col-span-1 row-span-2 row-start-3 lg:row-start-2">
                <h4 class="pr-2 text-2xl font-semibold w-full p-8"> Events </h4>
                <div style="border-top: 1px solid #E5E7EB;"/>
                <CardEvent />
                <div style="border-top: 1px solid #E5E7EB;"/>
                <CardEvent />
            </div>
            <div class="h-full col-span-1 row-span-1 rounded-lg overflow-hidden shadow-sm lg:row-start-3 lg:col-span-2 min-h-[380px]">
                <iframe
                    width="100%"
                    height="100%"
                    style="border:0"
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBUvoTKNiRUwSrT7Z8BaD30LU1Bm3v0mto
                        &q=ChIJM2Ck_VMd6DsR8LTGwkkLwU0+Pawana+Nagar,+Maval,+Shilimb,+Maharashtra+410406,+India">
                    </iframe>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import CardEvent from '../../components/card/CardEvent.vue'

const desc = `
    Our retreat is nestled in the Sahyadri mountain range, a five-minute walk from the small village of Shillim.
    Connect with a personalized Dharana wellness program
    with yoga, meditation, conservation walks,
    and cooking lessons. Ayurveda-inspired dining, quiet zones,
    and private villas calm the senses amid views of the Western Ghats.`

</script>

<style lang="scss">

</style>