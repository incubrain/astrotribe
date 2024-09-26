<script setup lang="ts">
const schema = [
  {
    id: 'new_password',
    label: 'New Password',
    tip: 'New password must be at least 8 characters long',
    placeholder: 'Your new password',
    value: ref(''),
    type: 'password',
  },
  {
    id: 'confirm_new_password',
    label: 'Confirm Password',
    tip: 'Please confirm your new password',
    placeholder: 'Confirm Your password',
    value: ref(''),
    type: 'password',
  },
]

const currentUser = useCurrentUser()
const auth = useAuth()
const toast = useNotification()

const userId = useCookie('userId')
const {
  store: userProfile,
  loadMore,
  refresh,
} = await useSelectData<User>('user_profiles', {
  columns: 'id, given_name, surname, email, avatar, dob, username',
  filters: { id: { eq: userId.value } },
  initialFetch: true,
  limit: 1,
})

function handlePasswordUpdate() {
  const { new_password, confirm_new_password } = schema.reduce(
    (acc, field) => ({ ...acc, [field.id]: field.value.value }),
    {
      new_password: '',
      confirm_new_password: '',
    },
  )

  if (new_password !== confirm_new_password) {
    toast.error({
      summary: "Passwords Don't Match",
      message: "The two passwords entered don't match",
    })
    return
  }

  auth.password.update(new_password)
}

definePageMeta({
  layoutTransition: false,
  name: 'Password',
  layout: 'app-settings',
})

const settings = reactive({
  password: '',
  new_password: '',
  confirm_new_password: '',
})

const isPasswordUpdatable = computed(() =>
  currentUser.profile ? currentUser.profile?.providers.includes('email') : false,
)
</script>

<template>
  <div>
    <UserSettingsCard
      :title="{
        main: 'Update Password',
        subtitle: 'Change your password here',
      }"
    >
      <div v-if="isPasswordUpdatable">
        <UserSettingsItem
          v-for="item in schema"
          :key="item.id"
          :item="item"
        >
          <FormPassword
            :id="item.id"
            v-model="item.value.value"
            :feedback="item.id !== 'confirm_new_password'"
            :required="true"
          />
        </UserSettingsItem>
        <div class="flex justify-start pt-12">
          <PrimeButton
            label="Update Password"
            @click="handlePasswordUpdate"
          />
        </div>
      </div>
      <PrimeMessage
        v-else-if="currentUser.profile"
        severity="info"
      >
        You used {{ currentUser.profile.provider }} to authenticate
      </PrimeMessage>
    </UserSettingsCard>
  </div>
</template>
