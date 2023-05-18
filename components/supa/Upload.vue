<template>
  <div class="example-avatar flex flex-col gap-4 justify-center items-center w-full h-full">
    <div
      v-show="imageSrc"
      class="my-4 w-1/2 aspect-ratio object-fill mx-auto border-4 border-stone-700 rounded-full"
    >
      <img
        :src="destination"
        class="block w-full rounded-full"
      />
    </div>
    <div
      v-show="imageSrc"
      class="my-2 w-1/2 aspect-ratio object-fill mx-auto"
    >
      <img
        ref="img"
        class="block w-full aspect-auto max-w-full pb-4"
        :src="imageSrc"
      />
    </div>
    <div class="flex justify-center w-full content-end mt-2 bg-white rounded-md py-2">
      <v-btn
        v-if="!imageSrc"
        color="primary"
        @click="imageInput.click()"
      >
        <slot />
      </v-btn>
      <v-btn
        v-else
        color="primary"
        class="w-32 mx-2"
        @click="handleImageCropped"
      >
        Update
      </v-btn>
      <v-btn
        v-if="imageSrc"
        color="primary"
        class="w-32 mx-2"
        @click="fileCleared"
      >
        Cancel
      </v-btn>
      <input
        ref="imageInput"
        type="file"
        accept=".jpg,.jpeg,.png"
        class="py-4"
        :style="{ display: 'none' }"
        @change="fileChanged"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs'

const { upload } = useStorage()

const props = defineProps({
  uploadType: {
    type: String as PropType<string>,
    required: true
  }
})

const imageInput = ref(null) // template ref for file input
const selectedFile = ref(null)
const imageSrc = ref(null)
const img = ref(null)
const cropper = ref({})
const destination = ref(null)

const fileReader = new FileReader()
fileReader.onload = (event) => {
  imageSrc.value = event.target.result
}
const handleImageCropped = () => {
  cropper.value
    .getCroppedCanvas({
      width: 180,
      height: 180
    })
    .toBlob((blob) => {
      console.log(blob)
      upload.avatar({ file: blob, userId, type: props.uploadType }) // !todo auth user, get id
    }, 'image/png')
  selectedFile.value = null
}
const fileChanged = (e) => {
  const files = e.target.files || e.dataTransfer.files
  if (files.length) {
    selectedFile.value = files[0]
  }
}
const fileCleared = (_) => {
  selectedFile.value = null
}

onMounted(() => {
  cropper.value = new Cropper(img.value, {
    aspectRatio: 1,
    zoomable: true,
    zoomOnWheel: true,
    minCropBoxWidth: 180,
    minCropBoxHeight: 180,
    viewMode: 3,
    dragMode: 'crop',
    background: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    preview: '.preview',
    crop() {
      console.log(cropper.value.getCroppedCanvas())
      const canvas = cropper.value.getCroppedCanvas()
      destination.value = canvas.toDataURL('image/jpeg')
      // Crop
      // console.log(crop.baseURI)

      // Round
      // const roundedImage = document.createElement('img')
      // roundedImage.src = crop.baseURI
      // result.innerHTML = '';
      // result.appendChild(roundedImage)
    }
  })
})
onUnmounted(() => {
  cropper.value.destroy()
})
watchEffect(() => {
  if (selectedFile.value) {
    fileReader.readAsDataURL(selectedFile.value)
  } else {
    imageSrc.value = null
  }
})
watch(
  imageSrc,
  () => {
    if (imageSrc.value) {
      cropper.value.replace(imageSrc.value)
    }
  },
  {
    flush: 'post' // watch runs after component updates
  }
)
</script>

<style scoped>
.preview {
  border: 5px solid #292929;
  overflow: hidden;
  width: 50px;
  height: 50px;
}

.example-avatar .avatar-upload .rounded-circle {
  width: 200px;
  height: 200px;
}

.example-avatar .text-center .btn {
  margin: 0 0.5rem;
}

.example-avatar .avatar-edit-image {
  max-width: 100%;
}

.example-avatar .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}

.example-avatar .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
