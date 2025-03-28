<script setup lang="ts">
import { ref } from 'vue'
import Popover from 'primevue/popover'

interface Resource {
  title: string
  url: string
}

interface ActionStep {
  title: string
  description: string
  actionText?: string
  actionUrl?: string
  icon: string
  resources: Resource[] // Changed from primaryResource + moreResources to just resources
}

defineProps<{
  steps: ActionStep[]
  title?: string
  subtitle?: string
}>()

// References for each popover
const popoverRefs = ref<any[]>([])

// Toggle popover visibility
const togglePopover = (index: number, event: Event) => {
  try {
    if (popoverRefs.value[index]) {
      popoverRefs.value[index].toggle(event)
    }
  } catch (error) {
    console.error('Error toggling popover:', error)
  }
}

// Set up popover ref safely
const setPopoverRef = (el: any, index: number) => {
  if (!popoverRefs.value) {
    popoverRefs.value = []
  }
  popoverRefs.value[index] = el
}
</script>

<template>
  <section>
    <LandingTitle
      :title="title || 'Start Making a Difference Today'"
      :subtitle="
        subtitle ||
        'Simple steps to reduce light pollution and protect dark skies in India and beyond'
      "
      class="mb-12 text-center text-white"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="relative"
      >
        <LandingGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="medium"
          interactive
          class="flex flex-col h-full p-4 rounded-xl bg-opacity-80 backdrop-blur-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
        >
          <!-- Icon Header -->
          <div class="mb-4 flex justify-center">
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110"
            >
              <Icon
                :name="step.icon"
                size="32"
                class="text-white"
              />
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-bold mb-2 text-blue-300 text-center">{{ step.title }}</h3>
          <p class="text-base mb-4 text-gray-200 text-center px-2 leading-relaxed">
            {{ step.description }}
          </p>

          <!-- Action Button -->
          <div class="mb-4 flex justify-center">
            <NuxtLink
              :to="step.actionUrl"
              target="_blank"
            >
              <PrimeButton
                size="small"
                severity="secondary"
                class="bg-gradient-to-r from-blue-500 to-blue-700 text-white border-none hover:from-blue-600 hover:to-blue-800 transform transition-transform duration-200 hover:scale-105 focus:ring-4 focus:ring-blue-300"
              >
                {{ step.actionText }}
                <Icon
                  :name="step.icon"
                  class="ml-2"
                />
              </PrimeButton>
            </NuxtLink>
          </div>

          <!-- Resources Button with Popover -->
          <div class="mt-auto flex justify-center">
            <PrimeButton
              type="button"
              severity="secondary"
              size="small"
              text
              class="text-blue-400 hover:text-blue-300"
              @click="togglePopover(index, $event)"
            >
              View Resources
              <Icon
                name="ph:book-open"
                class="ml-1"
              />
            </PrimeButton>

            <!-- Popover for Resources -->
            <PrimePopover
              :ref="(el) => setPopoverRef(el, index)"
              class="dark-popover"
            >
              <div class="p-3 w-64 max-h-64 overflow-y-auto">
                <h4 class="font-medium text-blue-300 mb-2">Resources</h4>
                <ul class="space-y-2">
                  <li
                    v-for="(resource, resourceIndex) in step.resources"
                    :key="resourceIndex"
                    class="text-sm"
                  >
                    <NuxtLink
                      :to="resource.url"
                      target="_blank"
                      class="text-gray-200 hover:text-blue-400 transition-colors duration-200 flex items-center"
                    >
                      <Icon
                        name="ph:link-simple"
                        class="mr-1 text-blue-500"
                        size="14"
                      />
                      {{ resource.title }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </PrimePopover>
          </div>
        </LandingGlass>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ensure accessibility for focus states */
button:focus,
a:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}

/* Custom hover effects for cards */
.landing-glass:hover {
  transform: translateY(-5px);
}

/* Style the Popover to match the dark space theme */
:deep(.dark-popover.p-popover) {
  background-color: #1e1e2f;
  border: 1px solid #323258;
  border-radius: 0.5rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.3),
    0 4px 6px -4px rgba(0, 0, 0, 0.4);
}

:deep(.dark-popover.p-popover .p-popover-arrow) {
  border-color: #323258 transparent transparent transparent;
}

:deep(.dark-popover.p-popover .p-popover-content) {
  background-color: #1e1e2f;
  color: #d0d0ea;
}
</style>
