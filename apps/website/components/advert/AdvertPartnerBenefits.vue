<script setup lang="ts">
// Define the benefit item structure
interface BenefitItem {
  id: string
  icon: string
  title: string
  description: string
}

// Data array for partner benefits
const benefits: BenefitItem[] = [
  {
    id: 'targeted-audience',
    icon: 'i-lucide-users',
    title: 'Targeted Audience',
    description:
      'Connect with our community of astronomy enthusiasts actively searching for stargazing experiences, products, and events in India and globally.',
  },
  {
    id: 'premium-visibility',
    icon: 'i-lucide-star',
    title: 'Premium Visibility',
    description:
      'Featured placement on our website and social media platforms for maximum exposure to leads interested in astronomy events and products.',
  },
  {
    id: 'indian-presence',
    icon: 'i-lucide-map-pin',
    title: 'Strong Indian Presence',
    description:
      'Access our established network across major Indian states, including Maharashtra and Ladakh with growing international reach.',
  },
  {
    id: 'growth-partnership',
    icon: 'i-lucide-trending-up',
    title: 'Growth Partnership',
    description:
      'Join us early in our growth journey for special pricing and benefits as we expand our platform and services internationally.',
  },
]
</script>

<template>
  <div class="wrapper py-20">
    <LandingTitle
      title="Why Partner With AstronEra?"
      subtitle="Amplify your reach in the astronomy community"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
      <IBGlass
        v-for="benefit in benefits"
        :key="benefit.id"
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        interactive
        class="p-6"
      >
        <div class="flex flex-col items-center text-center gap-4">
          <Icon
            :name="benefit.icon"
            size="48"
            class="text-primary-400"
          />
          <h3 class="text-xl font-bold">{{ benefit.title }}</h3>
          <p>{{ benefit.description }}</p>
        </div>
      </IBGlass>
    </div>
  </div>
</template>
