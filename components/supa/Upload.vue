<template>
    <div class="example-avatar bg-white p-12">
        <div
            v-show="upload && upload.dropActive"
            class="drop-active p-16 bg-green-200 w-100 h64"
        >
            <h3>Drop files to upload</h3>
        </div>
        <div class="avatar-upload" v-show="!edit">
            <div class="text-center p-2">
                <label for="avatar">
                    <img
                        :src="
                            files?.length
                                ? files[0].url
                                : 'https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm'
                        "
                        class="rounded-full"
                    />
                    <h4 class="pt-2">or<br />Drop files anywhere to upload</h4>
                </label>
            </div>
            <div class="text-center p-2">
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
            </div>
        </div>

        <div class="avatar-edit" v-show="files?.length && edit">
            <div class="avatar-edit-image" v-if="files?.length">
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
        </div>
    </div>
</template>

<script setup>
import Cropper from 'cropperjs'
import * as FileUpload from 'vue-upload-component'

const { getUser } = useData()
const { uploadFile } = useStorage()

const user = await getUser()

const files = ref([])
const upload = ref({})
const edit = ref(false)
const editImage = ref()
const crop = ref(false)

onMounted(() => {
    watch(
        () => edit.value,
        (value) => {
            if (value) {
                nextTick(() => {
                    if (!editImage.value) {
                        return
                    }
                    let cropNew = new Cropper(editImage.value, {
                        aspectRatio: 1 / 1,
                        viewMode: 1,
                    })
                    crop.value = cropNew
                })
            } else {
                if (crop.value) {
                    crop.value.destroy()
                    crop.value = false
                }
            }
        }
    )
})

function editSave() {
    edit.value = false

    let oldFile = files.value[0]

    let binStr = atob(
        crop.value.getCroppedCanvas().toDataURL(oldFile.type).split(',')[1]
    )
    let arr = new Uint8Array(binStr.length)
    for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i)
    }

    let file = new File([arr], oldFile.name, { type: oldFile.type })

    uploadFile(file, user.id, true)

    // upload.value.update(oldFile.id, {
    //   file,
    //   type: file.type,
    //   size: file.size,
    //   active: true,
    // })
}

function alert(message) {
    alert(message)
}

function inputFile(newFile, oldFile) {
    if (newFile && !oldFile) {
        nextTick(() => {
            edit.value = true
        })
    }
    if (!newFile && oldFile) {
        edit.value = false
    }
}

function inputFilter(newFile, oldFile, prevent) {
    if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
            alert('Your choice is not a picture')
            return prevent()
        }
    }

    if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
            newFile.url = URL.createObjectURL(newFile.file)
        }
    }
}
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
