<script setup lang="ts">
const toc = [
  {
    id: 1,
    depth: 1,
    text: 'Beginner Level Session I',
    link: 'beginnerLevel',
  },

  {
    id: 3,
    depth: 1,
    text: 'Intermediate Level Session II',
    link: 'intermediateLevel',
  },
  {
    id: 5,
    depth: 1,
    text: 'What to Bring?',
    link: 'whatToBring',
  },
  {
    id: 6,
    depth: 1,
    text: 'Pre-Workshop Preparation',
    link: 'preWorkshop',
  },
  {
    id: 7,
    depth: 1,
    text: "What's Provided in the Workshop?",
    link: 'provided',
  },
]

const title = {
  main: 'Telescope Setting Workshop',
  img: 'images/telescope-workshop-2025.jpeg',
}

const registrationLink = 'https://forms.gle/DZhUN6d5AeH3qmch8'

const beginnerSchedule = [
  {
    slot: 'saturday',
    value: '0',
    label: 'Saturday',
    day: 8,
    month: 'March',
    year: 2025,
    items: [
      {
        activity: 'Welcome & Introduction',
        time: { start: '07:00', end: '07:10' },
        description: [
          '- Introduction to the workshop',
          '- Discussion on experience with telescopes',
          '- Recap',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Understanding Telescopes',
        time: { start: '07:10', end: '07:30' },
        description: [
          '- Different types of telescopes',
          '- Discuss parts of a telescope',
          '- How to choose the right telescope based on budget & interest',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Telescope Assembly & Balancing',
        time: { start: '07:30', end: '07:50' },
        description: [
          '- Hands-on: Unbox and assemble a simple telescope',
          '- Balance the telescope for stable viewing',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Break & Q&A',
        time: { start: '07:50', end: '08:00' },
        description: ['- Short break for networking & questions'],
        class: 'bg-primary-950',
      },
      {
        activity: 'Basic Sky Navigation',
        time: { start: '08:00', end: '08:10' },
        description: [
          '- How to use Sky Maps & Stellarium to find celestial objects',
          '- Locating the Moon, planets & bright stars',
          '- Constellation Mapping',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Hands-On Observation Session',
        time: { start: '08:10', end: '08:50' },
        description: [
          '- Participants take turns using the telescope to view the Moon (or bright objects)',
          '- Adjusting focus, understanding eyepieces',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Wrap-Up',
        time: { start: '08:50', end: '09:00' },
        description: ['- Quick recap & feedback session.'],
        class: 'bg-primary-950',
      },
    ],
  },
]

const intermediateSchedule = [
  {
    slot: 'saturday',
    value: '1',
    label: 'Saturday',
    day: 15,
    month: 'March',
    year: 2025,
    items: [
      {
        activity: 'Welcome & Overview',
        time: { start: '07:00', end: '07:10' },
        description: [
          '- Introduction to the session',
          '- Discuss participant experience with telescopes',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Sky Navigation',
        time: { start: '07:10', end: '07:20' },
        description: ['- Constellation Mapping'],
        class: 'bg-primary-950',
      },
      {
        activity: 'Deep Sky Object Tracking',
        time: { start: '07:20', end: '07:50' },
        description: [
          '- How to locate and track Nebulae, Star Clusters, and Galaxies',
          '- Practice pointing telescopes manually & with slow-motion controls',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Break & Q&A',
        time: { start: '07:50', end: '08:00' },
        description: ['- Open discussion for doubts'],
        class: 'bg-primary-950',
      },
      {
        activity: 'Filters & Accessories',
        time: { start: '08:00', end: '08:10' },
        description: [
          '- Introduction to Barlow lenses, Moon & Nebula filters',
          '- How different filters enhance observation',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Hands-On Tracking Activity',
        time: { start: '08:10', end: '08:50' },
        description: [
          '- Practice tracking Orion Nebula, or Andromeda Galaxy',
          '- Use laser pointers to learn constellation mapping',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Wrap-Up',
        time: { start: '08:50', end: '09:00' },
        description: ['- Recap of learning.'],
        class: 'bg-primary-950',
      },
    ],
  },
]

const whatToBring = [
  '✔ Notebook & Pen – For taking notes on telescope setup & sky maps.',
  '✔ Red Flashlight – Helps maintain night vision while reading maps.',
  '✔ Smartphone or Tablet – Download Stellarium / SkySafari / Star Walk for sky navigation.',
  '✔ Water Bottle -Stay hydrated & refreshed.',
  '✔ Personal Telescope (Optional) – If you own one, bring it for hands-on practice!',
]

const preWorkshop = [
  '🔹 Download a Sky Map App: Stellarium',
  '🔹 Charge Your Phone & Power Bank – You might need it for apps & taking pictures',
  '🔹 Read Up on Basic Astronomy Terms – Understand terms like “focal length,” “magnification,” and “alt-azimuth”',
]

const provided = [
  '✔ Telescope & Accessories for training  (Eyepieces, Barlow lenses, Filters)',
  '✔ Sky Maps',
  '✔ Expert Guidance & Hands-on Experience',
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
        <h3
          id="beginnerLevel"
          class="text-2xl lg:text-4xl font-bold"
          >Beginner Level Session I</h3
        >
        <p><b>Objective:</b> Introduction to telescope types, basic handling, and sky navigation</p>
        <p class="flex"
          ><b>Venue:</b>
          <Icon
            name="mdi:location"
            size="24px"
            class="text-red-600"
          />
          Prachi, 392/6B, Atreya Society, Deep Bangla Chowk, Model Colony, Pune, Maharashtra 411016
        </p>
        <iframe
          id="iframe"
          class="px-2"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15132.046394090614!2d73.831345!3d18.528378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf781273177b%3A0x748518923253f332!2sAstron%20Era!5e0!3m2!1sen!2sin!4v1687445031830!5m2!1sen!2sin"
          style="border: 0"
          referrerpolicy="no-referrer-when-downgrade"
        />
        <p><b>Fee:</b> ₹2000 Per Person</p>
        <EventSchedule :schedule="beginnerSchedule" />
        <hr />
        <h3
          id="intermediateLevel"
          class="text-2xl lg:text-4xl font-bold"
          >Intermediate Level Session II</h3
        >
        <p
          ><b>Objective:</b> Learn how to fine-tune your telescope, track celestial objects, and
          spot constellations.</p
        >
        <p class="flex"
          ><b>Venue:</b>
          <Icon
            name="mdi:location"
            size="24px"
            class="text-red-600"
          />
          Prachi, 392/6B, Atreya Society, Deep Bangla Chowk, Model Colony, Pune, Maharashtra 411016
        </p>
        <iframe
          id="iframe"
          class="px-2"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15132.046394090614!2d73.831345!3d18.528378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf781273177b%3A0x748518923253f332!2sAstron%20Era!5e0!3m2!1sen!2sin!4v1687445031830!5m2!1sen!2sin"
          style="border: 0"
          referrerpolicy="no-referrer-when-downgrade"
        />
        <p><b>Fee:</b> ₹2500 Per Person</p>
        <EventSchedule :schedule="intermediateSchedule" />
        <hr />
        <h3
          id="whatToBring"
          class="text-2xl lg:text-4xl font-bold"
          >What to Bring?</h3
        >
        <ul v-for="item in whatToBring">
          <li>{{ item }}</li>
        </ul>
        <hr />
        <h3
          id="preWorkshop"
          class="text-2xl lg:text-4xl font-bold"
          >Pre-Workshop Preparation</h3
        >
        <ul v-for="item in preWorkshop">
          <li>{{ item }}</li>
        </ul>
        <hr />
        <h3
          id="provided"
          class="text-2xl lg:text-4xl font-bold"
          >What's Provided in the Workshop</h3
        >
        <ul v-for="item in provided">
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
