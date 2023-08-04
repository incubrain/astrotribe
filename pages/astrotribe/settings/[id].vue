<template>
  <div v-if="haveUser">
    <form
      :key="userCurrent.id"
      method="POST"
      @submit.prevent="updateUser"
    >
      <div
        class="w-full dark:bg-[#18181B] rounded-lg mx-auto mt-8 flex overflow-hidden rounded-b-none"
      >
        <div class="w-1/4 bg-gray-200 dark:bg-[#363636] p-8 hidden md:inline-block">
          <div class="flex items-center justify-center">
            <div
              class="text-gray-500 dark:text-white/80 text-xs font-bold rounded-lg float-left absolute cursor-pointer"
            >
              <UIcon
                name="i-material-symbols-add-a-photo"
                class="w-4 h-4 md:mt-12 cursor-pointer"
              />
              <!-- <input
                type="file"
                accept="image/*"
                name="avatar"
                id="avatar"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                v-bind="userCurrent.avatar"
              /> -->
            </div>
          </div>
          <h2 class="text-lg text-center font-semibold mb-4"
            >{{ userCurrent.given_name }} {{ userCurrent.surname }}</h2
          >

          <ul class="pt-2 pb-4 space-y-3 text-sm">
            <li
              class="dark:bg-transparent dark:text-gray-50 bg-white/40 hover:bg-gray-300 text-md md:text-lg font-base"
            >
              <NuxtLink class="flex items-center p-2 space-x-3 rounded-md">
                <UIcon
                  name="i-material-symbols-home"
                  class="md:w-6 md:h-6 w-4 h-4"
                />
                <span>Account</span>
              </NuxtLink>
            </li>
            <li class="dark:bg-transparent dark:text-gray-50 text-md md:text-lg font-base">
              <NuxtLink
                class="flex items-center p-2 space-x-3 rounded-md active:bg-white/40 cursor-not-allowed"
              >
                <UIcon
                  name="i-material-symbols-key"
                  class="md:w-6 md:h-6 w-4 h-4"
                />
                <span>Password</span>
              </NuxtLink>
            </li>
            <li class="dark:bg-transparent dark:text-gray-50 text-md md:text-lg font-base">
              <NuxtLink
                class="flex items-center p-2 space-x-3 rounded-md active:bg-white cursor-not-allowed"
              >
                <UIcon
                  name="i-material-symbols-lock"
                  class="md:w-6 md:h-6 w-4 h-4"
                />
                <span>Security</span>
              </NuxtLink>
            </li>
            <li class="dark:bg-transparent dark:text-gray-50 text-md md:text-lg font-base">
              <NuxtLink
                class="flex items-center p-2 space-x-3 rounded-md active:bg-white cursor-not-allowed"
              >
                <UIcon
                  name="i-material-symbols-laptop-mac-outline"
                  class="md:w-6 md:h-6 w-4 h-4"
                />
                <span>Application</span>
              </NuxtLink>
            </li>
            <li class="dark:bg-transparent dark:text-gray-50 text-md md:text-lg font-base">
              <NuxtLink
                class="flex items-center p-2 space-x-3 rounded-md active:bg-white cursor-not-allowed"
              >
                <UIcon
                  name="i-material-symbols-notifications"
                  class="md:w-6 md:h-6 w-4 h-4"
                />
                <span>Notifications</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="md:w-3/4 w-full">
          <h1 class="text-2xl font-bold text-gray-700 dark:text-white/80 px-6 mx-4 my-4 md:px-0"
            >Account Settings</h1
          >
          <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label
                for="given_name"
                class="block tracking-wide text-gray-700 dark:text-white/80 text-sm font-semibold mt-4"
                >First Name</label
              >
              <input
                class="appearance-none block w-full text-gray-700 bg-white/80 dark:bg-[#363636] dark:text-white/80 font-semibold rounded py-4 px-2 mb-2 leading-tight"
                v-model="userCurrent.given_name"
                type="text"
                id="given_name"
                disabled
              />
            </div>
            <div class="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label
                for="surname"
                class="block tracking-wide text-gray-700 dark:text-white/80 text-sm font-semibold mt-4"
                >Last Name</label
              >
              <input
                class="appearance-none block w-full text-gray-700 bg-white/80 dark:bg-[#363636] dark:text-white/80 font-semibold rounded py-4 px-2 mb-2 leading-tight"
                v-model="userCurrent.surname"
                type="text"
                id="surname"
                disabled
              />
            </div>
          </div>
          <div class="flex flex-wrap mb-4">
            <div class="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label
                for="email"
                class="block tracking-wide text-gray-700 dark:text-white/80 text-sm font-semibold mt-4"
                >Email</label
              >
              <input
                class="appearance-none block w-full text-gray-700 bg-white/80 dark:bg-[#363636] dark:text-white/80 font-semibold rounded py-4 px-2 mb-2 leading-tight"
                v-model="userCurrent.email"
                type="email"
                id="email"
                disabled
              />
            </div>
          </div>
          <div class="w-full px-3 mb-4 md:mb-0">
            <label
              for="introduction"
              class="block tracking-wide text-gray-700 dark:text-white/80 text-sm font-semibold mt-4"
              >Introduction</label
            >
            <input
              class="appearance-none block w-full text-gray-700 bg-white/80 dark:bg-[#363636] dark:text-white/80 font-semibold rounded py-4 px-2 mb-2 leading-tight"
              v-model="userCurrent.introduction"
              type="text"
              id="introduction"
              disabled
            />
          </div>
          <div class="w-full px-3 mb-4 md:mb-0">
            <label
              for="quote"
              class="block tracking-wide text-gray-700 dark:text-white/80 text-sm font-semibold mt-4"
              >Favourite Quote</label
            >
            <input
              v-model="userCurrent.quote"
              id="quote"
              class="appearance-none block w-full text-gray-700 bg-white/80 dark:bg-[#363636] dark:text-white/80 font-semibold rounded py-4 px-2 mb-2 leading-tight"
              type="text"
              disabled
            />
          </div>
          <UButton
            class="text-white text-sm font-medium px-6 py-2 ml-6 mr-6 my-4 rounded float-right uppercase cursor-pointer"
            type="submit"
            disabled
            >Update</UButton
          >
          <UButton
            class="text-white text-sm font-medium px-6 py-2 ml-6 mr-6 my-4 rounded float-right uppercase cursor-pointer"
            @click="edit"
            >Edit</UButton
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/useUsersStore'
const u = useUsersStore()
const { userCurrent } = storeToRefs(u)
const { id } = useRoute().params
const haveUser = ref(false)
const given_name = ref('')
const surname = ref('')
const email = ref('')
const introduction = ref('')
const quote = ref('')

