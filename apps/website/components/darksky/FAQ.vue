<script setup lang="ts">
interface FAQ {
  question: string
  answer: string
  expandedAnswer?: string
  isExpanded?: boolean
}

const props = defineProps<{
  faqs: FAQ[]
  title?: string
  subtitle?: string
}>()

// Create a local copy of FAQs to handle state
const localFaqs = ref(
  props.faqs.map((faq) => ({
    ...faq,
    isExpanded: faq.isExpanded || false,
  })),
)

const toggleExpand = (index: number) => {
  localFaqs.value[index].isExpanded = !localFaqs.value[index].isExpanded
}
</script>

<template>
  <section class="py-16 bg-gradient-to-b from-primary-950 to-primary-900 rounded-xl my-8">
    <LandingTitle
      :title="title || 'Frequently Asked Questions'"
      :subtitle="subtitle || 'Common questions about dark sky preservation and light pollution'"
      class="mb-12"
    />

    <div class="px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(faq, index) in localFaqs"
          :key="index"
        >
          <div
            class="background p-4 border border-color rounded-md h-full flex flex-col justify-between"
          >
            <div class="flex flex-col">
              <h3 class="text-xl font-bold mb-3 text-primary-400">{{ faq.question }}</h3>
              <p class="text-base">{{ faq.answer }}</p>
            </div>

            <div
              v-if="faq.expandedAnswer"
              class="mt-4"
            >
              <PrimeButton
                size="small"
                severity="secondary"
                text
                @click="toggleExpand(index)"
              >
                {{ faq.isExpanded ? 'Show less' : 'Read more' }}
                <Icon
                  :name="faq.isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                  class="ml-1"
                />
              </PrimeButton>

              <div
                v-if="faq.isExpanded"
                class="mt-3 text-sm text-gray-300 border-l-2 border-primary-600 pl-4"
              >
                {{ faq.expandedAnswer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
