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
        caption: `<b>Shweta’s Stargazing Journey (2011–Present)</b><p>A young girl’s curiosity turned into a global mission as Shweta began stargazing at 16 and slowly uncovered the challenges of light pollution. Today, through AstronEra, she empowers others to protect the night skies.</p>`,
      },
      {
        image: '/tara/comics/2.tara-comic-timeline-shweta-most-innovative-award-IAU-2019.jpg',
        alt: 'Award-winning Bhimashankar event in 2019',
        caption: `<b>Most Innovative Event Award – Bhimashankar, 2019</b><p>An unforgettable stargazing event at a tribal school, blending science with storytelling, earned global recognition from the International Astronomical Union. This milestone boosted AstronEra’s credibility and reach.</p>`,
      },
      {
        image: '/tara/comics/3.tara-comic-timeline-astrotribe-2022-2023.jpg',
        alt: 'AstroTribe trainings in Nashik, Ladakh and Manali',
        caption: `<b>AstroTribe Training & Telescope Donation (2022–23)</b><p>AstronEra trained 100+ tribal students across Nashik, Ladakh, and Manali under the AstroTribe initiative, helping 30 become certified AstroGuides. Telescopes were donated so they could earn and educate through stargazing.</p>`,
      },
      {
        image:
          '/tara/comics/4.tara-comic-timeline-astrotribe-visits-cap-conference-sydney-2022.jpg',
        alt: 'AstroTribe at Sydney CAP Conference in 2022',
        caption: `<b>AstroTribe Goes Global – CAP Conference Sydney (2022)</b><p>Shweta presented the AstroTribe project to the world at the prestigious CAP Conference in Sydney. The young AstroGuides also made their mark by joining virtually and sharing their stories.</p>`,
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
        caption: `<b>Stargazing at Key Monastery, Spiti Valley (2023)</b><p>AstronEra brought telescopes to the monks of Key Monastery, uniting meditation and the cosmos. For many, it was their first glimpse into galaxies beyond prayer flags and mountain skies.</p>`,
      },
      {
        image:
          '/tara/comics/6.tara-comic-timeline-international-dark-sky-preservation-and-astrotourism-conference-2023.jpg',
        alt: 'Conference in the Himalayas on dark sky preservation',
        caption: `<b>International Dark Sky & Astrotourism Conference, Manali (2023)</b><p>Held in the Himalayas, AstronEra’s conference gathered experts, policymakers, and educators to address light pollution. Backed by DST and IAU, it was a pioneering step toward India’s dark sky future.</p>`,
      },
      {
        image:
          '/tara/comics/7.tara-comic-timeline-meeting-ruskin-nalayini-and connie-at-lake-tekapo-2024.jpg',
        alt: 'Dark sky friendships in New Zealand, 2024',
        caption: `<b>Global Connections at Lake Tekapo, New Zealand (2024)</b><p>At the Aoraki Mackenzie Dark Sky Reserve, Shweta connected with dark sky legends Ruskin Hartley, Nalayini Brito- Davies, and Connie Walker. A moment of inspiration that seeded international partnerships.</p>`,
      },
      {
        image:
          '/tara/comics/8.tara-comic-timeline-shweta-receives-dark-sky-defender-award-from-2024.jpg',
        alt: 'Shweta receives the Dark Sky Defender Award in 2024',
        caption: `<b>Dark Sky Defender Asia Award (2024)</b><p>Recognized by DarkSky International, Shweta became the first Indian woman to receive the Dark Sky Defender (Asia) award. A tribute to her years of relentless sky-saving efforts.</p>`,
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
        caption: `<b>India’s Dark Sky Policy & Sustainability Symposium (2025)</b><p>AstronEra convened experts and policymakers to draft actionable frameworks for India’s first dark sky policy. It was more than a meeting—it was a national pledge to preserve wonder.</p>`,
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
    'Bringing the cosmos closer to every soul, nurturing a timeless curiosity with authentic knowledge, for a future guided by wonder and scientific spirit.',
  vision:
    'To be the leading global platform making astronomy accessible and inclusive, fostering a scientifically curious and informed society for a sustainable and inspired future.',
  sections: [
    {
      title: 'AstronEra',
      paragraphs: [
        'AstronEra, registered as AEII Pvt. Ltd., has been operational since 2018. Committed to the scientifically accurate and innovative dissemination of astronomy, it was established by Shweta Kulkarni and incubated by the Indian Institute of Management, Bangalore.',
        "The Pune-based firm has gained global recognition for organizing stargazing events, workshops, and courses. Leveraging collaborations with diverse partners and age groups, AstronEra launched the world's first astronomy-dedicated e-learning platform, hosting over 15 courses by worldwide instructors.",
        'The platform at www.astronera.org is transitioning to an interactive community. This will allow the public to connect with astronomy professionals globally, fostering a community of shared knowledge and passion.',
      ],
      images: [
        { src: '/images/trusted/iau.png', alt: 'IAU', link: 'https://www.iau.org/' },
        { src: '/images/trusted/oad.png', alt: 'OAD', link: 'https://astro4dev.org/' },
      ],
    },
    {
      title: 'AstroTribe',
      paragraphs: [
        'The International Astronomical Union (IAU), a Paris-based NGO, is committed to enhancing astronomy through research, outreach, and development. It sponsors the AstroTribe project through its Office of Astronomy for Development (OAD).',
        'Established by AstronEra, AstroTribe aims to empower economically disadvantaged tribal students in India. The project links them into AstroGuides, providing them with learning and earning opportunities through a unique online platform.',
        "In 2022, AstroTribe successfully trained 15 students in Maharashtra, India. The project's ambition extends to training 15 more students in Himachal Pradesh, India in 2023. Through a rigorous selection process, AstroTribe identifies students aged 14-19 and provides them with knowledge, communication, and skill training. It also connects them with mentors and organizers globally for ongoing support and potential stargazing event opportunities.",
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
      title: 'Astron-SHK Trust',
      body: 'Our non-profit under SHK Trust was registered. Shweta, became CEO.',
      icon: 'i-lucide-award',
    },
    {
      date: { month: 'June', year: 2016 },
      title: 'DST, GOI Funded',
      body: 'Guided by Dr Raghunath Mashelkar and Prof. Govind Swarup, we received DST, GOI grant, launching our online presence.',
      icon: 'i-lucide-rocket',
    },
    {
      date: { month: 'March', year: 2019 },
      title: 'IIMB Incubated',
      body: 'Shweta, among top 100 women entrepreneurs in India, helped shape AstronEra, registered as AEII Pvt. Ltd.',
      icon: 'i-lucide-graduation-cap',
    },
    {
      date: { month: 'November', year: 2018 },
      title: 'AstronEra Founded',
      body: 'AstronEra, the first astronomy elearning platform, was launched at Pune Chandrashekhar Auditorium.',
      icon: 'i-lucide-star',
    },
    {
      date: { month: 'March', year: 2019 },
      title: 'IAU Award',
      body: 'Our efforts to popularize astronomy among tribal children recognized by the International Astronomical Union as the most innovative initiative.',
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
              <div
                v-if="section.images"
                class="flex gap-2 mt-4"
              >
                <NuxtLink
                  v-for="image in section.images"
                  :to="image.link"
                  target="_blank"
                >
                  <IBImage
                    :img="{ src: image.src, alt: image.alt }"
                    width="100"
                    height="100"
                    class="bg-white p-4"
                  />
                </NuxtLink>
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
