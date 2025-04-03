<script setup lang="ts">
import { ref } from 'vue'
import team from '../../data/home/team.json'

definePageMeta({
  name: 'TeamIndividual',
})

const { name } = useRoute().params
const user = computed(() =>
  team.find((user) => user.name.toLowerCase().replaceAll(' ', '-') === name),
)

// Achievements timeline for team member
const achievements = ref([
  {
    year: 2015,
    title: 'Joined AstronEra',
    description: 'Started contributing to the mission of astronomy education.',
    icon: 'mdi:rocket-launch',
  },
  {
    year: 2017,
    title: 'Key Publication',
    description: 'Published research on astronomy education methods.',
    icon: 'mdi:file-document',
  },
  {
    year: 2020,
    title: 'Leading Community Initiative',
    description: 'Organized community stargazing events in rural areas.',
    icon: 'mdi:star-shooting',
  },
  {
    year: 2022,
    title: 'Recognition Award',
    description: 'Received industry recognition for contributions to astronomy education.',
    icon: 'mdi:medal',
  },
])

// Media items for Spotlight section
const mediaItems = ref([
  {
    type: 'article',
    title: 'Innovations in Astronomy Education',
    source: 'Space Magazine',
    description: 'Featured article on educational approaches.',
    thumbnail: '/images/team/media/article-1.jpg',
    link: '#',
  },
  {
    type: 'video',
    title: 'Understanding Dark Sky Conservation',
    source: 'YouTube',
    description: 'An in-depth look at light pollution issues.',
    thumbnail: '/images/team/media/video-1.jpg',
    link: '#',
  },
  {
    type: 'article',
    title: 'The Future of Astronomy Outreach',
    source: 'Education Today',
    description: 'How technology is changing astronomy education.',
    thumbnail: '/images/team/media/article-2.jpg',
    link: '#',
  },
])

// Set page title and metadata
useHead(() => ({
  title: user.value ? `${user.value.name} - AstronEra Team` : 'Team Member - AstronEra',
  meta: [
    {
      name: 'description',
      content: user.value
        ? `Learn more about ${user.value.name}, ${user.value.position.title} at AstronEra.`
        : 'Team member profile at AstronEra',
    },
  ],
}))

const { stars, isClient } = useStarfield(40, 5)
const { conf } = useAnimation()
</script>