// Displaying the user data in the input fields initially
async function fetchUserData() {
  const response = await fetch(`/api/users/${id}`)
  if (response.ok) {
    const user = await response.json()
    userCurrent.id = user.id
    userCurrent.given_name = user.given_name
    userCurrent.surname = user.surname
    userCurrent.email = user.email
    userCurrent.introduction = user.introduction
    userCurrent.quote = user.quote
    haveUser.value = true
    console.log('User fetched:', user)
  } else {
    console.error('Error fetching user:', response.statusText)
  }
}

// Edit Button Functionality
const edit = () => {
  const inputs = document.querySelectorAll('input')
  inputs.forEach((input) => {
    input.disabled = false
  })
  const updateButton = document.querySelector('button[type="submit"]')
  updateButton.disabled = false
}

// Update Button Functionality
async function updateUser() {
  const response = await fetch(`/api/users/update/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      given_name: given_name.value,
      surname: surname.value,
      email: email.value,
      introduction: introduction.value,
      quote: quote.value
    })
  })
  if (response.ok) {
    const updatedUser = await response.json()
    console.log('User updated:', updatedUser.user)
    window.alert('Profile updated successfully!')
    const updateButton = document.querySelector('button[type="submit"]')
    updateButton.disabled = true
    const inputs = document.querySelectorAll('input')
    inputs.forEach((input) => {
      input.disabled = true
    })
  } else {
    console.error('Error updating user:', response.statusText)
  }
}
// Fetching the user data on page load
onMounted(fetchUserData)

definePageMeta({
  name: 'UserAccount',
  layout: 'default'
})
</script>
