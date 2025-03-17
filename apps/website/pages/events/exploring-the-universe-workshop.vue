<script setup lang="ts">
const toc = [
  {
    id: 13,
    depth: 1,
    text: 'About',
    link: 'about',
  },
  {
    id: 1,
    depth: 1,
    text: 'Day 1: Building Foundations',
    link: 'day1',
  },

  {
    id: 3,
    depth: 1,
    text: 'Day 2: Ancient Tools & Solar System Wonders',
    link: 'day2',
  },
  {
    id: 5,
    depth: 1,
    text: 'Day 3: Inspiration & Exploration',
    link: 'day3',
  },
  {
    id: 6,
    depth: 1,
    text: 'Day 4: Physics in Action',
    link: 'day4',
  },
  {
    id: 7,
    depth: 1,
    text: 'Day 5: Stargazing Night',
    link: 'day5',
  },
  {
    id: 8,
    depth: 1,
    text: 'What Students Will Gain',
    link: 'whatStudentsWillGain',
  },
]

const title = {
  main: '5 Day Astronomy Workshop',
  subtitle: 'Exploring the Universe Hands-On\n[23rd to 27th April 2025]',
  img: 'images/telescope-workshop-2025.jpeg',
}

const registrationLink = 'https://forms.gle/Vwy6tSWEGvKX4Quq6'

