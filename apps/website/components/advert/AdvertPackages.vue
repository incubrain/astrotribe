<script setup lang="ts">
import { ref, computed } from 'vue'

// Define the profile types and active tab
const profileTypes = [
  { id: 'space-tech', label: 'Space-Tech Companies' },
  { id: 'institution', label: 'Institutions' },
  { id: 'events', label: 'Events/Workshops' },
  { id: 'researcher', label: 'Researchers' },
]
const activeProfile = ref('space-tech')

// Define the feature item structure
interface FeatureItem {
  icon: string
  text: string
  highlight?: string
}

// Define the package structure
interface Package {
  id: string
  title: string
  price: string
  description: string
  features: FeatureItem[]
}

// Define all packages data
const profilePackages = {
  'space-tech': [
    {
      id: 'standard',
      title: 'Standard Visibility',
      price: '₹10,000',
      description:
        'Perfect for space technology startups looking to reach space, astronomy enthusiasts, and early adopters.',
      features: [
        {
          icon: 'i-lucide-users',
          text: ' across our platform',
          highlight: '5,000 guaranteed impressions',
        },
        {
          icon: 'i-lucide-file-text',
          text: 'Featured article about your technology on our blog',
        },
        {
          icon: 'i-lucide-share-2',
          text: '3 dedicated posts across Instagram, LinkedIn, and Twitter',
        },
        {
          icon: 'i-lucide-message-circle',
          text: '1 WhatsApp broadcast to our curated community',
        },
      ],
    },
    {
      id: 'premium',
      title: 'Premium Exposure',
      price: '₹25,000',
      description:
        'Comprehensive promotion for established space-tech companies looking for maximum visibility.',
      features: [
        {
          icon: 'i-lucide-users',
          text: ' across our platform',
          highlight: '15,000 guaranteed impressions',
        },
        {
          icon: 'i-lucide-file-text',
          text: 'In-depth feature article with interview on our blog',
        },
        {
          icon: 'i-lucide-share-2',
          text: '8 dedicated posts across all social platforms',
        },
        {
          icon: 'i-lucide-video',
          text: 'Promotional video about your technology',
        },
        {
          icon: 'i-lucide-mail',
          text: 'Dedicated email campaign to our subscribers',
        },
        {
          icon: 'i-lucide-message-circle',
          text: '3 WhatsApp broadcasts to our curated community',
        },
      ],
    },
  ],
  'institution': [
    {
      id: 'standard',
      title: 'Club Visibility',
      price: '₹10,000',
      description:
        'Perfect for astronomy clubs looking to increase membership and promote stargazing events.',
      features: [
        {
          icon: 'i-lucide-users',
          text: ' across our platform',
          highlight: '5,000 guaranteed impressions',
        },
        {
          icon: 'i-lucide-file-text',
          text: 'Featured article about your club and activities',
        },
        {
          icon: 'i-lucide-share-2',
          text: 'Promotion of up to 3 events on our social media',
        },
        {
          icon: 'i-lucide-message-circle',
          text: 'WhatsApp broadcast to local astronomy enthusiasts',
        },
      ],
    },
    {
      id: 'premium',
      title: 'Premium Club Package',
      price: '₹20,000',
      description:
        'Comprehensive promotion for established astronomy clubs looking to significantly expand reach.',
      features: [
        {
          icon: 'i-lucide-users',
          text: ' across our platform',
          highlight: '12,000 guaranteed impressions',
        },
        {
          icon: 'i-lucide-file-text',
          text: "Feature article series showcasing your club's activities",
        },
        {
          icon: 'i-lucide-share-2',
          text: 'Promotion of unlimited events on our social media',
        },
        {
          icon: 'i-lucide-video',
          text: 'Professional video about your club and stargazing activities',
        },
        {
          icon: 'i-lucide-mail',
          text: '2 dedicated email campaigns to our subscribers',
        },
        {
          icon: 'i-lucide-calendar',
          text: 'Listing in our "Featured Astronomy Clubs" directory',
        },
      ],
    },
  ],
  'events': [
    {
      id: 'standard',
      title: 'Event Promotion',
      price: '₹10,000',
      description:
        'Ideal for workshops, talks, and astronomy events looking to increase attendance.',
      features: [
        {
          icon: 'i-lucide-users',
          text: ' to astronomy enthusiasts',
          highlight: '5,000 guaranteed impressions',
        },
        {
          icon: 'i-lucide-calendar',
          text: 'Featured listing in our events calendar',
        },
        {
          icon: 'i-lucide-share-2',
          text: '3 dedicated posts across all our social media',
        },
        {
          icon: 'i-lucide-message-circle',
          text: 'WhatsApp broadcast to local astronomy enthusiasts',
        },
      ],
    },
    {
      id: 'premium',
      title: 'Premium Event Package',
      price: '₹20,000',
      description:
        'Comprehensive promotion for major astronomy events, conferences, and workshop series.',
      features: [
        {
          icon: 'i-lucide-users',
          text: ' across our platform',
          highlight: '12,000 guaranteed impressions',
        },
        {
          icon: 'i-lucide-file-text',
          text: 'Featured article about your event with speaker highlights',
        },
        {
          icon: 'i-lucide-share-2',
          text: '6 dedicated posts across all social platforms',
        },
        {
          icon: 'i-lucide-video',
          text: 'Promotional video for your event',
        },
        {
          icon: 'i-lucide-mail',
          text: 'Dedicated email campaign to our subscribers',
        },
        {
          icon: 'i-lucide-heart',
          text: 'AstronEra representative attendance (if applicable)',
        },
      ],
    },
  ],
  'researcher': [
    {
      id: 'standard',
      title: 'Research Visibility',
      price: '₹10,000',
      description:
        'Perfect for researchers looking to share findings and connect with citizen scientists.',
      features: [
        {
          icon: 'i-lucide-users',
          text: ' to astronomy enthusiasts',
          highlight: '5,000 guaranteed impressions',
        },
        {
          icon: 'i-lucide-file-text',
          text: 'Feature article about your research work',
        },
        {
          icon: 'i-lucide-share-2',
          text: '3 dedicated posts across our social media',
        },
        {
          icon: 'i-lucide-users',
          text: 'Citizen science participant recruitment',
        },
      ],
    },
    {
      id: 'premium',
      title: 'Premium Research Package',
      price: '₹20,000',
      description:
        'Comprehensive promotion for significant research projects and scientific initiatives.',
      features: [
        {
          icon: 'i-lucide-users',
          text: ' across our platform',
          highlight: '12,000 guaranteed impressions',
        },
        {
          icon: 'i-lucide-file-text',
          text: 'In-depth article series about your research',
        },
        {
          icon: 'i-lucide-video',
          text: 'Explainer video about your research findings',
        },
        {
          icon: 'i-lucide-mail',
          text: 'Dedicated email to our community highlighting your work',
        },
        {
          icon: 'i-lucide-users',
          text: 'Targeted citizen science participant recruitment',
        },
        {
          icon: 'i-lucide-zap',
          text: 'Virtual presentation opportunity to our community',
        },
      ],
    },
  ],
}

