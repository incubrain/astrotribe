<script setup lang="ts">
import { ref, onMounted } from 'vue'

const files = ref([])
const selectedFile = ref('')
const fileContent = ref('')

onMounted(async () => {
  await loadFiles()
})

const loadFiles = async () => {
  try {
    const response = await $fetch('/api/list-files')
    files.value = response.files
  } catch (error) {
    console.error('Error loading files:', error)
  }
}

const viewFile = async (fileName: string) => {
  try {
    const response = await $fetch('/api/view-file', {
      method: 'POST',
      body: { fileName },
    })
    selectedFile.value = fileName
    fileContent.value = response.content
  } catch (error) {
    console.error('Error viewing file:', error)
    fileContent.value = 'Error loading file content'
  }
}
</script>

<template>
  <div class="file-viewer">
    <h2>File Viewer</h2>
    <div class="file-list">
      <ul>
        <li
          v-for="file in files"
          :key="file.name"
        >
          <span @click="viewFile(file.name)">{{ file.name }}</span>
          <span>({{ file.size }} bytes)</span>
        </li>
      </ul>
    </div>
    <div
      v-if="selectedFile"
      class="file-content"
    >
      <h3>{{ selectedFile }}</h3>
      <pre>{{ fileContent }}</pre>
    </div>
  </div>
</template>

<style scoped>
.file-viewer {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
}
.file-list ul {
  list-style-type: none;
  padding: 0;
}
.file-list li {
  cursor: pointer;
  margin-bottom: 5px;
}
.file-list li:hover {
  text-decoration: underline;
}
.file-content {
  margin-top: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}
</style>
