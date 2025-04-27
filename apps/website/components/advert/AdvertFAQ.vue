<script setup lang="ts">
// FAQ data
const faqs = [
  {
    question: 'How many impressions can I expect from my promotion?',
    answer:
      'We guarantee the exact number of impressions specified in your chosen package. Unlike time-limited promotions, we continue promoting your content until it reaches the guaranteed impression count, no matter how long it takes.',
  },
  {
    question: 'What information do you need from me to get started?',
    answer:
      "We'll need details about your organization, high-quality images, information about what makes your offering unique, and any specific goals for your campaign. During our consultation, we'll guide you through exactly what will make your promotion most effective.",
  },
  {
    question: 'How quickly will my promotion go live?',
    answer:
      "After our consultation and once we have all necessary materials, we typically launch promotions within 3-5 business days. We'll work with you to find the optimal timing based on astronomical events and seasonal trends.",
  },
  {
    question: 'Do you provide analytics and reporting?',
    answer:
      'Yes! We provide regular updates on your campaign performance, including impressions, engagement rates, click-throughs, and estimated reach. For premium packages, we offer more detailed analytics and insights.',
  },
  {
    question: 'Can I target specific regions or demographics?',
    answer: 'Not for now',
    //answer: 'Absolutely! We can target your promotion to specific regions in India or globally, and to audiences with particular interests within astronomy. Our targeting options help ensure your promotion reaches the most relevant audience.',
  },
]
</script>

<template>
  <div class="wrapper py-20 mx-auto">
    <LandingTitle
      title="Common Questions"
      subtitle="Everything you need to know about advertising with us"
    />

    <IBGlass
      hover-effect="glow"
      glow-color="blue"
      gradient="mixed"
      intensity="low"
      class="p-8 mt-12 max-w-4xl mx-auto"
    >
      <PrimeAccordion class="justify-center items-center flex flex-col gap-4 w-full">
        <PrimeAccordionPanel
          v-for="(faq, index) in faqs"
          :key="index"
          :value="index.toString()"
          class="w-full mb-4"
        >
          <PrimeAccordionHeader class="flex items-center bg-primary-800/50 py-3 rounded-md px-4">
            <div class="flex items-center w-full gap-4">
              <Icon
                name="i-lucide-help-circle"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <h3 class="text-lg font-semibold text-left overflow-hidden">{{ faq.question }}</h3>
            </div>
          </PrimeAccordionHeader>
          <PrimeAccordionContent
            class="w-full break-words whitespace-normal justify-between bg-primary-900/30 rounded-b-md mt-px"
          >
            <p class="p-4 overflow-wrap-anywhere text-primary-200">{{ faq.answer }}</p>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>
    </IBGlass>
  </div>
</template>
