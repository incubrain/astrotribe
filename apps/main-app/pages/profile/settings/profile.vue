<script setup lang="ts">
import { z } from 'zod'
import { useFileUpload } from '#imports'

const schema = [
  {
    value: 'given_name',
    label: 'Given Name',
    tip: 'Your first name',
    placeholder: 'Your first name',
    type: 'text',
  },
  {
    value: 'surname',
    label: 'Surname',
    tip: 'Your last name',
    placeholder: 'Your last name',
    type: 'text',
  },
  {
    value: 'email',
    label: 'Email',
    tip: 'Contact support to update your email',
    placeholder: 'Your email address',
    type: 'email',
    disabled: true,
  },
  {
    value: 'username',
    label: 'Username',
    tip: 'Contact support to update your username',
    placeholder: 'Your username',
    type: 'username',
    disabled: true,
  },
]

const SettingsAccountValidation = z.object({
  given_name: z.string().min(1, 'Given Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  username: z.string(),
  email: z.string().email(),
  introduction: z.string().min(240, 'At least 240 characters required').optional(),
  quote: z.string().min(10, 'At least 10 characters required').optional(),
})

const currentUser = useCurrentUser()

const profileCopy = ref({})

onMounted(() => {
  profileCopy.value = { ...currentUser.profile }
})

const updateProfileImage = (newImage: string) => {
  const avatar = `${newImage}?v=${Date.now()}`
  currentUser.updateProfile({ avatar })
  profileCopy.value.avatar = avatar
}

definePageMeta({
  layoutTransition: false,
  name: 'Profile',
  layout: 'app-settings',
})
</script>

<template>
  <div>
    <UserSettingsCard
      v-if="currentUser"
      :title="{
        main: 'Account Profile',
        subtitle: 'Update your account information',
      }"
    >
      <div class="relative w-full max-w-[1200px]">
        <div
          class="left-16 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-red-50"
        >
          <PrimeAvatar
            v-if="profileCopy && profileCopy.avatar"
            :image="profileCopy.avatar"
            shape="circle"
            class="w-full h-full cursor-pointer"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            crossorigin="anonymous"
          />
          <UploadCropper
            cropper-type="avatar"
            class="absolute bottom-0 z-20"
            bucket="profile-public"
            @profile-pic-update="updateProfileImage"
          />
        </div>
      </div>

      <div class="pt-24">
        <UserSettingsItem
          v-for="item in schema"
          :key="item.value"
          :item="item"
        >
          <div class="w-full">
            <PrimeInputText
              v-model="profileCopy[item.value]"
              class="w-96"
              :type="item.type"
              :disabled="item.disabled"
              :placeholder="profileCopy[item.value] || item.placeholder"
            />
          </div>
        </UserSettingsItem>
        <div class="flex py-8 gap-2">
          <PrimeButton
            class="text-white"
            @click="currentUser.updateProfile(profileCopy)"
          >
            Save changes
          </PrimeButton>
        </div>
      </div>
    </UserSettingsCard>
  </div>
</template>