// Computed property to get active profile packages
const activePackages = computed(() => {
  return profilePackages[activeProfile.value as keyof typeof profilePackages] || []
})

const scrollToContact = () => {
  const contactElement = document.getElementById('contact-form')
  if (contactElement) {
    contactElement.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="wrapper py-20">
    <LandingTitle
      title="Boost Your Brand with AstronEra"
      subtitle="Let's help each other grow!"
    />

    <!-- Profile selection tabs -->
    <div class="flex flex-wrap justify-center gap-4 mb-12">
      <PrimeButton
        v-for="profile in profileTypes"
        :key="profile.id"
        :class="[
          'px-4 py-2 rounded-full',
          activeProfile === profile.id
            ? 'bg-primary-600'
            : 'bg-primary-900/50 hover:bg-primary-800/50',
        ]"
        @click="activeProfile = profile.id"
      >
        {{ profile.label }}
      </PrimeButton>
    </div>

    <!-- Package Cards - Using computed property -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <IBGlass
        v-for="pkg in activePackages"
        :key="`${activeProfile}-${pkg.id}`"
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="medium"
        interactive
        class="p-8"
      >
        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold mb-2">{{ pkg.title }}</h2>
          <p class="text-xl font-bold text-primary-400">{{ pkg.price }}</p>
          <p class="text-sm text-primary-300 mt-1">One-time payment</p>
        </div>

        <p class="mb-6">{{ pkg.description }}</p>

        <div class="space-y-3 mb-6">
          <div
            v-for="(feature, index) in pkg.features"
            :key="`feature-${index}`"
            class="flex items-start gap-3"
          >
            <Icon
              :name="feature.icon"
              size="24"
              class="text-primary-400 flex-shrink-0"
            />
            <div>
              <p>
                <span
                  v-if="feature.highlight"
                  class="font-semibold"
                  >{{ feature.highlight }}</span
                >{{ feature.text }}
              </p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <PrimeButton
            class="bg-primary-600 hover:bg-primary-700 px-6 py-3"
            @click="scrollToContact"
          >
            Get Started
          </PrimeButton>
        </div>
      </IBGlass>
    </div>
  </div>
</template>
