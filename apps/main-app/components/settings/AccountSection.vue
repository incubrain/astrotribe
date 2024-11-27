<!-- components/settings/AccountSection.vue -->
<script setup lang="ts">
interface Profile {
  avatar?: string
  given_name: string
  surname: string
  email: string
  username: string
}

const profile = ref<Profile>({
  given_name: 'Drew',
  surname: 'MacGibbon',
  email: 'drewmacgibbon@gmail.com',
  username: '',
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

async function updateProfile(updates: Partial<Profile>) {
  try {
    isUpdating.value = true
    // Add actual update functionality here
    profile.value = { ...profile.value, ...updates }
    toast.success({
      summary: 'Success',
      message: 'Your profile has been updated',
    })
  } catch (error) {
    toast.error({
      summary: 'Error',
      message: 'Failed to update profile',
    })
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <SettingsCard
    :title="{
      main: 'Account Profile',
      subtitle: 'Update your account information',
    }"
  >
    <div class="space-y-6">
      <div class="relative">
        <div class="flex items-center space-x-4">
          <div class="relative h-32 w-32">
            <PrimeAvatar
              v-if="profile.avatar"
              :image="profile.avatar"
              shape="circle"
              class="h-full w-full"
              crossorigin="anonymous"
            />
            <div
              v-else
              class="h-full w-full bg-gray-800 rounded-full flex items-center justify-center"
            >
              <span class="text-3xl text-gray-400">
                {{ profile.given_name?.[0] }}
              </span>
            </div>
            <UploadCropper
              cropper-type="avatar"
              class="absolute bottom-0 right-0"
              bucket="profile-public"
              @profile-pic-update="updateProfile({ avatar: $event })"
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
            v-model="profile[item.id]"
            class="w-full md:w-96"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
          />
        </SettingsItem>
      </div>

      <div class="flex justify-end pt-4">
        <PrimeButton
          :loading="isUpdating"
          @click="updateProfile(profile)"
        >
          Save Changes
        </PrimeButton>
      </div>
    </div>
  </SettingsCard>
</template>
