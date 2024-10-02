<script setup lang="ts">
import { useFileUpload } from '../../../layers/crud/composables/upload'

const user = useSupabaseUser()

const {
  uploadFile,
  queueUpload,
  cancelUpload,
  clearQueue,
  isUploading,
  isProcessing,
  uploadProgress,
  currentUpload,
  uploadQueue,
} = useFileUpload()

const buckets = [
  { name: 'user-profiles', label: 'User Profiles' },
  { name: 'public-assets', label: 'Public Assets' },
  { name: 'private-documents', label: 'Private Documents' },
]

const paths = {
  'user-profiles': ['avatars', 'cover-photos', 'galleries'],
  'public-assets': ['blog-images', 'marketing-materials'],
  'private-documents': ['user-uploads'],
}

const fileTypes = [
  { name: 'avatar', label: 'Avatar' },
  { name: 'cover-photo', label: 'Cover Photo' },
  { name: 'gallery-image', label: 'Gallery Image' },
  { name: 'document', label: 'Document' },
  { name: 'other', label: 'Other' },
]

const bucket = ref(buckets[0].name)
const path = ref(paths[bucket.value][0])
const fileType = ref(fileTypes[0].name)

const maxFileSize = ref(5 * 1024 * 1024) // 5MB

const allowedMimeTypes = ref(['image/*', 'application/pdf'])

const uploadedFiles = ref<any[]>([])

const onUpload = (event: any) => {
  uploadedFiles.value.push(...event.files)
}

const onSelect = (event: any) => {
  event.files.forEach((file: File) => {
    queueUpload(file, {
      bucket: bucket.value,
      path: path.value,
      fileType: fileType.value as any,
      userId: user.value?.id,
      optimizeImage: true,
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 80,
      format: 'webp',
      rateLimitMs: 1000,
      maxFileSize: maxFileSize.value,
      allowedMimeTypes: allowedMimeTypes.value,
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress}%`)
      },
      auditLog: async (action, details) => {
        console.log(action, details)
        // Implement your audit logging here
      },
    })
  })
}

const onRemove = (event: any) => {
  console.log('File removed:', event.file)
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const totalSize = computed(() => {
  return formatSize(uploadQueue.value.reduce((acc, file) => acc + file.size, 0))
})

const totalSizePercent = computed(() => {
  const total = uploadQueue.value.reduce((acc, file) => acc + file.size, 0)
  return (total / maxFileSize.value) * 100
})

const uploadEvent = (uploadCallback: () => void) => {
  uploadCallback()
}

const fileURL = (file: File) => URL.createObjectURL(file)

watch(bucket, (newBucket) => {
  path.value = paths[newBucket][0]
})
</script>

<template>
  <div class="p-4">
    <h2 class="mb-4 text-2xl font-bold"> File Uploads </h2>
    <div class="mb-4 flex flex-wrap gap-4">
      <span class="flex flex-col gap-2">
        <label
          for="bucket"
          class="pl-2"
          >Bucket</label
        >
        <PrimeSelect
          id="bucket"
          v-model="bucket"
          :options="buckets"
          option-label="label"
          option-value="name"
        />
      </span>
      <span class="flex flex-col gap-2">
        <label
          for="path"
          class="pl-2"
          >Path</label
        >
        <PrimeSelect
          id="path"
          v-model="path"
          :options="paths[bucket]"
        />
      </span>
      <span class="flex flex-col gap-2">
        <label
          for="fileType"
          class="pl-2"
          >File Type</label
        >
        <PrimeSelect
          id="fileType"
          v-model="fileType"
          :options="fileTypes"
          option-label="label"
          option-value="name"
        />
      </span>
    </div>
    <PrimeFileUpload
      name="demo[]"
      url="/api/upload"
      :multiple="true"
      accept="image/*,application/pdf"
      :max-file-size="maxFileSize"
      @upload="onUpload"
      @select="onSelect"
      @remove="onRemove"
    >
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <div class="flex flex-1 flex-wrap items-center justify-between gap-4">
          <div class="flex gap-2">
            <PrimeButton
              rounded
              outlined
              severity="contrast"
              @click="chooseCallback()"
            >
              <Icon
                name="mdi:file-image"
                size="32px"
              />
            </PrimeButton>
            <PrimeButton
              rounded
              outlined
              severity="success"
              :disabled="!files || files.length === 0"
              @click="uploadEvent(uploadCallback)"
            >
              <Icon
                name="mdi:cloud-upload"
                size="32px"
              />
            </PrimeButton>
            <PrimeButton
              rounded
              outlined
              severity="danger"
              :disabled="!files || files.length === 0"
              @click="clearCallback()"
            >
              <Icon
                name="mdi:delete"
                size="32px"
              />
            </PrimeButton>
          </div>
          <PrimeProgressBar
            :value="totalSizePercent"
            :show-value="false"
            class="md:w-20rem h-1 w-full md:ml-auto"
          >
            <span class="whitespace-nowrap">{{ totalSize }} / {{ formatSize(maxFileSize) }}</span>
          </PrimeProgressBar>
        </div>
      </template>
      <template #content="{ files, removeUploadedFileCallback, removeFileCallback }">
        <div class="flex flex-col gap-8 pt-4">
          <div v-if="files.length > 0">
            <h5>Pending</h5>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(file, index) of files"
                :key="file.name + file.type + file.size"
                class="flex flex-col items-center gap-4 border p-8 border-surface rounded-border"
              >
                <div>
                  <NuxtImg
                    v-if="file.type.startsWith('image/')"
                    role="presentation"
                    :alt="file.name"
                    :src="fileURL(file)"
                    width="100"
                    height="50"
                  />
                  <Icon
                    v-else
                    name="mdi:file"
                    class="text-4xl"
                  ></Icon>
                </div>
                <span
                  class="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
                  >{{ file.name }}</span
                >
                <div>{{ formatSize(file.size) }}</div>
                <PrimeBadge
                  value="Pending"
                  severity="warn"
                />
                <PrimeButton
                  icon="pi pi-times"
                  outlined
                  rounded
                  severity="danger"
                  @click="removeFileCallback(index)"
                />
              </div>
            </div>
          </div>
          <div v-if="uploadedFiles.length > 0">
            <h5>Completed</h5>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(file, index) of uploadedFiles"
                :key="file.name + file.type + file.size"
                class="flex flex-col items-center gap-4 border p-8 border-surface rounded-border"
              >
                <div>
                  <NuxtImg
                    v-if="file.type.startsWith('image/')"
                    role="presentation"
                    :alt="file.name"
                    :src="fileURL(file)"
                    width="100"
                    height="50"
                  />
                  <Icon
                    v-else
                    name="mdi:cloud-upload"
                    class="text-4xl"
                  ></Icon>
                </div>
                <span
                  class="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
                  >{{ file.name }}</span
                >
                <div>{{ formatSize(file.size) }}</div>
                <PrimeBadge
                  value="Completed"
                  class="mt-4"
                  severity="success"
                />
                <PrimeButton
                  outlined
                  rounded
                  severity="danger"
                  @click="removeUploadedFileCallback(index)"
                >
                  <Icon name="mdi:delete" />
                </PrimeButton>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex flex-col items-center justify-center">
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full border-2 bg-primary-500 text-white"
          >
            <Icon
              name="mdi:cloud-upload"
              size="48px"
            />
          </div>
          <p class="mb-0 mt-6"> Drag and drop files here to upload. </p>
        </div>
      </template>
    </PrimeFileUpload>
  </div>
</template>
