<script setup lang="ts">
interface PracticalStep {
  title: string
  icon: string
  tips: string[]
}

defineProps<{
  title?: string
  subtitle?: string
  steps?: PracticalStep[]
}>()

// Default steps if none provided
const defaultSteps: PracticalStep[] = [
  {
    title: 'Shield Your Lights',
    icon: '🛡️',
    tips: [
      'Use fully-shielded fixtures that direct light downward',
      'Cover bare bulbs to prevent light from shining upward',
      'Install motion sensors for security lighting',
      'Adjust existing fixtures with shields or hoods',
    ],
  },
  {
    title: 'Use the Right Lights',
    icon: '💡',
    tips: [
      'Choose warm-colored bulbs (under 3000K)',
      'Use the minimum brightness necessary',
      'Replace cool white LEDs with warm alternatives',
      'Select dark-sky friendly fixtures for outdoor lighting',
    ],
  },
  {
    title: 'Control When Lights Are On',
    icon: '⏱️',
    tips: [
      'Install timers to turn off lights when not needed',
      'Use motion sensors for security and walkway lighting',
      'Turn off decorative lighting after business hours',
      'Advocate for smart lighting systems in your community',
    ],
  },
]
</script>

<template>
  <section class="py-16">
    <LandingTitle
      :title="title || 'Practical Steps to Fight Light Pollution'"
      :subtitle="subtitle"
      class="mb-12"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
      <div
        v-for="(step, index) in steps || defaultSteps"
        :key="index"
        class="bg-blue-900/50 rounded-lg p-6 border border-blue-800/30 hover:bg-blue-800/50 transition-all duration-300"
      >
        <div class="mb-4 flex justify-center">
          <div
            class="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
          >
            <span class="text-3xl">{{ step.icon }}</span>
          </div>
        </div>
        <h4 class="text-xl font-bold text-blue-400 mb-4 text-center">{{ step.title }}</h4>
        <ul class="list-disc pl-5 text-gray-300 space-y-2">
          <li
            v-for="(tip, tipIndex) in step.tips"
            :key="tipIndex"
          >
            {{ tip }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
