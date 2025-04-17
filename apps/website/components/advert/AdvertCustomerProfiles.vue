<script setup lang="ts">
// Define the customer profile data structure
interface CustomerProfile {
  id: string
  title: string
  icon: string
  benefits: string[]
}

// Data array for customer profiles
const customerProfiles: CustomerProfile[] = [
  {
    id: 'space-tech',
    title: 'Space-Tech Orgs',
    icon: 'i-lucide-rocket',
    benefits: [
      'Reach early adopters of space technology',
      'Connect with potential investors and partners',
      'Showcase products to enthusiastic audience',
      'Build brand reputation in the space industry',
    ],
  },
  {
    id: 'institutions',
    title: 'Institutions',
    icon: 'i-lucide-building',
    benefits: [
      'Enhance astronomy and STEM curriculum',
      'Collaborate on educational initiatives and research',
      'Host expert-led sessions and skywatching nights',
      'Access teaching resources and outreach tools',
    ],
  },
  {
    id: 'events',
    title: 'Events / Workshops',
    icon: 'i-lucide-calendar',
    benefits: [
      'Fill your astronomy events and workshops',
      'Reach attendees interested in your specific topics',
      'Promote special astronomical occasions',
      'Increase engagement for virtual events',
    ],
  },
  {
    id: 'researcher',
    title: 'Researcher',
    icon: 'i-lucide-microscope',
    benefits: [
      'Share your astronomy research findings',
      'Find citizen science participants',
      'Connect with potential research collaborators',
      'Build public support for astronomy projects',
    ],
  },
]
</script>

<template>
  <div class="bg-primary-950 py-20">
    <div class="wrapper">
      <LandingTitle
        title="Let's Grow Together"
        subtitle="Are we a perfect match?"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        <!-- Loop through customer profiles -->
        <IBGlass
          v-for="profile in customerProfiles"
          :key="profile.id"
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="medium"
          class="p-6"
        >
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center gap-4">
              <div class="bg-primary-800/50 p-3 rounded-full flex">
                <Icon
                  :name="profile.icon"
                  size="24"
                  class="text-primary-400"
                />
              </div>
              <h3 class="text-lg font-bold">{{ profile.title }}</h3>
            </div>

            <ul class="space-y-2 text-primary-200">
              <li
                v-for="(benefit, index) in profile.benefits"
                :key="index"
                class="flex items-start gap-2"
              >
                <Icon
                  name="i-lucide-check"
                  class="text-primary-400 mt-1 flex-shrink-0"
                />
                <span>{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </IBGlass>
      </div>
    </div>
  </div>
</template>
