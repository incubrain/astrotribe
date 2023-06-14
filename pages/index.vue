<template>
  <div>
    <HomeHero />
    <div class="max-w-[1240px] mx-auto flex flex-col px-[20px] md:px-[80px] lg:px-[160px]">
      <HomeTrusted />
      <HomeFeatures class="py-16 md:py-32" />
      <HomeProductStep
        v-for="step in productSteps"
        :key="step.id"
        :image-right="step.imageRight"
        :img-src="step.imgSrc"
        :title="step.title"
        :body="step.body"
        :cta="step.cta"
        class="py-16 md:py-32"
      />
    </div>
    <HomeCtaMain
      class="py-16 md:py-32"
      title="Earlybird Exclusive Benefits"
      body="The first 50 people will get exclusive life-time free use of our platform"
      cta="Claim your spot"
    />
    <div class="max-w-[1040px] mx-auto flex flex-col py-16 md:py-32 px-[20px] md:px-[80px] lg:px-[160px]">
      <HomeTestimonial />
      <HomeCtaSecond
        title="Host Stargazing Events"
        body="Share your passion for the stars. Organize stargazing events and connect with local enthusiasts."
        cta="Plan Your Event Today"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const productSteps = [
  {
    id: 1,
    title: 'Host Paid Stargazing Events',
    body: 'Host stargazing events with ease through our platform. Partner with local resorts, manage RSVPs, and receive payments securely. Gather feedback for continuous improvement, all while earning from your passion!',
    cta: 'Coming Q3 2023',
    imageRight: true,
    imgSrc: '/images/astrotribe-paid-events-shweta-hosting-event.png'
  },
  {
    id: 2,
    title: 'Curated Galactic News',
    body: 'Stay updated with the latest astronomy news, courtesy of our advanced AI. Get brief, easy-to-understand summaries from trusted sources, making cosmic discovery effortless and quick.',
    cta: 'Coming Q4 2023',
    imageRight: false,
    imgSrc: '/images/astrotribe-news-isro-rocket-launch.png'
  },
  {
    id: 3,
    title: 'Space Conversations: AI-Q&A',
    body: 'Satisfy your cosmic curiosity with our AI trained on NASA and ULA data. Just ask your question, and get reliable, detailed answers about the universe effortlessly.',
    cta: 'Coming Q4 2023',
    imageRight: true,
    imgSrc: '/images/astrotribe-ai-chatbot.png'
  }
]

definePageMeta({
  name: 'Home',
  layout: 'home'
})
</script>

<style scoped></style>
