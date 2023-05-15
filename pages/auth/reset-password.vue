<template>
  <div
    class="w-full h-full p-20 text-black gap-4 justify-center items-center bg-indigo-50 animate-swipe-down"
  >
    <p>reset value: {{ showForm }}</p>
    <form v-if="showForm">
      <div class="flex flex-col">
        <label for="password">Password</label>
        <input v-model="newPass.a" type="password" />
      </div>
      <div class="flex flex-col">
        <label for="password">Confirm Password</label>
        <input v-model="newPass.b" type="password" />
      </div>
      <div class="flex flex-col">
        <button @click="updatePassword">
          Reset Password
        </button>
      </div>
    </form>
    <div v-else>
      <form>
        <div class="flex flex-col">
          <label for="email">Confirm Email</label>
          <input v-model="email" type="email" />
        </div>
      </form>
      <button class="px-12 py-4 rounded-sm bg-red-100 shadow-sm mt-2" @click="password.requestResetEmail(email)">
        Request Password Email
      </button>
    </div>
    <button class="px-12 py-4 rounded-sm bg-red-100 shadow-sm mt-2" @click="password.toggleResetForm(!showResetForm)">
      test form visible
    </button>
  </div>
</template>

<script setup lang="ts">

const email = ref()
const showForm = ref(false)
const newPass = ref({
  a: '',
  b: ''
})

const { password, showResetForm } = useAuth()

watch(() => showResetForm.value, () => (showForm.value = showResetForm.value))

const updatePassword = async () => {
  if (newPass.value.a === newPass.value.b) {
    const { data, error } = await password.update(newPass.value.a)
    if (error) throw createError('plase make sure your passwords match')
    console.log('data retunred', data)
  }
}

definePageMeta({
  layout: 'auth',
  name: 'Reset Password'
})
</script>

<style scoped></style>
