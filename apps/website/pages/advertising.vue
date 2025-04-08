<script setup lang="ts">
// Page metadata
definePageMeta({
  name: 'AdvertisingPage',
  layout: 'default',
})

useHead({
  title: 'Advertise With AstronEra | Connect With Astronomy Enthusiasts',
  meta: [
    {
      name: 'description',
      content:
        'Promote your space-tech company, institutions, event, or research to our engaged community of astronomy enthusiasts across India and beyond.',
    },
  ],
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <AdvertHero />

    <!-- Why Partner With AstronEra -->
    <AdvertPartnerBenefits />

    <!-- Customer Profiles Section -->
    <AdvertCustomerProfiles />

    <!-- Advertising Packages -->
    <AdvertPackages />

    <!-- FAQ Section -->
    <AdvertFAQ />

    <!-- Contact Form -->
    <div class="wrapper py-16 text-center">
      <LandingTitle
        title="Ready to Reach Your Target Audience?"
        subtitle="Get in touch with our team"
      />

      <div class="mt-8">
        <AdvertContactForm />
      </div>

      <div class="mt-12 text-center text-primary-300">
        <p>You can also reach us directly at:</p>
        <p class="text-primary-400 mt-2 text-lg">connectus@astronera.org</p>
      </div>
    </div>
  </div>
</template>
