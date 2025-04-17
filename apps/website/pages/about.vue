<script setup lang="ts">
definePageMeta({
  name: 'About',
})

// Configure animation for section entries
const { conf, animateCounter } = useAnimation()

// Sample comic data - integrated directly in the component
const comicStrips = [
  {
    id: 1,
    title: 'Shweta’s Journey Begins',
    panels: [
      {
        image: '/tara/comics/1.tara-comic-timeline-shwetas-astronera-beginnings-2011.jpg',
        alt: 'Shweta begins stargazing as a teenager in 2011',
        caption: 'A 16-year-old and a telescope—AstronEra begins.',
      },
      {
        image: '/tara/comics/2.tara-comic-timeline-shweta-most-innovative-award-IAU-2019.jpg',
        alt: 'Award-winning Bhimashankar event in 2019',
        caption: 'Innovating under forest skies.',
      },
      {
        image: '/tara/comics/3.tara-comic-timeline-astrotribe-2022-2023.jpg',
        alt: 'AstroTribe trainings in Nashik, Ladakh and Manali',
        caption: 'Tribal students become AstroGuides.',
      },
      {
        image:
          '/tara/comics/4.tara-comic-timeline-astrotribe-visits-cap-conference-sydney-2022.jpg',
        alt: 'AstroTribe at Sydney CAP Conference in 2022',
        caption: 'Local action meets global change.',
      },
    ],
  },
  {
    id: 2,
    title: 'Scaling the Vision',
    panels: [
      {
        image: '/tara/comics/5.tara-comic-timeline-monks-stargazing-at-spiti-valley-2023.jpg',
        alt: 'Monks explore galaxies at Key Monastery, Spiti',
        caption: 'Where prayer met stars.',
      },
      {
        image:
          '/tara/comics/6.tara-comic-timeline-international-dark-sky-preservation-and-astrotourism-conference-2023.jpg',
        alt: 'Conference in the Himalayas on dark sky preservation',
        caption: 'Uniting experts for darker skies.',
      },
      {
        image:
          '/tara/comics/7.tara-comic-timeline-meeting-ruskin-nalayini-and connie-at-lake-tekapo-2024.jpg',
        alt: 'Dark sky friendships in New Zealand, 2024',
        caption: 'Cross-hemisphere inspiration.',
      },
      {
        image:
          '/tara/comics/8.tara-comic-timeline-shweta-receives-dark-sky-defender-award-from-2024.jpg',
        alt: 'Shweta receives the Dark Sky Defender Award in 2024',
        caption: 'A global thank-you for a sky protector.',
      },
    ],
  },
  {
    id: 3,
    title: 'Policy & Legacy',
    panels: [
      {
        image:
          '/tara/comics/9.tara-comic-timeline-indias-dark-sky-policy-and-sustainability-symposium-2025.jpg',
        alt: 'India’s Dark Sky Policy meeting in 2025',
        caption: 'A pledge to protect wonder.',
      },
    ],
  },
]