<template>
  <div
    v-if="user"
    class="relative"
  >
    <!-- Hero section -->
    <div
      class="relative flex items-center justify-center h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden"
    >
      <!-- Background image with overlay -->
      <IBImage
        :img="{
          src: '/images/team/team-member-bg.jpg',
          alt: 'Starry night sky background',
          width: 1920,
          height: 1080,
        }"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-primary-950/70 to-primary-950/90"></div>

      <!-- Stars background -->
      <div
        v-if="isClient"
        class="absolute inset-0 pointer-events-none"
      >
        <div
          v-for="star in stars"
          :key="star.id"
          class="absolute rounded-full bg-white"
          :style="star.style"
        ></div>
      </div>

      <!-- Hero content -->
      <div
        class="absolute z-10 top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-6"
      >
        <h1
          v-motion
          class="text-4xl md:text-5xl font-bold mb-4 text-white"
          :initial="conf.fadeUp.initial"
          :enter="conf.fadeUp.enter"
        >
          {{ user.name }}
        </h1>
        <h2
          v-motion
          class="text-xl md:text-2xl text-primary-300 mb-8"
          :initial="conf.fadeUp.initial"
          :enter="{
            ...conf.fadeUp.enter,
            transition: { ...conf.fadeUp.enter.transition, delay: 0.1 },
          }"
        >
          {{ user.position.title }}
        </h2>

        <!-- Social links -->
        <div
          v-motion
          class="flex gap-4"
          :initial="conf.fadeUp.initial"
          :enter="{
            ...conf.fadeUp.enter,
            transition: { ...conf.fadeUp.enter.transition, delay: 0.2 },
          }"
        >
          <IBSocialBlock
            :socials="user.socials"
            :has-title="false"
          />
        </div>
      </div>
    </div>

    <!-- Profile image (positioned to overlap hero and content sections) -->
    <div
      v-motion
      class="relative z-20 mx-auto -mt-24 md:-mt-32 mb-12 w-40 h-40 md:w-56 md:h-56"
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }"
    >
      <div class="bg-primary-950 p-2 rounded-full shadow-xl">
        <IBImage
          :img="{
            src: user.avatar,
            alt: user.name,
            width: 240,
            height: 240,
          }"
          class="w-full h-full rounded-full object-cover"
          view-transition-name="team-avatar"
        />
      </div>
    </div>

    <!-- Main content -->
    <div class="wrapper">
      <!-- Back to team link -->
      <div class="mb-8 flex items-center">
        <NuxtLink
          to="/team"
          class="text-primary-400 hover:text-primary-300 flex items-center gap-2 transition-colors"
        >
          <Icon name="mdi:arrow-left" />
          <span>Back to Team</span>
        </NuxtLink>
      </div>

      <!-- About section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <!-- Biography -->
        <div class="lg:col-span-2">
          <IBGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="mixed"
            intensity="low"
            class="p-6 md:p-8"
          >
            <h3 class="text-2xl font-bold mb-6 text-white">About {{ user.given_name }}</h3>
            <div class="space-y-4">
              <p
                v-for="(section, i) in user.bio"
                :key="i"
                :class="i === 0 ? 'text-lg text-primary-100' : 'text-primary-200'"
              >
                {{ section }}
              </p>
            </div>
          </IBGlass>
        </div>

        <!-- Quick facts -->
        <div>
          <IBGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="low"
            class="p-6 md:p-8"
          >
            <h3 class="text-xl font-bold mb-6 text-white">Quick Facts</h3>

            <div class="space-y-6">
              <!-- Specialties -->
              <div>
                <h4 class="text-lg text-primary-300 mb-2 font-semibold flex items-center gap-2">
                  <Icon
                    name="mdi:star"
                    class="text-primary-400"
                  />
                  Specialties
                </h4>
                <ul class="list-disc list-inside text-primary-200 space-y-1">
                  <li>Astronomy Education</li>
                  <li>Public Outreach</li>
                  <li>Dark Sky Conservation</li>
                </ul>
              </div>

              <!-- Education -->
              <div>
                <h4 class="text-lg text-primary-300 mb-2 font-semibold flex items-center gap-2">
                  <Icon
                    name="mdi:school"
                    class="text-primary-400"
                  />
                  Education
                </h4>
                <ul class="text-primary-200 space-y-1">
                  <li class="mb-2">
                    <div class="font-medium">PhD in Astronomy</div>
                    <div class="text-sm text-primary-400">University of Cambridge</div>
                  </li>
                  <li>
                    <div class="font-medium">BSc in Physics</div>
                    <div class="text-sm text-primary-400">Imperial College London</div>
                  </li>
                </ul>
              </div>

              <!-- Languages -->
              <div>
                <h4 class="text-lg text-primary-300 mb-2 font-semibold flex items-center gap-2">
                  <Icon
                    name="mdi:translate"
                    class="text-primary-400"
                  />
                  Languages
                </h4>
                <ul class="text-primary-200">
                  <li>English (Native)</li>
                  <li>Spanish (Conversational)</li>
                </ul>
              </div>
            </div>
          </IBGlass>
        </div>
      </div>

      <!-- Timeline section -->
      <div class="mb-16">
        <h3
          v-motion
          class="text-2xl font-bold mb-8 text-white text-center"
          :initial="conf.fadeUp.initial"
          :visible="conf.fadeUp.enter"
        >
          Professional Journey
        </h3>

        <div class="relative">
          <!-- Center line -->
          <div
            class="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-primary-600/40"
          ></div>

          <div class="space-y-10">
            <div
              v-for="(achievement, index) in achievements"
              :key="index"
              v-motion
              class="relative flex flex-col md:flex-row md:even:flex-row-reverse items-start"
              :initial="conf.fadeUp.initial"
              :visible="{
                ...conf.fadeUp.enter,
                transition: { ...conf.fadeUp.enter.transition, delay: index * 0.1 },
              }"
            >
              <!-- Timeline dot -->
              <div
                class="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 w-10 h-10 rounded-full bg-primary-900 border-2 border-primary-600 flex items-center justify-center z-10"
              >
                <Icon
                  :name="achievement.icon"
                  class="text-primary-400"
                  size="16"
                />
              </div>

              <!-- Content -->
              <div class="md:w-[calc(50%-30px)] pl-16 md:pl-0 md:pr-10 md:even:pl-10 md:even:pr-0">
                <IBGlass
                  hover-effect="glow"
                  glow-color="blue"
                  gradient="mixed"
                  intensity="low"
                  class="p-4 md:p-5"
                >
                  <div
                    class="inline-block px-3 py-1 bg-primary-900/50 text-primary-400 rounded-full text-sm font-bold mb-3"
                  >
                    {{ achievement.year }}
                  </div>

                  <h4 class="text-lg font-semibold text-white mb-2">{{ achievement.title }}</h4>
                  <p class="text-primary-200">{{ achievement.description }}</p>
                </IBGlass>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Spotlight section (Media & Articles) -->
      <div class="mb-16">
        <h3
          v-motion
          class="text-2xl font-bold mb-8 text-white text-center"
          :initial="conf.fadeUp.initial"
          :visible="conf.fadeUp.enter"
        >
          In the Spotlight
        </h3>

        <div
          v-motion
          class="grid grid-cols-1 md:grid-cols-3 gap-6"
          :initial="conf.fadeUp.initial"
          :visible="{
            ...conf.fadeUp.enter,
            transition: { ...conf.fadeUp.enter.transition, delay: 0.1 },
          }"
        >
          <IBGlass
            v-for="(item, index) in mediaItems"
            :key="index"
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="low"
            class="overflow-hidden group"
          >
            <a
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="block"
            >
              <div class="media-thumbnail relative aspect-video overflow-hidden">
                <IBImage
                  :img="{
                    src: item.thumbnail,
                    alt: item.title,
                    width: '400',
                    height: '225',
                  }"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  v-if="item.type === 'video'"
                  class="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-primary-600/80 flex items-center justify-center"
                  >
                    <Icon
                      name="mdi:play"
                      size="24"
                      class="text-white ml-1"
                    />
                  </div>
                </div>
                <div
                  class="absolute top-2 left-2 px-2 py-1 bg-gray-900/70 rounded text-xs font-semibold"
                >
                  {{ item.source }}
                </div>
              </div>

              <div class="p-4">
                <h4 class="text-lg font-semibold text-white mb-1">{{ item.title }}</h4>
                <p class="text-sm text-primary-300">{{ item.description }}</p>
              </div>
            </a>
          </IBGlass>
        </div>
      </div>

      <!-- Contact section -->
      <div class="mb-16">
        <IBGlass
          v-motion
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="medium"
          class="p-8"
          :initial="conf.fadeUp.initial"
          :visible="conf.fadeUp.enter"
        >
          <div class="flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="md:w-2/3 text-center md:text-left">
              <h3 class="text-2xl font-bold mb-4 text-white">Connect with {{ user.given_name }}</h3>
              <p class="text-primary-200 mb-6 md:mb-0">
                Interested in collaborating on astronomy education or outreach initiatives? Get in
                touch with {{ user.given_name }} for potential partnerships or speaking engagements.
              </p>
            </div>

            <div class="md:w-1/3 flex flex-col gap-4">
              <NuxtLink to="/contact">
                <PrimeButton
                  severity="primary"
                  class="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-0"
                >
                  <div class="flex items-center justify-center gap-2">
                    <Icon name="mdi:email" />
                    <span>Contact {{ user.given_name }}</span>
                  </div>
                </PrimeButton>
              </NuxtLink>

              <div class="flex justify-center gap-4">
                <IBSocialBlock
                  :socials="user.socials"
                  :has-title="false"
                />
              </div>
            </div>
          </div>
        </IBGlass>
      </div>
    </div>
  </div>
  <div
    v-else
    class="wrapper py-20 text-center"
  >
    <h2 class="text-2xl text-white mb-4">Team member not found</h2>
    <p class="text-primary-300 mb-8">The team member you're looking for doesn't seem to exist.</p>
    <NuxtLink to="/team">
      <PrimeButton severity="secondary">
        <div class="flex items-center gap-2">
          <Icon name="mdi:arrow-left" />
          <span>Back to Team</span>
        </div>
      </PrimeButton>
    </NuxtLink>
  </div>
</template>

<style scoped>
/* View Transitions styles */
::view-transition-old(team-avatar),
::view-transition-new(team-avatar) {
  mix-blend-mode: normal;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
