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
    title: 'Effects On Different Species',
    subtitle: 'Artificial light disrupts wildlife behavior and ecosystems',
    image: 'darksky/carousel_(1).jpeg',
    shortDescription:
      'Artificial light disrupts wildlife behavior, affecting foraging, mating, and migration patterns. Dark sky preservation helps maintain biodiversity and ecosystem health.',
  },
  {
    title: 'Circadian Rhythm',
    subtitle: 'Light pollution affects human health and wellbeing',
    image: 'darksky/carousel_(2).jpeg',
    shortDescription:
      'Excessive light at night disrupts human circadian rhythms, leading to sleep disorders and health issues. Dark sky practices improve wellbeing and enhance stargazing opportunities.',
  },
  {
    title: 'Energy Waste',
    subtitle: 'Reducing unnecessary lighting decreases carbon footprint',
    image: 'darksky/carousel_(3).jpeg',
    shortDescription:
      'Excessive lighting wastes energy and increases greenhouse gas emissions. Dark sky initiatives help communities reduce their carbon footprint and mitigate climate change.',
  },
  {
    title: 'Tribal Community Preservation',
    subtitle: 'Natural darkness supports cultural practices',
    image: 'darksky/carousel_(4).jpeg',
    shortDescription:
      'Many tribal communities rely on natural darkness for cultural practices, storytelling, and ceremonies. Preserving dark skies supports these traditions and local wildlife conservation.',
  },
  {
    title: 'Sustainable Development',
    subtitle: 'Economic benefits of dark sky policies',
    image: 'darksky/carousel_(5).jpeg',
    shortDescription:
      'Optimizing public lighting reduces energy costs, allowing funds to be redirected to other community needs. Smart lighting solutions benefit both dark skies and municipal budgets.',
  },
]

// Impact Statistics
const impactStatistics: ImpactStatistic[] = [
  {
    value: '83%',
    description:
      'of the global population lives under light-polluted skies, limiting their view of stars and planets',
  },
  {
    value: '2-6%',
    description:
      'annual increase in light pollution in many regions, especially in developing countries',
  },
  {
    value: '$3.3B',
    description:
      'annual cost of wasted outdoor lighting in the US alone—30% of all outdoor lighting',
  },
  {
    value: '50%',
    description:
      'higher risk of certain health issues linked to nighttime exposure to artificial light',
  },
  {
    value: '70%',
    description:
      'reduction in activity for many nocturnal animals in artificially lit environments',
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
      'Audit your outdoor lighting for unnecessary brightness, upward-pointing fixtures, and light spillover into neighboring properties or the sky.',
    actionText: 'Download Audit Checklist',
    actionUrl: '#',
    icon: 'mdi:clipboard-check',
  },
  {
    title: 'Make Simple Changes',
    description:
      'Install shields on existing lights, switch to warm-colored bulbs under 3000K, add motion sensors, and use timers to reduce hours of operation.',
    actionText: 'View Lighting Guide',
    actionUrl: '#',
    icon: 'mdi:lightbulb',
  },
  {
    title: 'Spread Awareness',
    description:
      'Share information about light pollution with neighbors, local businesses, and community groups to create broader understanding.',
    actionText: 'Get Sharing Tools',
    actionUrl: '#share-section',
    icon: 'mdi:share-variant',
  },
  {
    title: 'Contact Officials',
    description:
      'Advocate for dark sky-friendly lighting ordinances in your community by contacting local representatives and attending planning meetings.',
    actionText: 'Advocacy Resources',
    actionUrl: '#',
    icon: 'mdi:gavel',
  },
  {
    title: 'Join the Movement',
    description:
      'Participate in community dark sky events, citizen science projects, and local initiatives to monitor and reduce light pollution.',
    actionText: 'Find Local Events',
    actionUrl: '#',
    icon: 'mdi:account-group',
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
      :stats="impactStatistics"
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
      <DarkskyEvents
        :conference-text="conferencesText"
        :symposium-text="symposiumsText"
      />

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
