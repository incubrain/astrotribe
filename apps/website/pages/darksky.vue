<script setup lang="ts">
// Types
interface CarouselItem {
  title: string
  subtitle: string
  image: string
  shortDescription: string
}

interface ImpactStatistic {
  value: string
  description: string
}

interface ActionStep {
  title: string
  description: string
  actionText?: string
  actionUrl?: string
  icon: string
}

interface Resource {
  title: string
  description: string
  url: string
  icon: string
}

interface FAQ {
  question: string
  answer: string
  expandedAnswer?: string
  isExpanded: boolean
}

interface SharePlatform {
  name: string
  icon: string
  url: string
  btnClass: string
}

// References for scrolling
const contentRef = ref<HTMLElement | null>(null)

// Carousel items
const carouselItems: CarouselItem[] = [
  {
    title: 'Wildlife Can’t Adapt to Our Lights',
    subtitle: 'Artificial light is reshaping ecosystems and threatening species.',
    image: 'darksky/wildlife-impact.jpg',
    shortDescription:
      'From disoriented birds to misdirected turtle hatchlings, artificial lighting severely disrupts wildlife behavior and habitat. Protecting dark skies means protecting biodiversity.',
  },
  {
    title: 'Your Body Needs the Dark',
    subtitle: 'Light at night confuses your internal clock and steals your sleep.',
    image: 'darksky/circadian-rhythm.jpg',
    shortDescription:
      'Excessive light at night disrupts our circadian rhythms, affecting melatonin production, sleep quality, and overall health. Darker nights help restore balance and wellbeing.',
  },
  {
    title: 'We’re Burning Money Into the Sky',
    subtitle: 'Poor lighting wastes energy and your community’s resources.',
    image: 'darksky/wasted-energy.jpg',
    shortDescription:
      'Unshielded, excessive lighting not only pollutes the sky—it burns through electricity budgets. Smarter lighting reduces emissions and saves both energy and money.',
  },
  {
    title: 'That Light Doesn’t Belong in Your Garden',
    subtitle: 'Light trespass disrupts peace, privacy, and nearby ecosystems.',
    image: 'darksky/light-tresspass.jpg',
    shortDescription:
      'When artificial light spills beyond property lines, it becomes pollution. It invades homes, disorients wildlife, and erodes our right to darkness. Dark sky principles protect shared space.',
  },
  {
    title: 'The Stars Are Disappearing',
    subtitle: 'Entire generations are growing up without ever seeing the Milky Way.',
    image: 'darksky/cultural-heritage.jpg',
    shortDescription:
      'Light pollution hides the night sky from billions. Preserving dark skies restores wonder, connects us to our history, and ensures future generations can look up in awe.',
  },
  {
    title: 'There Is a Better Way',
    subtitle: 'Smart lighting protects the night, saves money, and improves lives.',
    image: 'darksky/better-way.jpg',
    shortDescription:
      'Downward, dimmer, warmer lighting keeps skies dark and streets safe. Communities benefit from reduced costs, healthier ecosystems, and the return of the stars.',
  },
]

// Impact Statistics
const impactStats: ImpactStatistic[] = [
  {
    value: '~80%',
    description: 'India’s population under light-polluted skies.',
    globalStat: 'Globally ~80%',
  },
  {
    value: '7-10%',
    description: 'Annual increase in light pollution in India.',
    globalStat: 'Globally 7–10%',
  },
  {
    value: '~$800M',
    description: 'Annual cost of wasted outdoor lighting in India.',
    globalStat: 'Globally ~$16B PA',
  },
  {
    value: '50%',
    description: 'Higher breast cancer risk from nighttime light exposure.',
    globalStat: 'Globally 50%',
  },
  {
    value: '70%',
    description: 'Reduction in activity for nocturnal animals in India.',
    globalStat: 'Globally 70%',
  },
]

// Mission section text
const missionAstronomyEducation =
  'Making astronomy accessible to everyone through digital learning, diverse educational resources, and a global community of space enthusiasts.'

const missionDarkSkyPreservation =
  'Pioneering dark sky conservation in India by combating light pollution, promoting sustainable lighting practices, and uniting experts and policymakers to protect our natural nightscapes.'

