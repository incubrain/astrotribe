<!-- FolderTree.vue -->
<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | null // For v-model of selected folder ID
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'select', folder: Folder): void
}>()

const { folders, flatFolders, getFavorites, createFolder } = useFolderStore()
const { checkFeatureLimit, getFeatureUsage, getUpgradeMessage } = usePlan()

const canCreateFolder = computed(() => {
  return checkFeatureLimit('BOOKMARK_FOLDERS', folders.value?.length ?? 0)
})

const folderUsage = computed(() => getFeatureUsage('BOOKMARK_FOLDERS', folders.value?.length ?? 0))

const showNewFolderModal = ref(false)

const selectFolder = (folder: Folder) => {
  emit('update:modelValue', folder.id)
  emit('select', folder)
}

const handleNewFolder = async () => {
  if (!newFolder.value.name.trim()) return

  try {
    await createFolder(newFolder.value)
    showNewFolderModal.value = false
    resetNewFolder()
  } catch (error) {
    console.error('Failed to create folder:', error)
  }
}

const newFolder = ref({
  name: '',
  parent_id: null,
  color: '#94A3B8',
  is_favorite: false,
  is_default: false,
})

const resetNewFolder = () => {
  newFolder.value = {
    name: '',
    parent_id: null,
    color: '#94A3B8',
    is_favorite: false,
    is_default: false,
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="mt-4">
      <button
        v-if="canCreateFolder"
        class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium border border-color bg-primary-500 rounded-md"
        @click="showNewFolderModal = true"
      >
        <Icon
          name="mdi:plus"
          class="w-4 h-4 mr-2"
        />
        New Folder
        <span
          v-if="!folderUsage.isUnlimited"
          class="ml-1"
        >
          ({{ folderUsage.used }}/{{ folderUsage.limit }})
        </span>
      </button>
      <div
        v-else
        class="text-sm p-3 rounded-md"
      >
        <p>You've reached the folder limit.</p>
        <NuxtLink
          to="/premium"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          {{ getUpgradeMessage('BOOKMARK_FOLDERS') }}
        </NuxtLink>
      </div>
    </div>

    <div
      v-if="getFavorites.length"
      class="mb-4"
    >
      <h3 class="font-medium mb-2">Favorites</h3>
      <div class="space-y-1">
        <FolderItem
          v-for="folder in getFavorites"
          :key="folder.id"
          :folder="folder"
          @select="selectFolder"
        />
      </div>
    </div>

    <!-- Folder Tree -->
    <div class="space-y-1">
      <FolderItem
        v-for="folder in folders"
        :key="folder.id"
        :folder="folder"
        :selected-id="modelValue"
        @select="selectFolder"
      />
    </div>

    <!-- New Folder Dialog -->
    <PrimeDialog
      v-model:visible="showNewFolderModal"
      modal
      header="New Folder"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <!-- Main Content -->
      <span class="block mb-4">Create a new folder to organize your bookmarks.</span>

      <form
        class="space-y-4"
        @submit.prevent="handleNewFolder"
      >
        <div class="flex items-center gap-4 mb-4">
          <label
            for="folderName"
            class="font-semibold w-24"
            >Name</label
          >
          <PrimeInputText
            id="folderName"
            v-model="newFolder.name"
            class="flex-auto"
            required
            autofocus
          />
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label
            for="parentFolder"
            class="font-semibold w-24"
            >Parent</label
          >
          <PrimeSelect
            id="parentFolder"
            v-model="newFolder.parent_id"
            :options="flatFolders"
            option-label="name"
            option-value="id"
            placeholder="Select a parent folder"
            class="flex-auto"
          />
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label
            for="folderColor"
            class="font-semibold w-24"
            >Color</label
          >
          <div class="flex items-center gap-2 flex-auto">
            <input
              id="folderColor"
              v-model="newFolder.color"
              type="color"
              class="h-8 w-8 rounded cursor-pointer"
            />
            <span class="text-sm">{{ newFolder.color }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center flex-1">
            <PrimeCheckbox
              v-model="newFolder.is_favorite"
              :binary="true"
            />
            <span class="ml-2">Add to favorites</span>
          </label>

          <label class="flex items-center flex-1">
            <PrimeCheckbox
              v-model="newFolder.is_default"
              :binary="true"
            />
            <span class="ml-2">Set as default</span>
          </label>
        </div>
      </form>

      <!-- Footer -->
      <template #footer>
        <PrimeButton
          label="Cancel"
          class="p-button-text"
          severity="secondary"
          @click="showNewFolderModal = false"
        />
        <PrimeButton
          label="Create"
          @click="handleNewFolder"
        />
      </template>
    </PrimeDialog>
  </div>
</template>
