<script setup lang="ts">
import { z } from 'zod'

const schema = [
  {
    value: 'given_name',
    label: 'Given Name',
    tip: 'Your first name',
    placeholder: 'Your first name',
    type: 'text'
  },
  {
    value: 'surname',
    label: 'Surname',
    tip: 'Your last name',
    placeholder: 'Your last name',
    type: 'text'
  },
  {
    value: 'email',
    label: 'Email',
    tip: 'Your email address',
    placeholder: 'Contact support to update your email',
    type: 'email',
    disabled: true
  },
  {
    value: 'introduction',
    label: 'Introduction',
    tip: 'Share some information about yourself',
    placeholder: 'Tell us about yourself',
    type: 'textarea'
  },
  {
    value: 'quote',
    label: 'Quote',
    tip: 'Your favorite quote',
    placeholder: 'Your favorite quote',
    type: 'textarea'
  }
]

const SettingsAccountValidation = z.object({
  given_name: z.string().min(1, 'Given Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email(),
  introduction: z.string().min(240, 'At least 240 characters required').optional(),
  quote: z.string().min(10, 'At least 10 characters required').optional()
})

const currentUser = useCurrentUser()
await currentUser.fetchUserProfile()
const { fullProfile } = storeToRefs(currentUser)

const profileCopy = shallowRef({ ...fullProfile.value })

definePageMeta({
  layoutTransition: false,
  name: 'SettingsProfile',
  layout: 'app-settings',
  middleware: 'is-current-user'
})
</script>

<template>
  <div>
    <UserSettingsCard
      v-if="fullProfile"
      :title="{
        main: 'Account Profile',
        subtitle: 'Update your account information'
      }"
    >
      <div class="relative w-full max-w-[1200px] h-64">
        <BaseImage
          :img="{
            src: fullProfile.cover_image,
            type: 'cover'
          }"
          class="w-full h-full rounded-md overflow-hidden border border-color"
        />
        <BaseUploadCropper
          cropper-type="cover_image"
          :has-image="!!fullProfile.cover_image"
          class="absolute top-2 left-2"
        />

        <div
          class="w-32 h-32 absolute -bottom-16 left-16 bg-red-50 flex justify-center items-center rounded-full overflow-hidden"
        >
          <BaseImage
            v-if="fullProfile?.avatar"
            :img="{
              src: fullProfile.avatar,
              type: 'avatar'
            }"
            class="w-full h-full"
          />
          <BaseUploadCropper
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
            <PrimeTextarea
              v-if="item.type === 'textarea'"
              v-model="profileCopy[item.value]"
              rows="5"
              :pt="{
                root: 'w-full'
              }"
              :placeholder="profileCopy[item.value] || item.placeholder"
            />
            <PrimeInputText
              v-else
              v-model="profileCopy[item.value]"
              :type="item.type"
              :pt="{
                root: 'w-full'
              }"
              :disabled="item.disabled"
              :placeholder="profileCopy[item.value] || item.placeholder"
            />
          </div>
        </UserSettingsItem>
        <div class="p-8">
          <PrimeButton @click="currentUser.updateProfile(profileCopy)">Save</PrimeButton>
        </div>
      </div>
    </UserSettingsCard>
  </div>
</template>