// Mascot section text
const mascotStory = [
  "Hi, I'm Tara the Firefly—your quirky little mascot for saving the dark skies! As a firefly, I shine brightest when the night is dark and calm.",
  "But with harsh artificial lights, not only are stars disappearing, but it's confusing creatures like me, disturbing humans' sleep, and affecting health!",
  "Protecting the night sky isn't just for stargazing—it's about keeping our planet in balance. I'm thrilled to see experts and policymakers joining forces to bring back the beauty of the night for everyone!",
]

// Action Steps
const actionSteps: ActionStep[] = [
  {
    title: 'Assess Your Home',
    description:
      'Audit your outdoor lighting to identify unnecessary brightness, upward-pointing fixtures, and light spillover, especially in urban areas like Mumbai where light pollution is rising rapidly.',
    actionText: 'Download Audit Checklist',
    actionUrl: 'https://darksky.org/get-involved/home-lighting-assessment/',
    icon: 'mdi:clipboard-check',
    primaryResource: {
      title: 'DarkSky International Home Lighting Assessment',
      url: 'https://darksky.org/get-involved/home-lighting-assessment/',
    },
    moreResources: [
      {
        title: 'LED Lighting Supply Checklist',
        url: 'https://www.ledlightingsupply.com/blog/lighting-audit-checklist',
      },
      {
        title: 'Mongabay India Study on Light Pollution',
        url: 'https://india.mongabay.com/2019/01/light-pollution-on-the-rise-in-india-study/',
      },
    ],
  },
  {
    title: 'Make Simple Changes',
    description:
      'Shield your lights, use warm-colored bulbs under 3000K, and install motion sensors or timers to cut down on light pollution, saving up to $800 million annually in India.',
    actionText: 'View Lighting Guide',
    actionUrl: 'https://darksky.org/resources/guides-and-how-tos/lighting-principles/',
    icon: 'mdi:lightbulb',
    primaryResource: {
      title: 'DarkSky Lighting Principles',
      url: 'https://darksky.org/resources/guides-and-how-tos/lighting-principles/',
    },
    moreResources: [
      {
        title: 'DarkSky Approved Lighting Products',
        url: 'https://darksky.org/what-we-do/darksky-approved/darksky-approved-luminaires-program/luminaires/',
      },
      { title: 'Bureau of Energy Efficiency India', url: 'https://beeindia.gov.in/' },
    ],
  },
  {
    title: 'Spread Awareness',
    description:
      'Educate your community about light pollution’s impact—80% of India’s population can’t see the stars—using films and events like Earth Hour India.',
    actionText: 'Get Sharing Tools',
    actionUrl: 'https://vimeo.com/178841667',
    icon: 'mdi:share-variant',
    primaryResource: {
      title: 'Sriram Murali’s "Lost in Light" Film',
      url: 'https://vimeo.com/178841667',
    },
    moreResources: [
      { title: 'Earth Hour India', url: 'https://www.earthhour.org/india' },
      { title: 'DarkSky Social Media', url: 'https://www.facebook.com/DarkSkyInternational' },
    ],
  },
  {
    title: 'Contact Officials',
    description:
      'Push for dark sky-friendly ordinances in your city, inspired by Mumbai’s public interest litigation, to reduce the 7-10% annual increase in light pollution.',
    actionText: 'Advocacy Resources',
    actionUrl: 'https://darksky.org/what-we-do/advocacy/',
    icon: 'mdi:gavel',
    primaryResource: {
      title: 'DarkSky Advocacy Guide',
      url: 'https://darksky.org/what-we-do/advocacy/',
    },
    moreResources: [
      {
        title: 'Model Lighting Ordinances',
        url: 'https://darksky.org/resources/model-lighting-ordinances/',
      },
      {
        title: 'Mongabay India on Mumbai Litigation',
        url: 'https://india.mongabay.com/2019/01/light-pollution-on-the-rise-in-india-study/',
      },
    ],
  },
  {
    title: 'Join the Movement',
    description:
      'Get involved in events like Hanle Dark Sky Reserve star parties or citizen science projects to protect nocturnal animals facing a 70% activity reduction.',
    actionText: 'Find Local Events',
    actionUrl: 'https://ladakh.gov.in/hanle-dark-sky-reserve-celebrates-its-first-star-party/',
    icon: 'mdi:account-group',
    primaryResource: {
      title: 'Hanle Dark Sky Reserve Star Parties',
      url: 'https://ladakh.gov.in/hanle-dark-sky-reserve-celebrates-its-first-star-party/',
    },
    moreResources: [
      { title: 'Globe at Night Citizen Science', url: 'https://www.globeatnight.org/' },
      {
        title: 'Astronomy Clubs in India',
        url: 'https://www.go-astronomy.com/astronomy-clubs-global.php?Country=India',
      },
    ],
  },
]

