<script setup lang="ts">
// Mock data for the calendar (would normally come from an API)
const astronomyEvents = ref([
  {
    id: 1,
    title: 'Lyrid Meteor Shower Peak',
    date: new Date(2025, 3, 22), // April 22, 2025
    category: 'Meteor Shower',
    description:
      'The Lyrids are one of the oldest known meteor showers, with records dating back 2,700 years.',
    time: '22:00 - 04:00',
    visibility: 'Good',
    location: 'Northern Hemisphere',
  },
  {
    id: 2,
    title: 'Full Moon',
    date: new Date(2025, 2, 18), // March 18, 2025
    category: 'Lunar Event',
    description:
      'The Full Worm Moon, marking the time when earthworms begin to emerge from the thawing ground.',
    time: 'All night',
    visibility: 'Excellent',
    location: 'Worldwide',
  },
  {
    id: 3,
    title: 'Spring Equinox',
    date: new Date(2025, 2, 20), // March 20, 2025
    category: 'Solar Event',
    description:
      'The March equinox occurs when the Sun crosses the celestial equator, marking the beginning of spring in the Northern Hemisphere.',
    time: '21:33 UTC',
    visibility: 'N/A',
    location: 'Global',
  },
  {
    id: 4,
    title: 'Mercury at Greatest Eastern Elongation',
    date: new Date(2025, 2, 24), // March 24, 2025
    category: 'Planetary Event',
    description:
      'Mercury reaches its greatest eastern elongation, making it visible in the evening sky shortly after sunset.',
    time: 'After sunset',
    visibility: 'Moderate',
    location: 'Look west after sunset',
  },
  {
    id: 5,
    title: 'Jupiter-Venus Conjunction',
    date: new Date(2025, 2, 15), // March 15, 2025
    category: 'Planetary Event',
    description: 'Jupiter and Venus will appear extremely close together in the night sky.',
    time: 'Evening',
    visibility: 'Excellent',
    location: 'Western sky after sunset',
  },
  {
    id: 6,
    title: 'Telescope Workshop',
    date: new Date(2025, 2, 8), // March 8, 2025
    category: 'Event by Astronera',
    description: 'Learn how to set up and use a telescope properly with AstronEra experts.',
    time: '19:00 - 21:00',
    visibility: 'N/A',
    location: 'AstronEra HQ, Pune',
  },
  {
    id: 7,
    title: 'Partial Solar Eclipse',
    date: new Date(2025, 2, 29), // March 29, 2025
    category: 'Eclipse',
    description: 'A partial solar eclipse occurs when the Moon covers only a part of the Sun.',
    time: '09:00 - 12:00',
    visibility: 'Good (with proper equipment)',
    location: 'Parts of North America',
  },
])

// Category definitions
const eventCategories = [
  { name: 'Lunar Event', icon: 'mdi:moon-waning-crescent', color: 'gray', colorIntensity: '500' },
  { name: 'Meteor Shower', icon: 'mdi:meteor', color: 'red', colorIntensity: '400' },
  { name: 'Solar Event', icon: 'mdi:white-balance-sunny', color: 'yellow', colorIntensity: '500' },
  { name: 'Planetary Event', icon: 'mdi:planet', color: 'purple', colorIntensity: '500' },
  { name: 'Eclipse', icon: 'mdi:moon-new', color: 'indigo', colorIntensity: '500' },
  { name: 'Event by Astronera', icon: 'mdi:event-heart', color: 'blue', colorIntensity: '400' },
]
</script>

<template>
  <div class="min-h-screen  text-white py-8">
    <!-- Main Content -->
    <div class="wrapper mx-auto">
      <!-- Calendar Component -->
      <EventCalendar
        :events="astronomyEvents"
        :categories="eventCategories"
      />
    </div>
  </div>
</template>
