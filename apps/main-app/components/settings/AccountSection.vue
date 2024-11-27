<!-- components/settings/AccountSection.vue -->
<script setup lang="ts">
import { z } from 'zod'
import { useSettingsProfile } from '~/composables/useSettingsProfile'

const { profile, updateProfile, isUpdating } = useSettingsProfile()

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
    type: 'username',
    disabled: true,
  },
]
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
              v-if="profile?.avatar"
              :image="profile.avatar"
              shape="circle"
              class="h-full w-full"
              crossorigin="anonymous"
            />
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

      <div class="pt-4">
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
