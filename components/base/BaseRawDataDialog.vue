<template>
  <div>
    <PrimeButton
      @click="openPopup"
      :class="buttonClass"
    >
      {{ buttonText }}
    </PrimeButton>

    <PrimeDialog
      v-model:visible="visible"
      modal
      :header="dialogTitle"
      :style="{ width: '80vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div class="max-h-[70vh] overflow-auto">
        <div
          v-for="(item, index) in dataArray"
          :key="index"
          class="mb-4"
        >
          <h2 class="mb-2 text-xl font-bold">{{ item.title }}</h2>
          <pre class="rounded bg-gray-900 p-4">{{ stringifyData(item.data) }}</pre>
        </div>
      </div>
    </PrimeDialog>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  dataArray: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((item) => 'title' in item && 'data' in item)
    }
  },
  dialogTitle: {
    type: String,
    default: 'Raw Data'
  },
  buttonText: {
    type: String,
    default: 'View Raw Data'
  }
})

const stringifyData = (data: any) => JSON.stringify(data, null, 2)

const visible = ref(false)

function openPopup() {
  visible.value = true
}

defineExpose({ openPopup })
</script>
