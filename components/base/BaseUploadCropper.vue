<script setup lang="ts">
import type { CropperResult, ImageTransforms } from 'vue-advanced-cropper'
import { Cropper, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

type CropperConfigTypes = 'avatar' | 'cover_image' | 'default'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const uploadInput = ref(null as HTMLInputElement | null)
const image = ref<string>('')

const props = defineProps({
  cropperType: {
    type: String as PropType<CropperConfigTypes>,
    required: true
  }
})

// from other file

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
      maxWidth: 480
    },
    stencilProps: {
      aspectRatio: 1,
      movable: true
    }
  },
  avatar: {
    name: 'avatar',
    minHeight: 160,
    minWidth: 160,
    canvas: {
      minHeight: 0,
      minWidth: 0,
      maxHeight: 480,
      maxWidth: 480
    },
    stencilProps: {
      aspectRatio: 1,
      movable: true
    }
  },
  cover_image: {
    name: 'cover_image',
    minWidth: 1300,
    minHeight: 400,
    canvas: {
      minHeight: 0,
      minWidth: 0,
      maxWidth: 1200,
      maxHeight: 3900
    },
    stencilProps: {
      aspectRatio: 3.25,
      movable: true
    }
  }
}

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
        'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
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

const userStore = useCurrentUser()
const { userId } = storeToRefs(userStore)

function convertThenUploadImage(canvas: HTMLCanvasElement, mimeType: string) {
  return canvas.toBlob(
    (blob) => {
      if (!blob) {
        setError('Failed to convert canvas to blob.')
        return
      }
      userStore.uploadImage(props.cropperType, blob)
    },
    mimeType,
    1
  )
}

// Cropper
const cropper = ref(null as typeof Cropper | null)
const crop = (toggleModalOpen: () => void) => {
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

  convertThenUploadImage(canvas, exportMimeType)
  toggleModalOpen()
}

const preview = reactive<CropperResult>({
  image: {
    width: 0,
    height: 0,
    transforms: {} as ImageTransforms,
    src: null
  },
  visibleArea: {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  },
  coordinates: {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  }
})

function onChange({ coordinates, image, canvas }: CropperResult) {
  // realtime changes in the cropper
  if (!coordinates || !image) return

  preview.coordinates = coordinates
  preview.image = image
}

// original file
type CropperConfigDimensions = {
  [key in CropperConfigTypes]: { minWidth: number; minHeight: number }
}

function checkImageDimensions(imageSrc: string, cropperType: CropperConfigTypes): Promise<boolean> {
  const dimensions: CropperConfigDimensions = {
    default: { minWidth: 800, minHeight: 600 },
    avatar: { minWidth: 160, minHeight: 160 },
    cover_image: { minWidth: 1300, minHeight: 400 }
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
          `Image dimensions must be at least ${minWidth}x${minHeight}px for ${cropperType}. (dimensions ${img.width}x${img.height})`
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

async function handleFileChange(e: Event, toggleModalOpen: () => void) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]

  if (!validateFileSize(file.size)) {
    return
  }

  try {
    console.log('readFileAsDataURL', file)
    image.value = await readFileAsDataURL(file)
    if (!(await checkImageDimensions(image.value, props.cropperType))) {
      return
    }
    toggleModalOpen()
  } catch (error: any) {
    setError(`An error occurred while reading the file: ${error.message}`)
  } finally {
    // reset the input value
    if (input) input.value = ''
  }
}

// Errors
const toast = useNotification()
const setError = (error: string) => {
  // probably a notification

  toast.error({
    summary: 'Uploading image',
    message: error
  })
}
</script>

<template>
  <div class="space-y-24">
    <BaseModal>
      <template #button="{ toggleModalOpen }">
        <label
          v-ripple
          :for="`myFile-${cropperType}`"
          class="border border-color bg-primary-600 rounded-lg px-2 py-1 text-sm"
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
        <h2 class="text-xl font-semibold">Crop your image</h2>
      </template>
      <template #modal:default>
        <Cropper
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
      </template>
      <template #modal:footer="{ toggleModalOpen }">
        <div class="flex gap-4 justify-center items-center">
          <p>Image preview</p>
          <Preview
            v-if="preview.image && config.minWidth"
            class="rounded-full"
            :width="Math.floor(config.minWidth / 3)"
            :height="Math.floor(config.minHeight / 3)"
            :image="preview.image"
            :coordinates="preview.coordinates"
          />
          <PrimeButton @click="crop(toggleModalOpen)"> Crop </PrimeButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped></style>
