<template>
  <div>
    <h3 class="text-center pb-8"> Timeline </h3>
    <PrimeTimeline
      :value="events"
      align="alternate"
      class="customized-timeline"
    >
      <template #marker="slotProps">
        <span
          class="z-10 flex items-center justify-center rounded-full border p-1 text-white"
          :style="{ backgroundColor: slotProps.item.color }"
        >
          <Icon
            class="h-8 w-8"
            :name="`mdi:${slotProps.item.icon}`"
          ></Icon>
        </span>
      </template>
      <template #content="slotProps">
        <div class="border-color border p-4 rounded-lg background">
          <h4 class="text-2xl m-0">
            {{ slotProps.item.status }}
          </h4>
          <p class="text-lg font-bold">
            {{ slotProps.item.date }}
          </p>
          <p class="text-xl">{{ slotProps.item.description }}</p>
        </div>
      </template>
    </PrimeTimeline>
  </div>
</template>

<script setup lang="ts">
const events = ref([
  // Year 1
  {
    status: 'AI Model Upgrades',
    date: 'Q1 2024',
    icon: 'chart-line',
    color: '#9C27B0',
    description:
      'Continuously improve the accuracy and capabilities of our AI models by integrating advanced machine learning techniques and user feedback.'
  },
  {
    status: 'Gamification and Loyalty Programs',
    date: 'Q2 2024',
    icon: 'star',
    color: '#673AB7',
    description:
      'Introduce gamification elements and loyalty programs to enhance user engagement and incentivize frequent usage.'
  },
  {
    status: 'Scalability Enhancements',
    date: 'Q3 2024',
    icon: 'cog',
    color: '#FF9800',
    description:
      'Optimize our cloud infrastructure to handle increased traffic and ensure smooth performance.'
  },
  {
    status: 'Educational Partnerships',
    date: 'Q4 2024',
    icon: 'account-group',
    color: '#607D8B',
    description:
      'Partner with educational institutions to provide exclusive content and promote our platform among students.'
  },
  {
    status: 'Progressive Web App (PWA)',
    date: 'Q4 2024',
    icon: 'cellphone-link',
    color: '#FF5722',
    description:
      'Develop and launch a PWA to provide a seamless mobile experience without the need for native app development.'
  },
  {
    status: 'Data Quality Improvements',
    date: 'Q4 2024',
    icon: 'database',
    color: '#795548',
    description:
      'Focus on sourcing high-quality data, improving data processing, and cleaning mechanisms.'
  },

  // Year 2
  {
    status: 'AI Personalization',
    date: 'Q1 2025',
    icon: 'account',
    color: '#4CAF50',
    description:
      'Develop AI-driven personalization features to provide tailored content and recommendations.'
  },
  {
    status: 'Advanced AI Agents',
    date: 'Q2 2025',
    icon: 'robot',
    color: '#FFC107',
    description:
      'Introduce more sophisticated AI agents capable of handling complex queries and providing in-depth analysis.'
  },
  {
    status: 'Consulting Services',
    date: 'Q3 2025',
    icon: 'briefcase',
    color: '#03A9F4',
    description:
      'Offer consulting services to businesses and educational institutions leveraging our AI and data insights.'
  },
  {
    status: 'Multilingual Support',
    date: 'Q4 2025',
    icon: 'translate',
    color: '#E91E63',
    description: 'Add support for multiple languages to cater to a global audience.'
  },
  {
    status: 'Mobile Application Development',
    date: 'Q4 2025',
    icon: 'cellphone',
    color: '#FF9800',
    description: 'Develop and launch a native mobile application.'
  },

  // Year 3
  {
    status: 'Premium Content Expansion',
    date: 'Q1 2026',
    icon: 'book',
    color: '#9C27B0',
    description:
      'Expand premium content offerings, such as exclusive webinars, research reports, and advanced data insights.'
  },
  {
    status: 'International Partnerships',
    date: 'Q2 2026',
    icon: 'handshake',
    color: '#673AB7',
    description:
      'Form partnerships with international space agencies, educational institutions, and businesses to expand our reach.'
  },

  // Year 4
  {
    status: 'AR and VR Integration',
    date: 'Q1 2027',
    icon: 'vr',
    color: '#FF5722',
    description:
      'Integrate AR and VR technologies to provide immersive learning experiences and interactive content.'
  },
  {
    status: 'IoT Integration',
    date: 'Q2 2027',
    icon: 'cloud',
    color: '#795548',
    description:
      'Leverage Internet of Things (IoT) devices for real-time data collection and analysis.'
  },
  {
    status: 'User-Generated Content Platform',
    date: 'Q3 2027',
    icon: 'pencil',
    color: '#4CAF50',
    description: 'Develop a platform for users to create and share their content.'
  },

  // Year 5
  {
    status: 'Educational and Sustainability Initiatives',
    date: 'Q1 2028',
    icon: 'school',
    color: '#FFC107',
    description:
      'Launch initiatives aimed at promoting space education in underprivileged communities and sustainability projects.'
  },
  {
    status: 'Continuous Improvement Mechanisms',
    date: 'Q2 2028',
    icon: 'refresh',
    color: '#03A9F4',
    description:
      'Establish continuous feedback loops with users and utilize data analytics to improve our services.'
  }
])
</script>

<style scoped>
@media (max-width: 960px) {
  .customized-timeline .p-timeline-event:nth-child(even) {
    flex-direction: row;
  }

  .customized-timeline .p-timeline-event:nth-child(even) .p-timeline-event-content {
    text-align: left;
  }

  .customized-timeline .p-timeline-event-opposite {
    flex: 0;
  }
}
</style>