// Helpful Resources
const helpfulResources: Resource[] = [
  {
    title: 'International Dark-Sky Association',
    description:
      'The leading organization in the fight against light pollution, offering comprehensive guidance, research, and advocacy.',
    url: 'https://www.darksky.org/',
    icon: 'mdi:earth',
  },
  {
    title: 'Globe at Night',
    description:
      'A citizen science project that invites people worldwide to measure their night sky brightness and submit observations.',
    url: 'https://www.globeatnight.org/',
    icon: 'mdi:globe-light',
  },
  {
    title: 'Light Pollution Map',
    description:
      'Interactive world atlas of artificial night sky brightness, helping you locate areas of low light pollution.',
    url: 'https://www.lightpollutionmap.info/',
    icon: 'mdi:map',
  },
  {
    title: 'Dark Sky Friendly Lighting',
    description:
      'Comprehensive guide to selecting outdoor lighting fixtures that minimize light pollution while maintaining functionality.',
    url: 'https://www.darksky.org/our-work/lighting/lighting-for-industry/',
    icon: 'mdi:lightbulb',
  },
  {
    title: 'Sky Quality Measurement',
    description:
      'Tools and techniques for measuring local light pollution levels and tracking changes over time.',
    url: 'https://www.darksky.org/our-work/conservation/idsp/become-a-dark-sky-place/sky-quality-survey/',
    icon: 'mdi:brightness-7',
  },
  {
    title: 'Educational Materials',
    description:
      'Resources for teachers, community leaders, and parents to educate others about light pollution and dark sky preservation.',
    url: 'https://www.darksky.org/our-work/grassroots-advocacy/resources/public-outreach-materials/',
    icon: 'mdi:school',
  },
]

// FAQs
const faqs: FAQ[] = [
  {
    question: 'What exactly is light pollution?',
    answer:
      'Light pollution is the excessive or inappropriate use of artificial light that disrupts natural darkness. It includes skyglow (brightening of the night sky), glare, light trespass, and clutter.',
    expandedAnswer:
      "These different types of light pollution have varying impacts. Skyglow washes out stars and affects astronomers and nocturnal wildlife. Glare creates safety hazards by reducing visibility. Light trespass occurs when unwanted light enters properties where it's not intended, and clutter involves excessive groupings of light sources.",
    isExpanded: false,
  },
  {
    question: 'Why should I care about dark skies?',
    answer:
      'Dark skies are important for human health, wildlife wellbeing, energy conservation, cultural heritage, and scientific research. Excess artificial light disrupts sleep patterns, endangers nocturnal species, wastes energy, and prevents us from experiencing the night sky.',
    expandedAnswer:
      'Throughout human history, the night sky has inspired art, science, religion, and philosophy. When we lose access to truly dark skies, we lose touch with this fundamental part of our heritage and the sense of wonder it provides.',
    isExpanded: false,
  },
  {
    question: 'How does light pollution affect wildlife?',
    answer:
      'Artificial light at night disrupts natural behaviors of nocturnal animals. It affects predator-prey relationships, migratory patterns, reproduction cycles, and feeding behaviors. For example, sea turtle hatchlings can become disoriented by coastal lighting instead of following moonlight to the ocean.',
    expandedAnswer:
      'Light pollution also affects insects, which are attracted to artificial lights and often die from exhaustion or predation. This disrupts ecosystems as insects are a crucial food source for many animals and important pollinators for plants.',
    isExpanded: false,
  },
  {
    question: 'Does light pollution affect human health?',
    answer:
      'Yes, exposure to artificial light at night disrupts our circadian rhythms, which can lead to sleep disorders, increased stress, and potentially more serious health issues. The blue light from LEDs is particularly disruptive to melatonin production, which regulates our sleep cycles.',
    expandedAnswer:
      'Research has shown potential links between nighttime light exposure and various health conditions including depression, obesity, diabetes, and even certain types of cancer. While more research is needed, reducing unnecessary light exposure at night is considered a prudent health measure.',
    isExpanded: false,
  },
]

