<!-- components/SpaceNewsDashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">Space Tech Daily</h1>
          <div class="flex items-center text-sm text-gray-400">
            <Icon
              name="mdi:calendar"
              class="w-4 h-4 mr-1"
            />
            Saturday, January 11, 2025
          </div>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <Icon
              name="mdi:weather-sunny"
              class="w-4 h-4 text-yellow-500"
            />
            <span>Solar Activity: Moderate</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon
              name="mdi:earth"
              class="w-4 h-4 text-blue-500"
            />
            <span>Active Missions: 18</span>
          </div>
        </div>
      </div>

      <!-- Category Bar -->
      <div class="flex justify-between items-center">
        <div class="flex gap-2">
          <PrimeButton
            v-for="cat in categories"
            :key="cat.name"
            :class="[cat.name === 'All' ? 'bg-blue-600' : 'bg-gray-800', 'text-sm']"
          >
            {{ cat.name }}
            <PrimeBadge
              :value="cat.count"
              class="ml-2 bg-gray-700"
            />
          </PrimeButton>
        </div>

        <div class="flex gap-2">
          <PrimeButton class="p-button-outlined">
            <Icon
              name="mdi:magnify"
              class="w-4 h-4"
            />
          </PrimeButton>
          <PrimeButton class="p-button-outlined">
            <Icon
              name="mdi:filter-variant"
              class="w-4 h-4"
            />
          </PrimeButton>
          <PrimeButton class="p-button-outlined">
            <Icon
              name="mdi:bookmark-outline"
              class="w-4 h-4"
            />
          </PrimeButton>
        </div>
      </div>
    </div>

    <!-- Trending Topics -->
    <PrimeCard class="mb-6 bg-gray-800 border-gray-700">
      <template #content>
        <div class="flex items-center gap-6">
          <span class="font-semibold text-sm">Trending Topics:</span>
          <div
            v-for="topic in trendingTopics"
            :key="topic.topic"
            class="flex items-center gap-2"
          >
            <span class="text-sm font-medium">{{ topic.topic }}</span>
            <PrimeBadge
              :value="topic.trend"
              class="bg-blue-900 text-blue-200"
            />
          </div>
        </div>
      </template>
    </PrimeCard>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-4 gap-6">
      <!-- News Timeline -->
      <div class="col-span-3 space-y-8">
        <div
          v-for="(block, blockIdx) in timeBlocks"
          :key="blockIdx"
          class="relative"
        >
          <!-- Time Marker -->
          <div class="flex items-center gap-2 mb-3">
            <div class="h-2 w-2 rounded-full bg-blue-500"></div>
            <span class="text-sm font-medium text-gray-400">{{ block.time }}</span>
          </div>

          <!-- News Cards -->
          <div class="space-y-3">
            <PrimeCard
              v-for="(event, eventIdx) in block.events"
              :key="eventIdx"
              class="bg-gray-800 border-l-4 hover:bg-gray-750 transition-colors cursor-pointer"
              :class="event.impact === 'high' ? 'border-l-blue-500' : 'border-l-gray-700'"
            >
              <template #content>
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-grow">
                    <h3 class="font-medium mb-2">{{ event.title }}</h3>
                    <p class="text-sm text-gray-400 mb-3">{{ event.summary }}</p>
                    <div class="flex items-center gap-3">
                      <PrimeBadge
                        :value="event.category"
                        class="bg-gray-700"
                      />
                      <PrimeBadge
                        :value="event.region"
                        :class="getRegionColor(event.region)"
                      />
                      <span class="text-xs text-gray-500">{{ event.source }}</span>
                    </div>
                  </div>
                  <Icon
                    name="mdi:arrow-top-right"
                    class="w-4 h-4 text-gray-600"
                  />
                </div>
              </template>
            </PrimeCard>
          </div>

          <!-- Timeline Connector -->
          <div
            v-if="blockIdx < timeBlocks.length - 1"
            class="absolute left-1 top-6 w-0.5 h-12 bg-gray-700"
          ></div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Coming Up -->
        <PrimeCard class="bg-gray-800 border-gray-700">
          <template #content>
            <h2 class="font-semibold mb-3">Coming Up</h2>
            <div class="space-y-3">
              <div
                v-for="(event, idx) in upcomingEvents"
                :key="idx"
              >
                <div class="font-medium">{{ event.title }}</div>
                <div class="text-sm text-gray-400"> {{ event.time }} • {{ event.location }} </div>
              </div>
            </div>
          </template>
        </PrimeCard>

        <!-- At a Glance -->
        <PrimeCard class="bg-gray-800 border-gray-700">
          <template #content>
            <h2 class="font-semibold mb-3">At a Glance</h2>
            <div class="space-y-3">
              <div
                v-for="(stat, idx) in stats"
                :key="idx"
                class="flex justify-between items-center"
              >
                <span class="text-gray-400">{{ stat.label }}</span>
                <span class="font-medium">{{ stat.value }}</span>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { name: 'All', count: 24 },
  { name: 'Research', count: 8 },
  { name: 'Launches', count: 3 },
  { name: 'Operations', count: 6 },
  { name: 'Announcements', count: 7 },
]

const trendingTopics = [
  { topic: 'JWST Discoveries', trend: '+120%' },
  { topic: 'SpaceX Raptor', trend: '+80%' },
  { topic: 'Lunar Mining', trend: '+45%' },
]

const timeBlocks = [
  {
    time: 'Last 6 hours',
    events: [
      {
        title: 'JWST Discovers Unexpected Structures in Distant Galaxy',
        category: 'Research',
        source: 'Nature',
        summary:
          'Early observations reveal complex formations previously unseen at this distance...',
        region: 'Global',
        impact: 'high',
      },
      {
        title: 'SpaceX Completes Static Fire Test',
        category: 'Operations',
        source: 'Space News',
        summary: 'Successful test of Raptor engines paves way for orbital flight...',
        region: 'NA',
        impact: 'medium',
      },
    ],
  },
  {
    time: '6-12 hours ago',
    events: [
      {
        title: 'ESA-NASA Announce Joint Mission Plans',
        category: 'Announcements',
        source: 'ESA Press',
        summary: 'New collaboration targets advanced planetary defense systems...',
        region: 'EU',
        impact: 'high',
      },
    ],
  },
]

const upcomingEvents = [
  {
    title: 'ISS Visible Pass',
    time: 'Next 6 hours',
    location: 'Northern Hemisphere',
  },
  {
    title: 'Meteor Shower Peak',
    time: 'Tomorrow',
    location: 'Global',
  },
]

const stats = [
  { label: 'Active Spacecraft', value: '242' },
  { label: 'Planned Launches', value: '5' },
  { label: 'Ongoing Missions', value: '18' },
]

const getRegionColor = (region) => {
  const colors = {
    NA: 'bg-blue-900 text-blue-200',
    EU: 'bg-yellow-900 text-yellow-200',
    AS: 'bg-red-900 text-red-200',
    Global: 'bg-green-900 text-green-200',
  }
  return colors[region] || 'bg-gray-900 text-gray-200'
}
</script>
