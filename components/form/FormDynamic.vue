<template>
  <VForm :validation-schema="p.validationSchema">
    <div class="flex flex-wrap justify-between w-full gap-4">
      <div
        v-for="(field, index) in p.schema"
        :key="index"
        class="h-full my-2 flex flex-col gap-2"
        :class="field.width === 'half' ? 'w-full lg:w-[calc(50%-8px)]' : 'w-full'"
      >
        <label
          v-if="hasLabels"
          :for="field.name"
          class="block mb-2 text-xs font-semibold"
        >
          {{ field.props.label }}
        </label>
        <VField
          :id="field.name"
          :name="field.name"
          :type="field.props.type"
        >
          <input
            v-model="localModelValue[field.name]"
            :placeholder="placeholder[field.name]"
            class="w-full h-10 px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-800 dark:placeholder-gray-500 background"
          />
        </VField>
        <VErrorMessage
          :name="field.name"
          class="block px-3 py-1 text-xs italic text-error-400 dark:text-error-800"
        />
      </div>
    </div>
    <UButton
      class="mt-4"
      @click="submitForm"
    >
      {{ p.buttonLabel }}
    </UButton>
  </VForm>
</template>

<script setup lang="ts">
const p = defineProps({
  schema: {
    type: Object,
    required: true
  },
  validationSchema: {
    type: Object,
    required: true
  },
  placeholder: {
    type: Object,
    required: false,
    default: () => ({})
  },
  hasLabels: {
    type: Boolean,
    default: false
  },
  buttonLabel: {
    type: String,
    default: 'Submit'
  }
})

const localModelValue = ref({ ...p.placeholder })

watchEffect(() => {
  console.log('placeholder changed: ', p.placeholder)
  Object.assign(localModelValue.value, p.placeholder)
  console.log('local changed: ', localModelValue.value)
})

const emit = defineEmits(['submitForm'])

const submitForm = () => {
  console.log('sending data:', localModelValue.value)
  emit('submitForm', { ...localModelValue.value })
}
</script>
