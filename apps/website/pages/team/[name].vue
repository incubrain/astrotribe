<script setup lang="ts">
import team from '../../data/home/team.json'

definePageMeta({
  name: 'TeamIndividual',
})

const { name } = useRoute().params
const user = computed(() =>
  team.find((user) => user.name.toLowerCase().replaceAll(' ', '-') === name),
)
</script>

<template>
  <div
    v-if="user"
    class="relative"
  >
    <IBImageHero
      :img="{
        src: 'images/team/cartoon_of_adult_astronomers_with_a_telescope.jpg',
        alt: 'AstronEra team page hero image, cartoon of astronomers looking at the stars',
      }"
      :title="{
        main: user.name,
        subtitle: `${user.position.title} at AstronEra`,
      }"
    />

    <div class="wrapper flex flex-wrap items-start justify-center xl:pb-12">
      <div
        class="background border-color easy-in-out w-full transform rounded-b-md border backdrop-blur-lg backdrop-filter duration-200"
      >
        <div class="-mt-16 flex items-center justify-start lg:-mt-24">
          <IBImage
            :img="{
              src: user.avatar,
              alt: user.name,
            }"
            class="background h-32 w-32 rounded-full p-2 lg:h-48 lg:w-48"
          />
        </div>
        <div class="grid grid-cols-1 gap-20 p-4 lg:grid-cols-2 xl:p-8">
          <div class="flex flex-col gap-3">
            <h3 class="mb-4 text-2xl font-semibold"> About {{ user.given_name }} </h3>
            <p
              v-for="(section, i) in user.bio"
              :key="i"
              :class="i === 0 ? 'text-xl' : 'text-base'"
            >
              {{ section }}
            </p>
          </div>

          <div>
            <h4 class="mb-4 text-xl font-semibold"> Connect with {{ user.given_name }} </h4>
            <AppSocialBlock
              :socials="user.socials"
              :has-title="false"
              position="justify-start"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
