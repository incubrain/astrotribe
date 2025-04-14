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
const missionAstronomy =
  'To safeguard the night sky by reducing light pollution in urban areas, conserving dark skies in pristine regions, and promoting sustainable lighting practices that support biodiversity, human well-being, and energy efficiency, advancing sustainable development goals through dark sky preservation.'

const darkSkyObjectives = [
  'Educate communities on light pollution’s effects on ecosystems, health, and celestial visibility.',
  'Push for policies that integrate dark sky-friendly lighting into sustainable development frameworks.',
  'Reconnect people with the starry sky, fostering appreciation for nature’s role in achieving global sustainability targets.',
]
// Mascot section text
const mascotStory = [
  "Hi, I'm Tara the Firefly—your quirky little mascot for saving the dark skies! As a firefly, I shine brightest when the night is dark and calm.",
  "But with harsh artificial lights, not only are stars disappearing, but it's confusing creatures like me, disturbing humans' sleep, and affecting health!",
  "Protecting the night sky isn't just for stargazing—it's about keeping our planet in balance. I'm thrilled to see experts and policymakers joining forces to bring back the beauty of the night for everyone!",
]

const lightPollutionActions = [
  {
    title: 'Shield Your Lights',
    description: 'Direct light downward to prevent sky glow while maintaining safety',
    icon: 'i-lucide-shield',
    impactLevel: 5, // Highest impact
    timeCategory: 'moderate', // 5-minute action
    primaryAction: {
      text: 'Find Shielded Fixtures',
      url: '/resources/shielded-fixtures',
    },
    benefits: ['Reduce light pollution by up to 70%', 'Lower your energy bills by ₹2,000/year'],
    details: [
      'Use fully-shielded fixtures that direct light downward',
      'Cover bare bulbs to prevent light from shining upward',
      'Install motion sensors for security lighting',
    ],
    resources: [
      {
        title: 'Shielded Fixture Guide',
        url: '/guides/shielded-fixtures',
      },
      {
        title: 'Energy Saving Calculator',
        url: '/tools/energy-calculator',
      },
    ],
  },
  {
    title: 'Use Warm-Colored Bulbs',
    description: 'Switch to bulbs under 3000K to reduce harmful blue light',
    icon: 'i-lucide-lightbulb',
    impactLevel: 4,
    timeCategory: 'quick', // 1-minute action
    primaryAction: {
      text: 'Find Recommended Bulbs',
      url: '/resources/warm-bulbs',
    },
    benefits: [
      'Improve sleep quality by reducing blue light',
      'Better for wildlife and ecosystem health',
    ],
    details: [
      'Choose warm-colored bulbs (under 3000K)',
      'Replace cool white LEDs with warm alternatives',
      "Look for bulbs labeled 'warm white' or 'soft white'",
    ],
    resources: [
      {
        title: 'Bulb Color Temperature Guide',
        url: '/guides/color-temperature',
      },
      {
        title: 'Health Effects of Blue Light',
        url: '/research/blue-light',
      },
    ],
  },
  {
    title: 'Install Timers & Sensors',
    description: 'Automate lights to run only when needed',
    icon: 'i-lucide-timer',
    impactLevel: 4,
    timeCategory: 'project', // Weekend project
    primaryAction: {
      text: 'Shop Smart Controls',
      url: '/resources/smart-controls',
    },
    benefits: ['Cut energy costs by up to 40%', 'Reduce carbon emissions by 250kg/year'],
    details: [
      'Install timers to turn off lights when not needed',
      'Use motion sensors for walkways and security',
      'Set up smart controls to manage outdoor lighting',
    ],
    resources: [
      {
        title: 'DIY Timer Installation Guide',
        url: '/guides/timer-installation',
      },
      {
        title: 'Smart Home Integration',
        url: '/guides/smart-lighting',
      },
    ],
  },
  {
    title: 'Reduce Brightness',
    description: 'Use only as much light as actually needed',
    icon: 'i-lucide-sun-dim',
    impactLevel: 3,
    timeCategory: 'quick', // 1-minute action
    primaryAction: {
      text: 'Brightness Guidelines',
      url: '/resources/brightness',
    },
    benefits: [
      'Save up to ₹1,200 annually on energy bills',
      'Improve visibility by reducing glare',
    ],
    details: [
      "Use dimmers to lower brightness when full power isn't needed",
      'Choose lower-wattage bulbs for ambient lighting',
      'Layer lighting instead of using single bright sources',
    ],
    resources: [
      {
        title: 'Proper Lighting Levels Guide',
        url: '/guides/lighting-levels',
      },
      {
        title: 'Energy-Efficient Lighting Tips',
        url: '/guides/efficiency',
      },
    ],
  },
  {
    title: 'Advocate Locally',
    description: 'Support dark-sky friendly lighting policies in your community',
    icon: 'i-lucide-megaphone',
    impactLevel: 5, // Highest impact
    timeCategory: 'project', // Weekend project
    primaryAction: {
      text: 'Get Advocacy Toolkit',
      url: '/resources/advocacy',
    },
    benefits: [
      'Multiply your impact across entire neighborhoods',
      'Create sustainable change in your community',
    ],
    details: [
      'Attend city council meetings to advocate for better lighting',
      'Share educational materials with neighbors',
      'Support ordinances that require shielded fixtures',
    ],
    resources: [
      {
        title: 'Sample Lighting Ordinance',
        url: '/guides/ordinance-template',
      },
      {
        title: 'Community Organizing Guide',
        url: '/guides/community-action',
      },
    ],
  },
  {
    title: 'Audit Your Property',
    description: 'Identify problem fixtures and create an improvement plan',
    icon: 'i-lucide-clipboard-check',
    impactLevel: 3,
    timeCategory: 'moderate', // 5-minute action
    primaryAction: {
      text: 'Download Audit Checklist',
      url: '/resources/audit-checklist',
    },
    benefits: ['Target improvements for maximum impact', 'Create a budget-friendly lighting plan'],
    details: [
      'Document all outdoor lighting fixtures on your property',
      'Check for light trespass onto neighboring properties',
      'Identify fixtures that shine light upward or cause glare',
    ],
    resources: [
      {
        title: 'DIY Light Audit App',
        url: '/tools/light-audit',
      },
      {
        title: 'Prioritizing Lighting Improvements',
        url: '/guides/improvement-priority',
      },
    ],
  },
]