const buildingFoundations = [
  {
    slot: 'wednesday',
    value: '0',
    label: 'Wednesday',
    day: 23,
    month: 'April',
    year: 2025,
    items: [
      {
        activity: 'Telescope Model Making',
        time: { start: '07:00', end: '07:10' },
        description: [
          'Learn: How telescopes magnify distant objects, principles of light reflection and refraction',
          'A basic functional telescope model to take home',
          'Students Should Bring: Scissors, ruler and a notebook for obervations',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Spacecraft Model Making',
        time: { start: '07:10', end: '07:30' },
        description: [
          'Learn: Key spacecraft components (solar panels, antennas) and mission planning basics',
          'Outcome: A simple spacecraft model and an understanding of space missions',
          'Students Should Bring: Sketchbook for design ideas nd glue',
        ],
        class: 'bg-primary-950',
      },
    ],
  },
]

const ancientTools = [
  {
    slot: 'thursday',
    value: '1',
    label: 'Thursday',
    day: 24,
    month: 'April',
    year: 2025,
    items: [
      {
        activity: 'Astrolabe Model Making',
        time: { start: '07:00', end: '07:10' },
        description: [
          'Learn: How ancient astronomers measured celestial positions',
          'Outcome: working astrolabe model and knowledge of historical navigation',
          'Students Should Bring: Compass, pencil',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Planet Distances & Sizes',
        time: { start: '07:10', end: '07:20' },
        description: [
          'Learn: Spatial awareness of the solar system using shadu clay models',
          'Outcome: Scale model of the solar system showcasing planetary sizes and distances',
          'Students Should Bring: Apron or old clothes (for clay work), ruler',
        ],
        class: 'bg-primary-950',
      },
    ],
  },
]

const inspirationAndExploration = [
  {
    slot: 'friday',
    value: '1',
    label: 'Friday',
    day: 25,
    month: 'April',
    year: 2025,
    items: [
      {
        activity: 'Creative Session: Careers in Space & Exploring the Universe',
        time: { start: '07:00', end: '07:10' },
        description: [
          'Learn: Diverse career paths in the space industry and future exploration possibilities',
          'Outcome: A personalized roadmap on how students can pursue space-related careers',
          'Students Should Bring: Journal for notes and personal reflection',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Documentary Screening + Scientific Discussion',
        time: { start: '07:10', end: '07:20' },
        description: [
          'Learn: Cutting-edge discoveries and challenges in space through a curated documentary',
          'Outcome: Enhanced understanding of complex scientific concepts via discussion',
          'Students Should Bring: Curiosity and questions!',
        ],
        class: 'bg-primary-950',
      },
    ],
  },
]

const physicsInAction = [
  {
    slot: 'saturday',
    value: '1',
    label: 'Saturday',
    day: 26,
    month: 'April',
    year: 2025,
    items: [
      {
        activity: 'Parachute & Egg Drop Challenge',
        time: { start: '07:00', end: '07:10' },
        description: [
          'Learn: Concepts of drag, gravity, and aerodynamics in real-world applications',
          'Outcome: A parachute that protects an egg dropped from a height—successful designs get a surprise reward!',
          'Students Should Bring: Light materials like plastic bags, tape, string, scissors',
        ],
        class: 'bg-primary-950',
      },
    ],
  },
]

const stargazingNight = [
  {
    slot: 'saturday',
    value: '1',
    label: 'Saturday',
    day: 27,
    month: 'April',
    year: 2025,
    items: [
      {
        activity: 'Stargazing Night',
        time: { start: '07:00', end: '07:10' },
        description: [
          'Learn: How to identify constellations, planets, and celestial objects using telescopes and star maps',
          'Outcome: Ability to navigate the night sky and understand celestial patterns',
          'Students Should Bring: Warm clothing, flashlight (preferably red light), notebook for observations',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Documentary Screening + Scientific Discussion',
        time: { start: '07:10', end: '07:20' },
        description: [
          'Learn: Cutting-edge discoveries and challenges in space through a curated documentary',
          'Outcome: Enhanced understanding of complex scientific concepts via discussion',
          'Students Should Bring: Curiosity and questions!',
        ],
        class: 'bg-primary-950',
      },
    ],
  },
]

const whatStudentsWillGain = [
  'Hands-on experience with astronomical tools (telescopes, astrolabes)',
  'Deep understanding of solar system dynamics and spacecraft engineering',
  'Practical knowledge of physics through fun experiments',
  'Career insights into the space industry-how anyone can be a part of it!',
  'The unforgettable experience of observing stars and planets firsthand',
]
</script>

<template>
  <div>
    <CommonHero
      :img="{
        src: title.img,
        alt: title.main,
        width: 1080,
        height: 720,
      }"
      :title="title"
      position="center"
    >
    </CommonHero>
    <div class="flex min-h-screen">
      <div class="hidden md:block w-1/4 h-full sticky top-6">
        <PrimeAccordion
          value="0"
          class="z-10 py-6 px-6 xl:gap-12 xl:py-12"
        >
          <PrimeAccordionPanel value="0">
            <PrimeAccordionHeader
              class="flex gap-4 bg-primary-800 px-4 py-2 rounded-md items-center"
            >
              <h3 class="text-lg font-semibold"> Table of Contents </h3>
            </PrimeAccordionHeader>
            <PrimeAccordionContent>
              <ul>
                <li
                  v-for="item in toc"
                  :key="item.id"
                  class="py-1"
                >
                  <NuxtLink
                    :to="`#${item.link}`"
                    class="text-lg font-[Oswald] p-button-text"
                  >
                    <h4>
                      {{ item.text }}
                    </h4>
                  </NuxtLink>
                </li>
              </ul>
            </PrimeAccordionContent>
          </PrimeAccordionPanel>
        </PrimeAccordion>
      </div>
      <div class="wrapper w-screen flex flex-col gap-6 py-6 xl:gap-12 xl:py-12">
        <NuxtLink :to="registrationLink">
          <PrimeButton
            size="large"
            severity="contrast"
            outlined
            >Register Now</PrimeButton
          ></NuxtLink
        >
        <CommonTitle
          id="about"
          :title="{ main: 'About' }"
        />
        <p
          >The Astronomy Workshop offers students a unique opportunity to explore the cosmos through
          hands-on activities like telescope building, spacecraft modeling, and stargazing.
          Astronomy inspires curiosity, critical thinking, and problem-solving—skills essential for
          future innovators. By understanding the universe, students gain perspective on science,
          technology, and our place in the cosmos. Empower your cosmic curiosity—because the future
          belongs to those who dream beyond the stars.
        </p>
        <hr />
        <h3
          id="day1"
          class="text-2xl lg:text-4xl font-bold"
          >Day 1: Building Foundations - Telescopes & Spacecraft</h3
        >
        <p><b>Theme:</b> Understanding Tools of Exploration</p>
        <p><b>Fee:</b> ₹1000 Per Person</p>
        <EventSchedule :schedule="buildingFoundations" />
        <hr />
        <h3
          id="day2"
          class="text-2xl lg:text-4xl font-bold"
          >Day 2: Ancient Tools & Solar System Wonders</h3
        >
        <p><b>Objective:</b> Mapping the Sky & Understanding Distances</p>
        <p><b>Fee:</b> ₹1000 Per Person</p>
        <EventSchedule :schedule="ancientTools" />
        <hr />
        <h3
          id="day3"
          class="text-2xl lg:text-4xl font-bold"
          >Day 3: Inspiration & Exploration</h3
        >
        <p><b>Theme:</b> Dreaming Big in the Space Industry</p>
        <p><b>Fee:</b> ₹700 Per Person</p>
        <EventSchedule :schedule="inspirationAndExploration" />
        <hr />
        <h3
          id="day4"
          class="text-2xl lg:text-4xl font-bold"
          >Day 4: Physics in Action - The Egg Drop Challenge</h3
        >
        <p><b>Theme:</b> Applying Engineering & Physics Principles</p>
        <p><b>Fee:</b> ₹1000 Per Person</p>
        <EventSchedule :schedule="physicsInAction" />
        <hr />
        <h3
          id="day5"
          class="text-2xl lg:text-4xl font-bold"
          >Day 5: Stargazing Night - Concluding the Journey</h3
        >
        <p><b>Theme:</b> Experiencing the Cosmos</p>
        <p><b>Fee:</b> ₹200 Per Person</p>
        <EventSchedule :schedule="stargazingNight" />
        <hr />
        <h3
          id="whatStudentsWillGain"
          class="text-2xl lg:text-4xl font-bold"
          >What Students Will Gain by the End of the Workshop</h3
        >
        <ul
          v-for="item in whatStudentsWillGain"
          :key="item"
        >
          <li>{{ item }}</li>
        </ul>
        <NuxtLink :to="registrationLink">
          <PrimeButton
            size="large"
            severity="contrast"
            outlined
            >Register Now</PrimeButton
          ></NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
