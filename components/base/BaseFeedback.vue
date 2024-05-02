<script setup lang="ts">
import { z } from 'zod'
const feedbackStore = useFeedbackStore()

interface FeedbackType {
  name: string
  value: string
}

const feedbackTypes = [
  { name: 'Bug Report', value: 'bug_report' },
  { name: 'Feature Request', value: 'feature_request' },
  { name: 'User Interface Issue', value: 'user_interface_issue' },
  { name: 'Performance Issue', value: 'performance_issue' },
  { name: 'Documentation', value: 'documentation' }
]

const route = useRoute()
const { userId } = useCurrentUser()

const feedback = ref({
  user_id: userId,
  page_identifier: route.fullPath,
  feedback_type: null,
  message: '',
  device_info: '',
  status: 'new'
})

const messagePlaceholder = computed(() => {
  if (!feedback.value.feedback_type) {
    return 'Please select a feedback type first'
  }

  const type = feedback.value.feedback_type
  if (!type) return ''

  switch (type.value) {
    case 'bug_report':
      return 'Describe the bug in detail...'
    case 'feature_request':
      return 'Describe the feature you would like to see...'
    case 'user_interface_issue':
      return 'What UI issue did you encounter?'
    case 'performance_issue':
      return 'Describe the performance issue...'
    case 'documentation':
      return 'What documentation issue did you find?'
    default:
      return 'Enter your message'
  }
})

const isMessageDisabled = computed(() => !feedback.value.feedback_type)

const messageLength = z.string().min(10)

const isMessageInvalid = computed(() => !messageLength.safeParse(feedback.value.message).success)
</script>

<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-4">How could we Improve?</h2>
    <form
      class="min-w-full flex flex-col gap-4"
      @submit.prevent=""
    >
      <PrimeDropdown
        v-model="feedback.feedback_type"
        :options="feedbackTypes"
        option-label="name"
        placeholder="Select a Feedback Type"
      />
      <PrimeTextarea
        v-show="feedback.feedback_type"
        v-model="feedback.message"
        :rows="5"
        :placeholder="messagePlaceholder"
        :disabled="isMessageDisabled"
        :invalid="isMessageInvalid"
      />
      <div>
        <PrimeButton
          label="Submit Feedback"
          :disabled="isMessageInvalid"
          :outlined="isMessageInvalid"
          @click="feedbackStore.submitFeedback(feedback)"
        />
      </div>
    </form>
  </div>
</template>

<style scoped></style>
