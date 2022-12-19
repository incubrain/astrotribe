<template>
    <div
        class="w-full h-full p-20 text-black gap-4 justify-center items-center"
    >
        <form v-if="password.showResetForm">
            <div class="flex flex-col">
                <label for="password">Password</label>
                <input type="password" v-model="newPass.a" />
            </div>
            <div class="flex flex-col">
                <label for="password">Confirm Password</label>
                <input type="password" v-model="newPass.b" />
            </div>
            <div class="flex flex-col">
                <button @click="changePass">Reset Password</button>
            </div>
        </form>
        <div v-else>
            <form>
                <div class="flex flex-col">
                    <label for="email">Confirm Email</label>
                    <input type="email" v-model="email" />
                </div>
            </form> 
            <button @click="password.requestResetEmail(email)">
                Request Password Email
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
const email = ref()
const newPass = ref({
    a: '',
    b: '',
})

const {
    password,
    event,
} = useAuth()

event.handlePasswordReset

console.log('test', password.showResetForm.value)

const changePass = async () => {
    if (newPass.value.a === newPass.value.b) {
      const { data, error} = await password.update(newPass.value.a)
      if (error) throw createError('plase make sure your passwords match')
      console.log('data retunred', data)
      return await navigateTo('/')
    } 
}

</script>

<style scoped></style>
