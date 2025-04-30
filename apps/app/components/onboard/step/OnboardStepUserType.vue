<script setup lang="ts">
const userTypes = [
  {
    value: 'professional',
    label: 'Professional',
    icon: 'mdi:briefcase',
    description: 'Working in the astronomy or space industry',
  },
  {
    value: 'hobbyist',
    label: 'Hobbyist',
    icon: 'mdi:telescope',
    description: 'Space and astronomy enthusiast',
  },
  {
    value: 'researcher',
    label: 'Researcher',
    icon: 'mdi:flask',
    description: 'Engaged in academic or scientific research',
  },
  {
    value: 'student',
    label: 'Student',
    icon: 'mdi:school',
    description: 'Studying astronomy or related field',
  },
  { value: 'other', label: 'Other', icon: 'mdi:account', description: 'None of the above' },
]
</script>

<template>
  <div class="user-type-step">
    <h2 class="text-2xl font-bold mb-2">How do you identify yourself?</h2>
    <p class="text-gray-400 mb-6">This helps us personalize your experience.</p>

    <!-- Use the reusable SelectableCardField component -->
    <FormSelectableCardField
      name="user_type"
      :options="userTypes"
      :multiple="false"
    />
  </div>
</template>
