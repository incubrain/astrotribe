<template>
  <form @submit.prevent="handleSubmit">
    <div class="p-fluid">
      <div class="p-field">
        <label for="occupation">Occupation</label>
        <PrimeSelect
          id="occupation"
          v-model="form.occupation"
          :options="occupationOptions"
          option-label="name"
          option-value="value"
          placeholder="Select an occupation"
          :class="{ 'p-invalid': errors.occupation }"
        />
        <small
          v-if="errors.occupation"
          class="p-error"
        >{{ errors.occupation }}</small>
      </div>
      <div class="p-field">
        <label for="organization">Organization</label>
        <PrimeInputText
          id="organization"
          v-model="form.organization"
          :class="{ 'p-invalid': errors.organization }"
        />
        <small
          v-if="errors.organization"
          class="p-error"
        >{{ errors.organization }}</small>
      </div>
      <div class="p-field">
        <label for="experience">Years of Experience</label>
        <PrimeInputNumber
          id="experience"
          v-model="form.experience"
          :min="0"
          :max="100"
          :class="{ 'p-invalid': errors.experience }"
        />
        <small
          v-if="errors.experience"
          class="p-error"
        >{{ errors.experience }}</small>
      </div>
    </div>
    <div class="mt-4">
      <PrimeButton
        type="button"
        label="Previous"
        class="p-button-secondary mr-2"
        @click="$emit('prev')"
      />
      <PrimeButton
        type="submit"
        label="Next"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
const { form, errors, validateAndUpdate, professionalInfoSchema } = useOnboarding()

const occupationOptions = [
  { name: 'Astronomer', value: 'astronomer' },
  { name: 'Astrophysicist', value: 'astrophysicist' },
  { name: 'Space Engineer', value: 'space_engineer' },
  { name: 'Planetary Scientist', value: 'planetary_scientist' },
  { name: 'Other', value: 'other' },
]

const handleSubmit = () => {
  if (validateAndUpdate(professionalInfoSchema)) {
    emit('next')
  }
}

const emit = defineEmits(['next', 'prev'])
</script>
