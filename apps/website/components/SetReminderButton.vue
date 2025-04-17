<script setup lang="ts">
import { ref } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useAnalytics } from '#imports'

const { activePersona } = usePersona()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

const props = defineProps<{
  eventName: string
  eventDate: Date
  eventId?: string | number
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'outlined'
}>()

// Emit events
const emit = defineEmits<{
  reminderSet: [{ type: string; timeValue: number; eventId: string | number }]
}>()

// Set defaults
const size = computed(() => props.size || 'medium')
const variant = computed(() => props.variant || 'default')

// Dialog visible state
const isReminderDialogVisible = ref(false)

// Reminder options
const reminderOptions = [
  { label: '30 minutes before', value: 30, type: 'minutes' },
  { label: '1 hour before', value: 60, type: 'minutes' },
  { label: '3 hours before', value: 180, type: 'minutes' },
  { label: '1 day before', value: 1, type: 'days' },
  { label: '3 days before', value: 3, type: 'days' },
  { label: '1 week before', value: 7, type: 'days' },
]

// Selected reminder option
const selectedReminder = ref(reminderOptions[1]) // Default to 1 hour

// Set reminder
const setReminder = () => {
  try {
    // In a real application, we would handle notification logic here
    // For now, we just track the analytics and emit an event
    trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
      feature: 'set_event_reminder',
      event_id: props.eventId,
      event_name: props.eventName,
      reminder_time: `${selectedReminder.value.value} ${selectedReminder.value.type}`,
      persona: activePersona.value.name,
    })

    // Emit event
    emit('reminderSet', {
      type: selectedReminder.value.type,
      timeValue: selectedReminder.value.value,
      eventId: props.eventId,
    })

    // Close dialog
    isReminderDialogVisible.value = false

    // Show success toast (using Primevue toast in a real application)
    // For now, a simple browser notification
    if (import.meta.client && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`Reminder set for ${props.eventName}`, {
          body: `You'll be reminded ${selectedReminder.value.label}`,
          icon: '/favicon.ico',
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }
  } catch (error) {
    console.error('Error setting reminder:', error)
  }
}

// CSS classes based on size
const buttonClasses = computed(() => {
  const classes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
  }

  return classes[size.value]
})

// CSS classes based on variant
const variantClasses = computed(() => {
  if (variant.value === 'outlined') {
    return `border border-${activePersona.value.color}-600 text-${activePersona.value.color}-500 hover:bg-${activePersona.value.color}-900/20`
  }

  return `bg-${activePersona.value.color}-800/50 text-${activePersona.value.color}-400 hover:bg-${activePersona.value.color}-800/70 border border-${activePersona.value.color}-700/30`
})
</script>

<template>
  <div>
    <!-- Reminder Button -->
    <PrimeButton
      :class="[
        buttonClasses,
        variantClasses,
        'transition-colors duration-500 flex items-center gap-2',
      ]"
      @click="isReminderDialogVisible = true"
    >
      <Icon
        name="mdi:bell-ring-outline"
        :size="size === 'small' ? 14 : size === 'large' ? 20 : 16"
      />
      <span>Set Reminder</span>
    </PrimeButton>

    <!-- Reminder Dialog -->
    <PrimeDialog
      v-model:visible="isReminderDialogVisible"
      modal
      header="Set Reminder"
      :style="{ width: '400px' }"
      :closable="true"
      :dismissable-mask="true"
      class="bg-slate-900 text-white"
    >
      <div class="p-2">
        <p class="text-gray-300 mb-4"
          >When would you like to be reminded about
          <span class="font-semibold text-white">{{ props.eventName }}</span
          >?</p
        >

        <div class="mb-4">
          <span class="text-sm text-gray-400 mb-2 block"
            >Event time: {{ props.eventDate.toLocaleString() }}</span
          >

          <PrimeDropdown
            v-model="selectedReminder"
            :options="reminderOptions"
            option-label="label"
            class="w-full"
            placeholder="Select reminder time"
          />
        </div>

        <div class="mt-6 flex items-center gap-3">
          <PrimeButton
            :class="`bg-${activePersona.value.color}-600 hover:bg-${activePersona.value.color}-500`"
            @click="setReminder"
          >
            <Icon
              name="mdi:bell-ring"
              class="mr-2"
            />
            Set Reminder
          </PrimeButton>

          <PrimeButton
            outlined
            class="border-gray-600 text-gray-400 hover:bg-gray-800"
            @click="isReminderDialogVisible = false"
          >
            Cancel
          </PrimeButton>
        </div>
      </div>
    </PrimeDialog>
  </div>
</template>
