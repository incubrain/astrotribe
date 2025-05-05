<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAnalytics } from '#imports'

const { trackUserEngagement, UserEngagementMetric } = useAnalytics()
const showButton = ref(true)
const isHovered = ref(false)
const dialogVisible = ref(false)
const calendarLoaded = ref(false)
const calendarContainer = ref(null)

const handleConsultationClick = () => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'consultation_request',
    source: 'floating_button',
  })
  dialogVisible.value = true
}

const initializeCalendarButton = () => {
  if (calendarContainer.value && window.calendar && window.calendar.schedulingButton) {
    window.calendar.schedulingButton.load({
      url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3bUSyyKHFhpezfHQ6a_3mqIonGemdu5biPNBRslpw_1w-bmkaUUTJUudTjdIdC6gB106BkdIre?gv=true',
      color: '#039BE5',
      label: 'Book an appointment',
      target: calendarContainer.value,
    })
    calendarLoaded.value = true
  }
}

onMounted(() => {
  if (import.meta.client) {
    // Load Google Calendar scheduling button resources
    const link = document.createElement('link')
    link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js'
    script.async = true
    document.head.appendChild(script)
  }
})
</script>

<template>
  <Transition name="slide-fade">
    <button
      v-if="showButton"
      class="fixed bottom-10 right-6 z-[1001] flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-blue-600 px-6 py-3 text-white shadow-lg shadow-primary-600/30 transition-all duration-300 hover:from-primary-500 hover:to-blue-500"
      :class="{ 'scale-105': isHovered }"
      @click="handleConsultationClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <Icon
        name="mdi:calendar-clock"
        size="18"
      />
      <span class="font-medium">Book Consultation</span>
    </button>
  </Transition>

  <PrimeDialog
    modal
    v-model:visible="dialogVisible"
    header="Schedule a Consultation"
    class="calendar-dialog"
    :style="{ width: '90vw', height: '90vh' }"
    :dismissableMask="true"
    :maximizable="true"
  >
    <iframe
      src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3bUSyyKHFhpezfHQ6a_3mqIonGemdu5biPNBRslpw_1w-bmkaUUTJUudTjdIdC6gB106BkdIre?gv=true"
      frameborder="0"
      class="calendar-iframe rounded h-full w-full"
      allowfullscreen
    ></iframe>
  </PrimeDialog>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Ensure the dialog has full height */
:deep(.calendar-dialog) {
  max-height: 100% !important; /* Override any PrimeVue defaults */
}

/* Style the slot content */
.dialog-content-inner {
  flex: 1; /* Take up all available space */
  display: flex;
  height: 100%;
  padding: 1rem; /* Restore padding inside your content */
}

/* Ensure iframe takes full height and width */
.calendar-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Additional styling for the Google Calendar button */
:deep(.goog-inline-block) {
  width: 100% !important;
}
</style>
