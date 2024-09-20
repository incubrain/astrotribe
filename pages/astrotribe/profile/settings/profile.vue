<script setup lang="ts">
import { z } from 'zod'
import { useFileUpload } from '~/composables/ib/upload.ib'

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
    label: 'username',
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

const userId = useCookie('userId')

const {
  store: userProfile,
  loadMore,
  refresh,
} = useSelectData<User>('user_profiles', {
  columns: 'id, given_name, surname, email, avatar, dob, username',
  filters: { id: { eq: userId.value } },
  initialFetch: true,
  limit: 1,
})

const profileCopy = ref({})

watch(userProfile, () => {
  profileCopy.value = { ...userProfile.items[0] }
})

const { uploadFile, isUploading, uploadProgress } = useFileUpload()

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    const result = await uploadFile(file, {
      bucket: 'users',
      path: 'profile-images',
      fileType: 'profile',
      serverSideOptimize: true, // Enable server-side optimization
      maxWidth: 800,
      maxHeight: 800,
      quality: 80,
      format: 'webp',
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress}%`)
      },
    })
    console.log('File uploaded successfully:', result)
  } catch (error) {
    console.error('Error uploading file:', error)
  }
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
      v-if="userProfile"
      :title="{
        main: 'Account Profile',
        subtitle: 'Update your account information',
      }"
    >
      <div class="relative w-full max-w-[1200px]">
        <div
          class="left-16 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-red-50"
        >
          <IbImage
            v-if="userProfile?.avatar"
            :img="{
              src: userProfile.avatar,
              type: 'avatar',
            }"
            class="h-full w-full"
          />
          <IbUploadCropper
            cropper-type="avatar"
            class="absolute z-20"
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
        <div class="py-8">
          <PrimeButton
            class="text-white"
            @click="currentUser.updateProfile(profileCopy)"
          >
            Save changes
          </PrimeButton>
          <PrimeButton
            class="text-white"
            @click="currentUser.testUpdateProfile()"
          >
            Test changes
          </PrimeButton>
        </div>
      </div>
    </UserSettingsCard>
  </div>
</template>