// Social Sharing
const sharePlatforms: SharePlatform[] = [
  {
    name: 'Facebook',
    icon: 'mdi:facebook',
    url: 'https://www.facebook.com/sharer/sharer.php',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Twitter',
    icon: 'mdi:twitter',
    url: 'https://twitter.com/intent/tweet',
    btnClass: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    name: 'LinkedIn',
    icon: 'mdi:linkedin',
    url: 'https://www.linkedin.com/shareArticle',
    btnClass: 'bg-blue-700 hover:bg-blue-800',
  },
]

const shareTags = [
  '#DarkSkyPreservation',
  '#FightLightPollution',
  '#AstronEra',
  '#SaveTheNightSky',
  '#StargazingForAll',
]

// Practical steps for fighting light pollution
const practicalSteps = [
  {
    title: 'Shield Your Lights',
    icon: '🛡️',
    tips: [
      'Use fully-shielded fixtures that direct light downward',
      'Cover bare bulbs to prevent light from shining upward',
      'Install motion sensors for security lighting',
      'Adjust existing fixtures with shields or hoods',
    ],
  },
  {
    title: 'Use the Right Lights',
    icon: '💡',
    tips: [
      'Choose warm-colored bulbs (under 3000K)',
      'Use the minimum brightness necessary',
      'Replace cool white LEDs with warm alternatives',
      'Select dark-sky friendly fixtures for outdoor lighting',
    ],
  },
  {
    title: 'Control When Lights Are On',
    icon: '⏱️',
    tips: [
      'Install timers to turn off lights when not needed',
      'Use motion sensors for security and walkway lighting',
      'Turn off decorative lighting after business hours',
      'Advocate for smart lighting systems in your community',
    ],
  },
]

// Events section text
const conferencesText =
  'Uniting experts and enthusiasts to reclaim the night—because preserving dark skies means protecting life, science, and wonder. Take a look at our past and upcoming conferences!'

const symposiumsText =
  'We host a collaborative platform shaping policies for a starlit future—where innovation meets sustainability to combat light pollution. Explore our past and upcoming symposiums!'

// CTA section text
const ctaText =
  'Join us in the fight against light pollution and help preserve our night skies for future generations.'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero Carousel Section -->
    <DarkskyCarousel :items="carouselItems" />

    <!-- What Is Light Pollution Section -->
    <DarkskyDefinition />

    <!-- Impact Statistics Section -->
    <DarkskyStats
      :stats="impactStats"
      title="The Impact of Light Pollution"
      subtitle="Key statistics that highlight the urgent need for change"
    />

    <!-- Main Content Container -->
    <div
      ref="contentRef"
      class="wrapper"
    >
      <!-- Mission Section -->
      <DarkskyMission
        :astronomy-education="missionAstronomyEducation"
        :dark-sky-preservation="missionDarkSkyPreservation"
      />

      <!-- Mascot Section -->
      <DarkskyMascot
        :story-paragraphs="mascotStory"
        button-text="KNOW MY STORY"
        :title="{
          main: 'Meet Tara the Firefly',
          subtitle: 'Your quirky little mascot for saving the dark skies!',
        }"
      />

      <!-- Simulator Section -->
      <DarkskySimulator />

      <!-- Practical Steps Section -->
      <DarkskyPracticalSteps :steps="practicalSteps" />

      <!-- Action Steps Section -->
      <DarkskyActionSteps :steps="actionSteps" />

      <!-- Resources Section -->
      <DarkskyResources :resources="helpfulResources" />

      <!-- FAQ Section -->
      <DarkskyFAQ :faqs="faqs" />

      <!-- Events Section -->
      <!-- <DarkskyEvents
        :conference-text="conferencesText"
        :symposium-text="symposiumsText"
      /> -->

      <!-- Social Sharing Section -->
      <DarkskyShare
        :platforms="sharePlatforms"
        :tags="shareTags"
        page-url="https://astronera.org/darksky"
      />

      <!-- Call to Action -->
      <DarkskyCTA :text="ctaText" />
    </div>
  </div>
</template>
