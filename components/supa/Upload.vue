<template>
    <div class="example-avatar bg-white p-12 w-full h-full">
        <div v-show="imageSrc" class="my-2 w-64 h-64 object-fill mx-auto">
            <img class="block max-w-full" ref="img" :src="imageSrc" />
        </div>
        <div class="flex justify-center content-end mt-2">
            <button
                v-if="!imageSrc"
                class="btn btn-blue w-32 mx-2"
                @click="imageInput.click()"
            >
                New Image
            </button>
            <button
                v-else
                class="btn btn-blue w-32 mx-2"
                @click="handleImageCropped"
            >
                Update
            </button>
            <button
                button
                v-if="imageSrc"
                class="btn btn-gray w-32 mx-2"
                @click="fileCleared"
            >
                Cancel
            </button>
            <input
                type="file"
                ref="imageInput"
                accept=".jpg,.jpeg,.png"
                @change="fileChanged"
                :style="{ display: 'none' }"
            />
        </div>
        <div v-if="selectedFile" class="my-2 align-baseline text-center">
            <span>Selected File: </span>
            <span>{{ selectedFile.name }}</span>
        </div>
        <!-- <div class="text-center p-2">
                <file-upload
                    extensions="gif,jpg,jpeg,png,webp"
                    accept="image/png,image/gif,image/jpeg,image/webp"
                    name="avatar"
                    class="px-12 py 4 bg-slate-200"
                    post-action="/upload/post"
                    :drop="!edit"
                    v-model="files"
                    @input-filter="inputFilter"
                    @input-file="inputFile"
                    ref="upload"
                >
                    Upload avatar
                </file-upload>
            </div> -->

        <!-- <div class="avatar-edit" v-if="files?.length && edit">
            <p>{{ files }}</p>
            <div class="avatar-edit-image">
                <img ref="editImage" :src="files[0].url" />
            </div>
            <div class="text-center p-4 bg-gray-300">
                <button
                    type="button"
                    class="bg-blue-100 px-12 py-4 rounded-md shadow-md"
                    @click.prevent="upload.clear"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="bg-gray-100 px-12 py-4 rounded-md shadow-md"
                    @click="editSave"
                >
                    Save
                </button>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import Cropper from 'cropperjs'

const { upload } = useStorage()

const imageInput = ref(null) // template ref for file input
const selectedFile = ref(null)
const imageSrc = ref(null)
const img = ref(null)
const fileReader = new FileReader()
let cropper = null
fileReader.onload = (event) => {
    imageSrc.value = event.target.result
}
const handleImageCropped = () => {
    cropper
        .getCroppedCanvas({
            width: 256,
            height: 256,
        })
        .toBlob((blob) => {
            console.log(blob)
            upload.single(blob, '9465747a-47a0-46ac-93a7-5151e62b8eff', true)
        }, 'image/jpeg')
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
    cropper = new Cropper(img.value, {
        aspectRatio: 1,
        minCropBoxWidth: 256,
        minCropBoxHeight: 256,
        viewMode: 3,
        dragMode: 'move',
        background: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
    })
})
onUnmounted(() => {
    cropper.destroy()
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
            cropper.replace(imageSrc.value)
        }
    },
    {
        flush: 'post', // watch runs after component updates
    }
)
</script>

<style scoped>
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
