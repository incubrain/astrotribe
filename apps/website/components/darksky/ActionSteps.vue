<script setup lang="ts">
interface ActionStep {
  title: string
  description: string
  actionText?: string
  actionUrl?: string
  icon: string
}

defineProps<{
  steps: ActionStep[]
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <section class="py-16">
    <LandingTitle
      :title="title || 'Start Making a Difference Today'"
      :subtitle="subtitle || 'Simple steps to reduce light pollution and protect dark skies'"
      class="mb-12"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
      <div
        v-for="(step, index) in steps"
        :key="index"
      >
        <LandingGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="low"
          interactive
          class="flex flex-col h-full"
        >
          <!-- Icon Header -->
          <div class="mb-4 flex justify-center">
            <div
              class="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <div
                class="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center"
              >
                <Icon
                  :name="step.icon"
                  size="28"
                  class="text-white"
                />
              </div>
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-bold mb-3 text-primary-400 text-center">{{ step.title }}</h3>
          <p class="text-base mb-6 text-center px-2">{{ step.description }}</p>

          <!-- Action Button -->
          <div
            v-if="step.actionUrl"
            class="mt-auto flex justify-center"
          >
            <NuxtLink :to="step.actionUrl">
              <PrimeButton
                size="small"
                severity="secondary"
              >
                {{ step.actionText }}
                <Icon
                  :name="step.icon"
                  class="ml-2"
                />
              </PrimeButton>
            </NuxtLink>
          </div>
        </LandingGlass>
      </div>
    </div>
  </section>
</template>
