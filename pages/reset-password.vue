<template>
    <div
        class="w-full h-full p-20 text-black gap-4 justify-center items-center"
    >
        <p>reset value: {{ showForm }}</p>
        <form v-if="showForm">
            <div class="flex flex-col">
                <label for="password">Password</label>
                <input type="password" v-model="newPass.a" />
            </div>
            <div class="flex flex-col">
                <label for="password">Confirm Password</label>
                <input type="password" v-model="newPass.b" />
            </div>
            <div class="flex flex-col">
                <button @click="updatePassword">Reset Password</button>
            </div>
        </form>
        <div v-else>
            <form>
                <div class="flex flex-col">
                    <label for="email">Confirm Email</label>
                    <input type="email" v-model="email" />
                </div>
            </form>
            <button @click="password.requestResetEmail(email)" class="px-12 py-4 rounded-sm bg-red-100 shadow-sm mt-2">
                Request Password Email
            </button>
        </div>
        <button @click="password.toggleResetForm(!showResetForm)" class="px-12 py-4 rounded-sm bg-red-100 shadow-sm mt-2">
            test form visible
        </button>
    </div>
</template>

<script setup lang="ts">
import publicClient from '../composables/supabase/publicClient'
const client = publicClient()
const router = useRouter()


const email = ref()
const showForm = ref(false)
const newPass = ref({
    a: '',
    b: '',
})

const { password, showResetForm } = useAuth()
0
watch(() => showResetForm.value, () => showForm.value = showResetForm.value)

const updatePassword = async () => {
    if (newPass.value.a === newPass.value.b) {
        const { data, error } = await password.update(newPass.value.a)
        if (error) throw createError('plase make sure your passwords match')
        console.log('data retunred', data)
    }
}
</script>

<style scoped></style>
