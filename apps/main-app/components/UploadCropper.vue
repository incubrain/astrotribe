<script setup lang="ts">
import type { CropperResult, ImageTransforms } from 'vue-advanced-cropper'
import { Cropper, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useFileUpload } from '../../../layers/base/composables/upload'
import { useNotification } from '../../../layers/base/composables/notification'
import { useCurrentUser } from '../../../layers/base/composables/user.current.store'

type CropperConfigTypes = 'avatar' | 'default'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const uploadInput = ref(null as HTMLInputElement | null)
const image = ref<string>('')

const props = defineProps({
  cropperType: {
    type: String as PropType<CropperConfigTypes>,
    required: true,
  },
  bucket: {
    type: String,
    required: false,
    default: 'profile',
  },
  path: {
    type: String,
    required: true,
  },
  requireCropping: {
    type: Boolean,
    default: true,
  },
})

const config = computed(() => cropperConfigs[props.cropperType])

export interface CropperConfig {
  name: string
  minHeight: number
  minWidth: number
  maxHeight?: number
  maxWidth?: number
  stencilComponent?: string
  canvas: {
    minWidth: number
    minHeight: number
    maxWidth: number
    maxHeight: number
  }
  stencilSize?: {
    width: number
    height: number
  }
  stencilProps: {
    handlers?: Record<string, any>
    movable: boolean
    resizable?: boolean
    aspectRatio?: number
  }
}

const cropperConfigs: Record<CropperConfigTypes, CropperConfig> = {
  default: {
    name: 'Default',
    minWidth: 160,
    minHeight: 160,
    canvas: {
      minHeight: 0,
      minWidth: 0,
      maxHeight: 480,
      maxWidth: 480,
    },
    stencilProps: {
      aspectRatio: 1,
      movable: true,
    },
  },
  avatar: {
    name: 'avatar',
    minHeight: 160,
    minWidth: 160,
    canvas: {
      minHeight: 0,
      minWidth: 0,
      maxHeight: 480,
      maxWidth: 480,
    },
    stencilProps: {
      aspectRatio: 1,
      movable: true,
    },
  },
}
const { uploadFile, isUploading, uploadProgress } = useFileUpload()
const userStore = useCurrentUser()
const { userId } = storeToRefs(userStore)
const toast = useNotification()

// Checks & Utils
type Compression = 'lossy' | 'lossless' | 'alpha' | 'animation'
function checkWebpFeature(feature: Compression): Promise<boolean> {
  return new Promise((resolve) => {
    const kTestImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha:
        'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation:
        'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    }

    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = 'data:image/webp;base64,' + kTestImages[feature]
  })
}

const webpSupport = ref(false)
onMounted(async () => {
  for (const feature of ['lossy', 'lossless', 'alpha', 'animation'] as Compression[]) {
    const result = await checkWebpFeature(feature)
    if (result) {
      webpSupport.value = true
      break
    }
  }
})

