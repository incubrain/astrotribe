<!-- components/settings/AccountSection.vue -->
<script setup lang="ts">
interface Profile {
  avatar?: string
  given_name: string
  surname: string
  email: string
  username: string
}

const currentUser = useCurrentUser()

const profileCopy = ref({})

const updateProfileImage = (newImage: string) => {
  const avatar = `${newImage}?v=${Date.now()}`
  currentUser.updateProfile({ avatar })
  profileCopy.value.avatar = avatar
}

onMounted(() => {
  profileCopy.value = { ...currentUser.profile }
})

const isUpdating = ref(false)

const schema = [
  {
    id: 'given_name',
    label: 'Given Name',
    tip: 'Your first name',
    placeholder: 'Your first name',
    type: 'text',
  },
  {
    id: 'surname',
    label: 'Surname',
    tip: 'Your last name',
    placeholder: 'Your last name',
    type: 'text',
  },
  {
    id: 'email',
    label: 'Email',
    tip: 'Contact support to update your email',
    placeholder: 'Your email address',
    type: 'email',
    disabled: true,
  },
  {
    id: 'username',
    label: 'Username',
    tip: 'Contact support to update your username',
    placeholder: 'Your username',
    type: 'text',
    disabled: true,
  },
]
</script>

<template>
  <SettingsCard
    :title="{
      main: 'Profile',
      subtitle: 'Update your account information',
    }"
  >
    <div class="space-y-6">
      <div class="relative">
        <div class="flex items-center space-x-4">
          <div class="relative h-32 w-32">
            <PrimeAvatar
              v-if="profileCopy.avatar"
              :image="profileCopy.avatar"
              shape="circle"
              class="h-full w-full"
              crossorigin="anonymous"
            />
            <div
              v-else
              class="h-full w-full bg-gray-800 rounded-full flex items-center justify-center"
            >
              <span class="text-3xl text-gray-400">
                {{ profileCopy.given_name?.[0] }}
              </span>
            </div>
            <UploadCropper
              cropper-type="avatar"
              class="absolute bottom-0 right-0"
              bucket="profile-public"
              @profile-pic-update="updateProfileImage"
            />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <SettingsItem
          v-for="item in schema"
          :key="item.id"
          :item="item"
        >
          <PrimeInputText
            v-model="profileCopy[item.id]"
            class="w-full md:max-w-96"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
          />
        </SettingsItem>
      </div>

      <div class="flex justify-end pt-4">
        <PrimeButton
          :loading="isUpdating"
          @click="currentUser.updateProfile(profileCopy)"
        >
          Save Changes
        </PrimeButton>
      </div>
    </div>
  </SettingsCard>
</template>
