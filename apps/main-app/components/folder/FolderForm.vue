<template>
  <form
    class="flex flex-col gap-8"
    @submit.prevent="handleSubmit"
  >
    <div>
      <label class="block text-sm font-medium">Name</label>
      <PrimeInputText
        v-model="formData.name"
        type="text"
        class="mt-1 block w-full rounded-md"
        required
      />
    </div>

    <div class="flex items-center gap-4">
      <label class="block text-sm font-medium">Color</label>
      <div class="mt-1 flex items-center gap-2">
        <PrimeColorPicker v-model="formData.color" />
        <span class="text-sm">{{ formData.color }}</span>
      </div>

      <label class="flex items-center">
        <PrimeCheckbox
          v-model="formData.is_favorite"
          :binary="true"
        />
        <span class="ml-2 text-sm">Add to favorites</span>
      </label>

      <label class="flex items-center">
        <PrimeCheckbox
          v-model="formData.is_default"
          :binary="true"
        />
        <span class="ml-2 text-sm">Set as default</span>
      </label>
    </div>

    <div class="flex justify-between">
      <PrimeButton
        v-if="folder"
        type="button"
        severity="danger"
        @click="$emit('delete')"
      >
        Delete Folder
      </PrimeButton>
      <div
        v-else
        class="flex-grow"
      />

      <div class="flex gap-2">
        <PrimeButton
          type="button"
          severity="secondary"
          @click="$emit('cancel')"
        >
          Cancel
        </PrimeButton>
        <PrimeButton type="submit">
          {{ folder ? 'Save Changes' : 'Create Folder' }}
        </PrimeButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Folder } from '~/types/folder'

const props = defineProps<{
  folder?: Folder
}>()

const emit = defineEmits<{
  (e: 'submit', data: Partial<Folder>): void
  (e: 'cancel' | 'delete'): void
}>()

const formData = ref(
  props.folder
    ? {
        ...props.folder,
        color: props.folder.color.startsWith('#') ? props.folder.color : `#${props.folder.color}`,
      }
    : {
        name: '',
        color: '#94A3B8',
        is_favorite: false,
        is_default: false,
      },
)

const handleSubmit = () => {
  const color = formData.value.color.startsWith('#')
    ? formData.value.color
    : `#${formData.value.color}`

  emit('submit', {
    name: formData.value.name,
    color,
    is_favorite: formData.value.is_favorite,
    is_default: formData.value.is_default,
  })
}
</script>