// Sample about data
const about = {
  images: [
    {
      src: 'about-hero.png',
      alt: 'AstronEra Journey',
    },
  ],
  mission:
    'To make astronomy accessible to all, we provide scientifically accurate and innovative learning opportunities.',
  vision:
    "To be the world's leading astronomy education platform, empowering people to explore the universe.",
  sections: [
    {
      title: 'AstronEra',
      paragraphs: [
        'AstronEra, officially known as AEI Pvt. Ltd., has been operational since 2018. Committed to the scientifically accurate and innovative dissemination of astronomy, it was established by Shweta Kulkarni and incubated by the Indian Institute of Management, Bangalore.',
        "The Pune-based firm has gained global recognition for organizing stargazing events, workshops, and courses. Leveraging collaborations with diverse partners and age groups, AstronEra launched the world's first astronomy-dedicated e-learning platform.",
        'Hosting over 15 courses by worldwide instructors, the platform at www.astronera.org is transitioning to an interactive community. This will allow the public to connect with astronomy professionals globally, fostering a community of shared knowledge and passion.',
      ],
    },
    {
      title: 'AstroTribe',
      paragraphs: [
        'The International Astronomical Union (IAU), a Paris-based NGO, is committed to enhancing astronomy through research, outreach, and development. It sponsors the AstroTribe project through its Office of Astronomy for Development (OAD).',
        'Established by AstronEra, AstroTribe aims to empower economically disadvantaged tribal students in India and Brazil. The project links them into AstroGuides, providing them with learning and earning opportunities through a unique online platform.',
        "In 2022, AstroTribe successfully trained 15 students in Maharashtra, India. The project's ambition extends to training 15 more students in Himachal Pradesh, India, and Brazil in 2023. Through a rigorous selection process, AstroTribe identifies students aged 14-19 and provides them with knowledge, communication, and skill training. It also connects them with mentors and organizers globally for ongoing support and potential stargazing event opportunities.",
      ],
    },
  ],
  timeline: [
    {
      date: { month: 'December', year: 2011 },
      title: 'First Stargazing Event',
      body: 'Shweta held a public event for a Total Lunar Eclipse, beginning her science communication journey.',
      icon: 'i-lucide-moon',
    },
    {
      date: { month: 'November', year: 2013 },
      title: 'Astron-STEM Trust',
      body: 'Our non-profit under STEM Trust was registered. Shweta, its founder, became CEO.',
      icon: 'i-lucide-award',
    },
    {
      date: { month: 'June', year: 2018 },
      title: 'DST, GOI Funded',
      body: 'Guided by Dr. Mathirajan and Prof. Srinivas, we received DST, GOI grant, launching our online presence.',
      icon: 'i-lucide-rocket',
    },
    {
      date: { month: 'March', year: 2019 },
      title: 'IIMB Incubated',
      body: 'Shweta, among top 100 women entrepreneurs in India, helped shape AstronEra, registered as AEI Pvt. Ltd.',
      icon: 'i-lucide-graduation-cap',
    },
    {
      date: { month: 'November', year: 2019 },
      title: 'AstronEra Founded',
      body: 'AstronEra, the first astronomy elearning platform, was launched at Pune Chandrashekhar Auditorium.',
      icon: 'i-lucide-star',
    },
    {
      date: { month: 'March', year: 2020 },
      title: 'IAU Award',
      body: 'Our efforts to popularize astronomy among children recognized by the International Astronomical Union.',
      icon: 'i-lucide-medal',
    },
    {
      date: { month: 'January', year: 2022 },
      title: 'OAD, IAU Funded',
      body: 'AstronEra received an IAU OAD grant to train tribal students as AstroGuides through AstroTribe project.',
      icon: 'i-lucide-landmark',
    },
    {
      date: { month: 'March', year: 2023 },
      title: 'Astrotourism',
      body: "DST, GOI granted funds for AstronEra's Astrotourism and light pollution awareness in Himachal Pradesh and Leh Ladakh.",
      icon: 'i-lucide-map',
    },
  ],
}

// Initialize counters when the page is mounted
onMounted(() => {
  // Animate counter elements
  animateCounter('[data-value]', {
    duration: 2000,
    delay: 300,
    stagger: 0.2,
  })
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <IBImageHero
      :img="about.images[0]"
      :title="{
        main: 'The AstronEra Journey',
      }"
      fit="cover"
      object-position="center"
    />

    <!-- Comic Strip Scroller -->
    <div class="mx-auto py-16">
      <div class="wrapper">
        <h2 class="mb-4 text-3xl font-bold">Our Story in Pictures</h2>
        <p class="mb-8 text-lg">Follow our journey through these comic strips</p>
      </div>

      <AboutComic
        :comics="comicStrips"
        :autoplay-speed="0.4"
      />
    </div>

    <!-- Mission & Vision -->
    <div class="wrapper mx-auto">
      <div
        v-motion
        class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2"
        :initial="conf.fadeUp.initial"
        :enter="conf.fadeUp.enter"
      >
        <IBGlass
          gradient="blue"
          intensity="low"
          interactive
        >
          <h3 class="mb-4 text-2xl font-bold leading-7">The Mission</h3>
          <p class="text-base font-normal">
            {{ about.mission }}
          </p>
        </IBGlass>

        <IBGlass
          gradient="purple"
          intensity="low"
          interactive
        >
          <h3 class="mb-4 text-2xl font-bold leading-7">The Vision</h3>
          <p class="text-base font-normal">
            {{ about.vision }}
          </p>
        </IBGlass>
      </div>
    </div>

    <!-- Main Content Sections -->
    <div class="wrapper mx-auto my-16 grid grid-cols-1 gap-16 lg:grid-cols-4 lg:gap-8">
      <!-- Left Column: About Content -->
      <div
        v-motion
        class="lg:col-span-2"
        :initial="conf.fadeUp.initial"
        :enter="{ ...conf.fadeUp.enter, transition: { delay: 0.2 } }"
      >
        <div class="space-y-12">
          <div
            v-for="(section, index) in about.sections"
            :key="section.title"
            class="w-full"
          >
            <IBGlass
              :gradient="index % 2 === 0 ? 'blue' : 'mixed'"
              intensity="low"
            >
              <h3 class="mb-4 text-2xl font-bold">
                {{ section.title }}
              </h3>
              <div class="space-y-4">
                <p
                  v-for="(item, pIndex) in section.paragraphs"
                  :key="pIndex"
                  class="text-base font-normal"
                >
                  {{ item }}
                </p>
              </div>
            </IBGlass>
          </div>
        </div>
      </div>

      <!-- Right Column: Timeline -->
      <div
        v-motion
        class="h-auto lg:col-span-2"
        :initial="conf.fadeUp.initial"
        :enter="{ ...conf.fadeUp.enter, transition: { delay: 0.4 } }"
      >
        <AboutTimeline :timeline="about.timeline" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Any page-specific styles here */
</style>
