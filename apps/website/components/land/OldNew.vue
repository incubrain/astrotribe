<script setup lang="ts">
import { ref } from 'vue'

// Sample comparison data
const comparisons = ref([
  {
    id: 'research',
    title: 'Astronomy Research Process',
    oldWay: {
      title: 'Traditional Research Process',
      description:
        'Researchers typically spend weeks manually searching through databases, cross-referencing papers, and trying to identify relevant connections.',
      steps: [
        'Search through multiple academic databases individually',
        'Manually download and organize hundreds of papers',
        'Read through each paper to find relevant information',
        'Create spreadsheets to track findings and connections',
        'Manually identify research gaps through extensive cross-referencing',
      ],
      timeframe: '2-3 weeks',
    },
    newWay: {
      title: 'AstroQuery Research Process',
      description:
        'Our AI-powered platform automates the research process, finding connections and insights in minutes instead of weeks.',
      steps: [
        'Enter your research query in natural language',
        'Review AI-curated papers and their key findings',
        'Explore automatically generated connection maps',
        'Identify research gaps highlighted by our analysis',
        'Export structured findings ready for your paper',
      ],
      timeframe: 'Minutes to hours',
    },
  },
  {
    id: 'education',
    title: 'Creating Educational Content',
    oldWay: {
      title: 'Traditional Educational Process',
      description:
        'Educators spend hours jumping between simplified concepts and academic papers to create accurate but accessible teaching materials.',
      steps: [
        'Search for basic concept explanations online',
        'Find and verify scientific accuracy from research papers',
        'Create visualizations manually or outsource them',
        'Simplify complex terminology for different levels',
        'Update materials as new discoveries emerge',
      ],
      timeframe: 'Several days',
    },
    newWay: {
      title: 'AstroQuery Educational Process',
      description:
        'Generate accurate, multi-level explanations and visualizations instantly with verified scientific backing.',
      steps: [
        'Enter the astronomy concept you want to teach',
        'Select the education level (from K-12 to university)',
        'Get instant explanations with verified research citations',
        'Access ready-to-use visualizations and interactive materials',
        'One-click updates when new research emerges',
      ],
      timeframe: 'Under 1 hour',
    },
  },
])

// Active comparison
const activeComparison = ref(comparisons.value[0])
</script>

<template>
  <section
    id="comparison"
    class="py-20 md:py-28 relative overflow-hidden"
  >
    <!-- Background with pure black -->
    <div class="absolute inset-0 bg-slate-950 z-0"></div>

    <!-- Subtle noise texture -->
    <div class="absolute inset-0 bg-[url('/patterns/noise-pattern.svg')] opacity-5 z-0"></div>

    <!-- Subtle blue glow effects -->
    <div class="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

    <div class="wrapper container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section heading -->
      <div class="text-center mb-16">
        <h2 class="text-5xl md:text-6xl font-bold tracking-tight">
          <span class="text-white">Experience the</span>
          <span class="text-blue-500 block md:inline"> Difference</span>
        </h2>
        <p class="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          See how AstroQuery transforms time-consuming astronomy tasks into streamlined, efficient
          processes
        </p>
      </div>

      <!-- Comparison selector tabs -->
      <div class="flex justify-center mb-12">
        <div
          class="inline-flex bg-slate-900/60 backdrop-blur-sm rounded-full p-1.5 border border-slate-800/50"
        >
          <button
            v-for="comparison in comparisons"
            :key="comparison.id"
            class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            :class="
              activeComparison.id === comparison.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:text-white'
            "
            @click="activeComparison = comparison"
          >
            {{ comparison.title }}
          </button>
        </div>
      </div>

      <!-- Comparison component -->
      <LandOldVsNew
        :title="activeComparison.title"
        :old-way="activeComparison.oldWay"
        :new-way="activeComparison.newWay"
      />

      <!-- CTA section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0 }"
        class="mt-16 bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl p-8 text-center max-w-3xl mx-auto"
      >
        <h3 class="text-2xl font-bold text-white mb-4">Ready to transform your astronomy work?</h3>
        <p class="text-gray-300 mb-6"
          >Experience the power of AI-assisted astronomy research, education, and exploration.</p
        >

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <PrimeButton
            size="large"
            class="bg-blue-600 hover:bg-blue-500 border-none shadow-lg shadow-blue-900/20 transition-all duration-300 px-8"
          >
            Start Free Trial
            <Icon
              name="mdi:rocket-launch"
              class="ml-2"
              size="20"
            />
          </PrimeButton>

          <PrimeButton
            size="large"
            outlined
            class="border-white text-white hover:bg-white/10 transition-all duration-300 px-8"
          >
            See Demo
            <Icon
              name="mdi:play-circle"
              class="ml-2"
              size="20"
            />
          </PrimeButton>
        </div>
      </div>
    </div>
  </section>
</template>
