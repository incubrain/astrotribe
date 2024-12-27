<script setup lang="ts">
const props = defineProps({
  uploadType: {
    type: String as PropType<string>,
    required: true,
  },
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
      height: 180,
    })
    .toBlob((blob) => {
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

onMounted(() => {})

onUnmounted(() => {})

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
    flush: 'post', // watch runs after component updates
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full gap-4 example-avatar">
    <div
      v-show="imageSrc"
      class="object-fill w-1/2 mx-auto my-4 border-4 rounded-full aspect-ratio border-stone-700"
    >
      <img
        :src="destination"
        class="block w-full rounded-full"
      />
    </div>
    <div
      v-show="imageSrc"
      class="object-fill w-1/2 mx-auto my-2 aspect-ratio"
    >
      <img
        ref="img"
        class="block w-full max-w-full pb-4 aspect-auto"
        :src="imageSrc"
      />
    </div>
    <div class="flex content-end justify-center w-full py-2 mt-2 rounded-md">
      <PrimeButton
        v-if="!imageSrc"
        color="primary"
        @click="imageInput.click()"
      >
        <slot />
      </PrimeButton>
      <PrimeButton
        v-else
        color="primary"
        class="w-32 mx-2"
        @click="handleImageCropped"
      >
        Update
      </PrimeButton>
      <PrimeButton
        v-if="imageSrc"
        color="primary"
        class="w-32 mx-2"
        @click="fileCleared"
      >
        Cancel
      </PrimeButton>
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