async function uploadImage(blob: Blob) {
  try {
    const result = await uploadFile(new File([blob], 'image.webp', { type: 'image/webp' }), {
      bucket: props.bucket,
      fileType: 'image',
      userId: userId.value,
      serverSideOptimize: true,
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 90,
      format: 'webp',
      maxFileSize: MAX_FILE_SIZE,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress}%`)
      },
    })
    toast.success({
      summary: 'Image uploaded',
      message: 'Your image has been successfully uploaded and processed.',
    })
    return result
  } catch (error: any) {
    setError(`Failed to upload image: ${error.message}`)
    throw error
  }
}

// Cropper
const cropper = ref(null as typeof Cropper | null)
const crop = async (toggleModalOpen: () => void) => {
  if (!cropper.value) {
    setError('No cropper instance in crop function.')
    toggleModalOpen()
    return
  }

  const { canvas } = cropper.value.getResult()
  if (!canvas) {
    setError('Cropper failed to get canvas')
    toggleModalOpen()
    return
  }

  const exportMimeType = webpSupport.value ? 'image/webp' : 'image/jpeg'

  canvas.toBlob(
    async (blob) => {
      if (!blob) {
        setError('Failed to convert canvas to blob.')
        return
      }
      try {
        await uploadImage(blob)
        toggleModalOpen()
      } catch (error) {
        console.error('Error uploading cropped image:', error)
      }
    },
    exportMimeType,
    0.9,
  )
}

async function handleFileChange(e: Event, toggleModalOpen: () => void) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]

  if (!validateFileSize(file.size)) {
    return
  }

  try {
    if (props.requireCropping) {
      image.value = await readFileAsDataURL(file)
      if (!(await checkImageDimensions(image.value, props.cropperType))) {
        return
      }
      toggleModalOpen()
    } else {
      await uploadImage(file)
    }
  } catch (error: any) {
    setError(`An error occurred while processing the file: ${error.message}`)
  } finally {
    if (input) input.value = ''
  }
}

const preview = reactive<CropperResult>({
  image: {
    width: 0,
    height: 0,
    transforms: {} as ImageTransforms,
    src: null,
  },
  visibleArea: {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  },
  coordinates: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
})

function onChange({ coordinates, image, canvas }: CropperResult) {
  // realtime changes in the cropper
  if (!coordinates || !image) return

  preview.coordinates = coordinates
  preview.image = image
}

// original file
type CropperConfigDimensions = {
  [key in CropperConfigTypes]: { minWidth: number, minHeight: number }
}

function checkImageDimensions(imageSrc: string, cropperType: CropperConfigTypes): Promise<boolean> {
  const dimensions: CropperConfigDimensions = {
    default: { minWidth: 800, minHeight: 600 },
    avatar: { minWidth: 160, minHeight: 160 },
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const { minWidth, minHeight } = dimensions[cropperType]
      console.log('cropper mins', minHeight, minWidth, img.width, img.height)
      if (img.width >= minWidth && img.height >= minHeight) {
        resolve(true)
      } else {
        setError(
          `Image dimensions must be at least ${minWidth}x${minHeight}px for ${cropperType}. (dimensions ${img.width}x${img.height})`,
        )
        resolve(false)
      }
    }
    img.onerror = () => {
      setError('Failed to load image for dimension check.')
      resolve(false)
    }
    img.src = imageSrc
  })
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.onerror = () => {
      setError(`Failed to read the file: ${reader.error?.message}`)
      reject(new Error(`Failed to read the file: ${reader.error?.message}`))
    }

    reader.readAsDataURL(file)
  })
}

function validateFileSize(fileSize: number): boolean {
  if (fileSize > MAX_FILE_SIZE) {
    setError('File is too large. Please select a file smaller than 5MB.')
    return false
  }
  return true
}

const setError = (error: string) => {
  toast.error({
    summary: 'Error',
    message: error,
  })
}
</script>

<template>
  <div class="space-y-24">
    <IBModal>
      <template #button="{ toggleModalOpen }">
        <label
          v-ripple
          :for="`myFile-${cropperType}`"
          class="border-color bg-primary-600 rounded-lg border px-2 py-1 text-sm"
        >
          Upload {{ cropperType }}
        </label>
        <input
          :id="`myFile-${cropperType}`"
          ref="uploadInput"
          type="file"
          accept="image/jpg, image/jpeg, image/png, image/webp"
          name="filename"
          class="hidden"
          @change="handleFileChange($event, toggleModalOpen)"
        />
      </template>
      <template #modal:header>
        <h2 class="text-xl font-semibold"> Crop your image </h2>
      </template>
      <template #modal:default>
        <Cropper
          v-if="requireCropping"
          ref="cropper"
          :src="image"
          :min-width="config.minWidth"
          :min-height="config.minHeight"
          :canvas="config.canvas"
          :stencil-props="config.stencilProps"
          :debounce="false"
          @change="onChange"
          @error="setError('error loading image')"
        />
        <div
          v-else-if="isUploading"
          class="text-center"
        >
          <p>Uploading: {{ uploadProgress }}%</p>
          <PrimeProgressBar :value="uploadProgress" />
        </div>
      </template>
      <template #modal:footer="{ toggleModalOpen }">
        <div
          v-if="requireCropping"
          class="flex items-center justify-center gap-4"
        >
          <p>Image preview</p>
          <Preview
            v-if="preview.image && config.minWidth"
            class="rounded-full"
            :width="Math.floor(config.minWidth / 3)"
            :height="Math.floor(config.minHeight / 3)"
            :image="preview.image"
            :coordinates="preview.coordinates"
          />
          <PrimeButton
            :disabled="isUploading"
            @click="crop(toggleModalOpen)"
          >
            {{ isUploading ? 'Uploading...' : 'Crop & Upload' }}
          </PrimeButton>
        </div>
      </template>
    </IBModal>
  </div>
</template>

<style scoped></style>