const actionSteps = [
  {
    title: 'Assess Your Home',
    description:
      'Audit your outdoor lighting to identify unnecessary brightness, upward-pointing fixtures, and light spillover, especially in urban areas like Mumbai where light pollution is rising rapidly.',
    icon: 'mdi:clipboard-check',
    tips: [
      'Document all outdoor lighting fixtures around your property',
      'Check for light trespass onto neighboring properties',
      'Identify fixtures that shine light upward or outward',
      'Note any lights that remain on all night unnecessarily',
    ],
    actionText: 'Download Audit Checklist',
    actionUrl: 'https://darksky.org/get-involved/home-lighting-assessment/',
    resources: [
      {
        title: 'DarkSky International Home Lighting Assessment',
        url: 'https://darksky.org/get-involved/home-lighting-assessment/',
      },
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
    title: 'Shield Your Lights',
    description:
      'Direct light downward to prevent unnecessary sky glow and light trespass while still maintaining safety and visibility.',
    icon: 'mdi:shield',
    tips: [
      'Use fully-shielded fixtures that direct light downward',
      'Cover bare bulbs to prevent light from shining upward',
      'Install motion sensors for security lighting',
      'Adjust existing fixtures with shields or hoods',
    ],
    actionText: 'Find Shielded Fixtures',
    actionUrl:
      'https://darksky.org/what-we-do/darksky-approved/darksky-approved-luminaires-program/luminaires/',
    resources: [
      {
        title: 'DarkSky Approved Fixtures',
        url: 'https://darksky.org/what-we-do/darksky-approved/darksky-approved-luminaires-program/luminaires/',
      },
    ],
  },
  {
    title: 'Use the Right Lights',
    description:
      'Shield your lights, use warm-colored bulbs under 3000K, and install motion sensors or timers to cut down on light pollution, saving up to $800 million annually in India.',
    icon: 'mdi:lightbulb',
    tips: [
      'Choose warm-colored bulbs (under 3000K)',
      'Use the minimum brightness necessary',
      'Replace cool white LEDs with warm alternatives',
      'Select dark-sky friendly fixtures for outdoor lighting',
    ],
    actionText: 'View Lighting Guide',
    actionUrl: 'https://darksky.org/resources/guides-and-how-tos/lighting-principles/',
    resources: [
      {
        title: 'DarkSky Lighting Principles',
        url: 'https://darksky.org/resources/guides-and-how-tos/lighting-principles/',
      },
      {
        title: 'DarkSky Approved Lighting Products',
        url: 'https://darksky.org/what-we-do/darksky-approved/darksky-approved-luminaires-program/luminaires/',
      },
      {
        title: 'Bureau of Energy Efficiency India',
        url: 'https://beeindia.gov.in/',
      },
    ],
  },
  {
    title: 'Control When Lights Are On',
    description:
      "Use automation to ensure lights are only on when and where they're needed, reducing energy costs and light pollution.",
    icon: 'mdi:clock',
    tips: [
      'Install timers to turn off lights when not needed',
      'Use motion sensors for security and walkway lighting',
      'Turn off decorative lighting after business hours',
      'Advocate for smart lighting systems in your community',
    ],
    actionText: 'Timing Solutions',
    actionUrl: 'https://darksky.org/our-work/lighting/lighting-for-citizens/lighting-basics/',
    resources: [
      {
        title: 'Energy Saving Calculator',
        url: 'https://www.energystar.gov/products/lighting_fans/light_bulbs/led_lighting',
      },
    ],
  },
  {
    title: 'Spread Awareness',
    description:
      "Educate your community about light pollution's impact—80% of India's population can't see the stars—using films and events like Earth Hour India.",
    icon: 'mdi:share-variant',
    tips: [
      'Share educational content on social media',
      'Organize community stargazing events',
      'Talk to neighbors about light pollution impacts',
      'Participate in International Dark Sky Week events',
    ],
    actionText: 'Get Sharing Tools',
    actionUrl: 'https://vimeo.com/178841667',
    resources: [
      {
        title: 'Sriram Murali\'s "Lost in Light" Film',
        url: 'https://vimeo.com/178841667',
      },
      {
        title: 'Earth Hour India',
        url: 'https://www.earthhour.org/india',
      },
      {
        title: 'DarkSky Social Media',
        url: 'https://www.facebook.com/DarkSkyInternational',
      },
    ],
  },
  {
    title: 'Contact Officials',
    description:
      "Push for dark sky-friendly ordinances in your city, inspired by Mumbai's public interest litigation, to reduce the 7-10% annual increase in light pollution.",
    icon: 'mdi:gavel',
    tips: [
      'Write to your local representatives about light pollution',
      'Attend city council meetings to advocate for better lighting',
      'Share model lighting ordinances with officials',
      'Form a community group to strengthen your advocacy',
    ],
    actionText: 'Advocacy Resources',
    actionUrl: 'https://darksky.org/what-we-do/advocacy/',
    resources: [
      {
        title: 'DarkSky Advocacy Guide',
        url: 'https://darksky.org/what-we-do/advocacy/',
      },
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
  // {
  //   title: 'Join the Movement',
  //   description:
  //     'Get involved in events like Hanle Dark Sky Reserve star parties or citizen science projects to protect nocturnal animals facing a 70% activity reduction.',
  //   icon: 'mdi:account-group',
  //   tips: [
  //     'Participate in citizen science light pollution monitoring',
  //     'Attend dark sky reserve events and star parties',
  //     'Join or start a local astronomy club',
  //     'Volunteer for dark sky conservation projects',
  //   ],
  //   actionText: 'Find Local Events',
  //   actionUrl: 'https://ladakh.gov.in/hanle-dark-sky-reserve-celebrates-its-first-star-party/',
  //   resources: [
  //     {
  //       title: 'Hanle Dark Sky Reserve Star Parties',
  //       url: 'https://ladakh.gov.in/hanle-dark-sky-reserve-celebrates-its-first-star-party/',
  //     },
  //     {
  //       title: 'Globe at Night Citizen Science',
  //       url: 'https://www.globeatnight.org/',
  //     },
  //     {
  //       title: 'Astronomy Clubs in India',
  //       url: 'https://www.go-astronomy.com/astronomy-clubs-global.php?Country=India',
  //     },
  //   ],
  // },
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
const darkSkyInfoCards = [
  {
    title: 'What exactly is light pollution?',
    content:
      'Light pollution is excessive, misdirected, or obtrusive artificial light produced by human activities. This includes sky glow, light trespass, glare, and clutter that disrupt ecosystems and obscure our view of the stars.',
    blogSlug: 'what-is-light-pollution',
    icon: 'mdi:lightbulb-question-outline',
  },
  {
    title: 'How does light pollution affect wildlife?',
    content:
      'Artificial light at night disrupts natural behaviors and biological processes for many species. Nocturnal animals may reduce their activity, while diurnal animals might remain active during nighttime hours when they should be resting.',
    blogSlug: 'light-pollution-and-wildlife',
    icon: 'mdi:nature-people',
  },
  {
    title: 'How does light pollution affect human health?',
    content:
      'Light pollution disrupts our circadian rhythms, leading to sleep disorders, increased stress, and other health issues. It can also affect mental health and well-being by reducing our connection to nature.',
    blogSlug: 'light-pollution-and-human-health',
    icon: 'mdi:shield-moon',
  },
  {
    title: 'How can I reduce light pollution in my area?',
    content:
      'You can reduce light pollution by using shielded fixtures, choosing warm-colored bulbs, installing timers and sensors, and advocating for better lighting policies in your community.',
    blogSlug: 'why-care-about-dark-skies',
    icon: 'mdi:star-outline',
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
  '#SaveTheNightSky',
  '#StargazingForAll',
  '#DarkSkyIndia',
  '#BringBackTheStars',
  '#RightToNight',
  '#UniteForTheNight',
  '#ProtectTheNight',
  '#DimTheLights',
  '#SwitchOffForStars',
  '#LostInLight',

  // 🌠 Community & Action
  '#TaraForAll',
  '#UniteForTara',
  '#StandWithTara',
  '#ShineWithTara',
  '#AwaazForTara',
  '#DesiSkyDefenders',
  '#NightSkySatyagraha',
  '#BharatKeTara',

  // 🇮🇳 India-centric & Cultural
  '#IndiaUnderStars',
  '#SkyHeritageIndia',
  '#TaareAurTara',

  // 💡 Brand + Movement
  '#AstronEra',
  '#AstronEraForTara',
  '#TeamTara',
  '#FollowTara',
]

// Events section text
const conferencesText =
  'Uniting experts and enthusiasts to reclaim the night—because preserving dark skies means protecting life, science, and wonder. Take a look at our past and upcoming conferences!'

const symposiumsText =
  'We host a collaborative platform shaping policies for a starlit future—where innovation meets sustainability to combat light pollution. Explore our past and upcoming symposiums!'

// CTA section text
const ctaText =
  'Join us in the fight against light pollution and help preserve our night skies for future generations.'

useHead({
  title: 'Dark Sky Preservation',
  meta: [
    {
      name: 'description',
      content:
        'Join us in the fight against light pollution and help preserve our night skies for future generations.',
    },
    {
      property: 'og:title',
      content: 'Dark Sky Preservation',
    },
    {
      property: 'og:description',
      content:
        'Join us in the fight against light pollution and help preserve our night skies for future generations.',
    },
  ],
  script: [
    {
      src: 'https://player.vimeo.com/api/player.js',
      async: true,
      defer: true,
    },
  ],
})
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
        :astronomy-mission="missionAstronomy"
        :dark-sky-objectives="darkSkyObjectives"
      />

      <!-- Mascot Section -->
      <DarkskyMascot
        :title="{
          main: 'Tara the Firefly',
          subtitle: 'Your quirky little mascot for saving the dark skies!',
        }"
        comic-image="images/tara/tara-comic-introduction.jpg"
        button-text="KNOW MY STORY"
      />

      <!-- <DarkskySimulator /> -->

      <!-- Action Steps Section -->
      <DarkskyActionSteps
        title="Fight Light Pollution"
        subtitle="Simple, high-impact steps to protect our night skies"
        :autoplay-delay="8000"
        :steps="lightPollutionActions"
        :helpful-resources="helpfulResources"
      />

      <!-- FAQ Section -->
      <DarkskyLearnMore :cards="darkSkyInfoCards" />

      <!-- Events Section -->
      <!-- <DarkskyEvents
        :conference-text="conferencesText"
        :symposium-text="symposiumsText"
      /> -->

      <!-- Social Sharing Section -->
      <DarkskyShare
        :platforms="sharePlatforms"
        :tags="shareTags.slice(0, 9)"
        page-url="https://astronera.org/darksky"
      />

      <DarkskyPledge />
    </div>
  </div>
</template>
