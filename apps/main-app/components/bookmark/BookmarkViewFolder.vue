<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Folders</h2>
      <PrimeButton
        class="p-button-primary"
        @click="showNewFolderModal = true"
      >
        <div class="flex items-center gap-2">
          <Icon name="mdi:folder-plus" />
          <span
            >New Folder ({{ folderUsage.used }}/{{
              folderUsage.isUnlimited ? '∞' : folderUsage.limit
            }})</span
          >
        </div>
      </PrimeButton>
    </div>

    <!-- Folders Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="folder in folderStore.folders"
        :key="folder.id"
        class="relative p-4 hover:shadow-md transition-shadow bg-card border border-color rounded-lg cursor-pointer group overflow-hidden"
        :class="{ 'bg-primary-900': currentFolder.value.id === folder.id }"
        @click="handleFolderSelect(folder)"
      >
        <!-- Static color strip -->
        <div
          class="absolute top-0 left-0 right-0 h-[5px]"
          :style="{ backgroundColor: folder.color }"
        />

        <!-- Main Content -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-2 w-full relative">
            <!-- Normal title view -->
            <h3
              v-if="editingFolderId !== folder.id"
              class="font-medium flex-1"
            >
              {{ folder.name }}
            </h3>

            <!-- Edit title mode -->
            <div
              v-if="editingFolderId === folder.id"
              class="flex items-center w-full gap-2"
              @click.stop
            >
              <input
                v-model="editingName"
                class="min-w-0 flex-1 bg-transparent border-b border-primary-500 focus:outline-none px-1"
                @keyup.enter="saveEdit(folder)"
                @keyup.esc="cancelEdit"
                ref="editInput"
                autocomplete="off"
              />
              <button
                class="shrink-0 p-1 hover:text-primary-500 transition-colors border border-color flex text-white rounded-full"
                @click="saveEdit(folder)"
              >
                <Icon
                  name="mdi:check"
                  class="w-4 h-4"
                />
              </button>
            </div>

            <Icon
              v-if="folder.is_favorite"
              name="mdi:star"
              class="w-4 h-4 text-yellow-400 shrink-0"
            />
          </div>

          <!-- Mobile-only action button -->
          <button
            class="p-2 md:hidden rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            @click.stop="toggleActions(folder.id)"
          >
            <Icon
              name="mdi:dots-vertical"
              class="w-4 h-4"
            />
          </button>
        </div>

        <p class="mt-2 text-sm text-muted-foreground">
          {{ bookmarkStore.getBookmarkCount(folder.id) }} bookmarks
        </p>

        <!-- Sliding Action Panel -->
        <div
          v-show="!editingFolderId || editingFolderId !== folder.id"
          class="absolute top-0 right-0 h-full w-1/3 bg-card shadow-lg transform transition-transform bg-primary-900 border-l border-color duration-200 translate-x-full group-hover:translate-x-0"
          :class="{ '!translate-x-0': activeActionsFolder === folder.id }"
        >
          <div class="grid grid-cols-2 items-center justify-center h-full gap-1 p-2">
            <!-- Color Selector -->
            <button
              class="w-full h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors p-2"
              @click.stop
            >
              <div
                class="w-full h-full rounded cursor-pointer"
                :style="{ backgroundColor: folder.color }"
              >
                <input
                  type="color"
                  :value="folder.color"
                  class="opacity-0 absolute w-full h-full"
                  @input="(e) => updateFolder(folder, { color: e.target.value })"
                />
              </div>
            </button>

            <!-- Other Actions -->
            <button
              v-for="action in getActions(folder)"
              :key="action.title"
              class="w-full h-full foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="action.buttonClass"
              @click.stop="action.handler(folder)"
              :title="action.title"
            >
              <Icon
                :name="action.icon"
                class="w-4 h-4"
                :class="action.iconClass"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types/folder'

const folderStore = useFolderStore()
const bookmarkStore = useBookmarkStore()
const { handleFolderSelect, currentFolder } = useBookmarkView()
const { getFeatureUsage } = usePlan()

const editingFolderId = ref<string | null>(null)
const editingName = ref('')
const editInput = ref<HTMLInputElement | null>(null)
const activeActionsFolder = ref<string | null>(null)
const showNewFolderModal = ref(false)

const folderUsage = computed(() => getFeatureUsage('BOOKMARK_FOLDERS', folderStore.folders.length))

// Start editing folder name
const startEdit = (folder: Folder) => {
  activeActionsFolder.value = null // Hide action panel
  editingFolderId.value = folder.id
  editingName.value = folder.name
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus()
      editInput.value.select() // Auto select the text
    }
  })
}

// Save edited name
const saveEdit = async (folder: Folder) => {
  if (editingName.value.trim() && editingName.value !== folder.name) {
    await updateFolder(folder, { name: editingName.value })
  }
  editingFolderId.value = null
}

// Cancel editing
const cancelEdit = () => {
  editingFolderId.value = null
}

// Update folder with new data
const updateFolder = async (folder: Folder, data: Partial<Folder>) => {
  try {
    await folderStore.updateFolder(folder.id, data)
  } catch (error) {
    console.error('Error updating folder:', error)
  }
}

const getActions = (folder: Folder) => {
  const baseActions = [
    {
      title: 'Edit Name',
      icon: 'mdi:pencil',
      handler: startEdit,
      buttonClass: '',
      iconClass: '',
    },
    {
      title: 'Toggle Favorite',
      icon: folder.is_favorite ? 'mdi:star' : 'mdi:star-outline',
      handler: toggleFavorite,
      buttonClass: '',
      iconClass: folder.is_favorite ? 'text-yellow-400' : '',
    },
  ]

  if (!folder.is_default) {
    baseActions.push({
      title: 'Delete',
      icon: 'mdi:trash',
      handler: handleDelete,
      buttonClass: 'text-red-500',
      iconClass: '',
    })
  }

  return baseActions
}

const toggleActions = (folderId: string) => {
  activeActionsFolder.value = activeActionsFolder.value === folderId ? null : folderId
}

const toggleFavorite = async (folder: Folder) => {
  await folderStore.updateFolder(folder.id, {
    is_favorite: !folder.is_favorite,
  })
}

const handleDelete = async (folder: Folder) => {
  const success = await folderStore.deleteFolder(folder.id)
  if (success) {
    if (currentFolderId.value === folder.id) {
      currentFolderId.value = null
    }
    await bookmarkStore.fetchBookmarks()
    activeActionsFolder.value = null
  }
}

// Close active actions panel when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    // If clicking outside folder card
    if (!target.closest('.folder-card')) {
      activeActionsFolder.value = null
      if (editingFolderId.value) {
        cancelEdit()
      }
    }
  })

  try {
    folderStore.fetchFolders()
    bookmarkStore.fetchBookmarks()
  } catch (error) {
    console.error('Error initializing data:', error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', () => {})
})
</script>
