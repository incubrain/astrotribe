<script setup lang="ts">
const toast = useNotification()

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: '',
  },
  maxFileSize: {
    type: Number,
    default: 1000000,
  },
})

const onAdvancedUpload = () => {
  toast.success({ summary: 'File Uploaded', message: `${props.name} files uploaded` })
}
</script>

<template>
  <PrimeCard>
    <template #content>
      <PrimeFileUpload
        :name="name"
        :multiple="multiple"
        :accept="accept"
        :url="url"
        :max-file-size="maxFileSize"
        @upload="onAdvancedUpload()"
      >
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </PrimeFileUpload>
    </template>
  </PrimeCard>
</template>
