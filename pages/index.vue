<script setup lang="ts">
definePageMeta({
  name: 'Home'
})
// !todo:low look into subtle black and white images or patterns to give the background some flair

const features = [
  {
    icon: 'mdi:comment-text-outline',
    title: 'Comments',
    description: 'Highlight comments on the screen, & engage with your audience in real-time.',
    link: '#',
    linkText: 'Explore More'
  },
  {
    icon: 'mdi:chat-outline',
    title: 'Unlimited Chat',
    description:
      'Drive interaction among your users with live messaging features on your video streams.',
    link: '#',
    linkText: 'Explore more'
  },
  {
    icon: 'mdi:share-variant',
    title: 'Share Media',
    description: 'Enhance user collaboration with exchange of images, videos, gifs & documents.',
    link: '#',
    linkText: 'Explore More'
  },
  {
    icon: 'mdi:comment-text-outline',
    title: 'Comments',
    description: 'Highlight comments on the screen, & engage with your audience in real-time.',
    link: '#',
    linkText: 'Explore More'
  },
  {
    icon: 'mdi:chat-outline',
    title: 'Unlimited Chat',
    description:
      'Drive interaction among your users with live messaging features on your video streams.',
    link: '#',
    linkText: 'Explore more'
  },
  {
    icon: 'mdi:share-variant',
    title: 'Share Media',
    description: 'Enhance user collaboration with exchange of images, videos, gifs & documents.',
    link: '#',
    linkText: 'Explore More'
  },
  {
    icon: 'mdi:comment-text-outline',
    title: 'Comments',
    description: 'Highlight comments on the screen, & engage with your audience in real-time.',
    link: '#',
    linkText: 'Explore More'
  },
  {
    icon: 'mdi:chat-outline',
    title: 'Unlimited Chat',
    description:
      'Drive interaction among your users with live messaging features on your video streams.',
    link: '#',
    linkText: 'Explore more'
  },
  {
    icon: 'mdi:share-variant',
    title: 'Share Media',
    description: 'Enhance user collaboration with exchange of images, videos, gifs & documents.',
    link: '#',
    linkText: 'Explore More'
  },
  {
    icon: 'mdi:share-variant',
    title: 'Share Media',
    description: 'Enhance user collaboration with exchange of images, videos, gifs & documents.',
    link: '#',
    linkText: 'Explore More'
  },
  {
    icon: 'mdi:share-variant',
    title: 'Share Media',
    description: 'Enhance user collaboration with exchange of images, videos, gifs & documents.',
    link: '#',
    linkText: 'Explore More'
  },
  {
    icon: 'mdi:share-variant',
    title: 'Share Media',
    description: 'Enhance user collaboration with exchange of images, videos, gifs & documents.',
    link: '#',
    linkText: 'Explore More'
  }
]
</script>

<template>
  <div class="relative z-0">
    <HomeHero />
    <div class="wrapper padded-x">
      <HomeTrusted />
      <LazyHomeFeatures class="py-16 md:py-24" />
      <LazyHomeHeading
        heading="That's not all..."
        subheading="We Have Some Big Plans!"
        class="pb-16 md:pb-24"
      />
      <!-- <HomeFeatureGroup
        title="Supercharge Live Streams With On-brand Features"
        description="OnTheFly gives you all the tools to engage your audience with captivating streams."
        :features="features"
      />

      <LazyHomeFeatureTabs class="pb-16 md:pb-24" /> -->
    </div>
    <LazyHomeCtaMain
      class="border-color border-y py-16 md:py-24"
      title="Earlybird Exclusive Benefits"
      body="The first 50 people will get exclusive life-time free use of our platform"
      cta="Claim your spot"
    />
    <div class="wrapper padded-x mx-auto flex flex-col py-16 md:py-24">
      <LazyHomeTestimonial class="pb-6 xl:pb-12" />
    </div>
  </div>
</template>

<style scoped></style>
