<script setup lang="ts">
const { authURL } = useRuntimeConfig().public

const currentUser = useCurrentUser()
const { profile } = storeToRefs(currentUser)
const security = useSettingsSecurity()
const toast = useNotification()

const linkedIdentities = ref([])
const loading = ref(false)
const showSetPasswordModal = ref(false)
const showDeleteUserModal = ref(false)

const form = reactive({
  passwordForDeletion: '',
  password: '',
  confirmPassword: '',
})

const hasEmailProvider = computed(() => {
  return profile.value?.providers?.includes('email')
})

onMounted(async () => {
  loading.value = true
  linkedIdentities.value = await security.getLinkedIdentities()
  loading.value = false
})

async function handleUnlinkIdentity(identity) {
  if (linkedIdentities.value.length <= 1) {
    toast.error({
      summary: 'Error',
      message: 'You must keep at least one login method',
    })
    return
  }

  const { error } = await security.unlinkIdentity(identity)

  if (!error) {
    linkedIdentities.value = await security.getLinkedIdentities()
  }
}

async function handleDeleteUser() {
  if (hasEmailProvider.value && !form.passwordForDeletion) {
    toast.error({
      summary: 'Account Deletion',
      message: 'Please enter your password',
    })
    return
  }
  await security.deleteAccount(form.passwordForDeletion)
}

async function handleSetPassword() {
  if (form.password !== form.confirmPassword) {
    toast.error({
      summary: 'Error',
      message: 'Passwords do not match',
    })
    return
  }

  const success = await security.setPassword(form.password)
  if (success) {
    showSetPasswordModal.value = false
    form.password = ''
    form.confirmPassword = ''
  }
}
</script>

<template>
  <SettingsCard
    :title="{
      main: 'Security Settings',
      subtitle: 'Manage your account security',
    }"
  >
    <div class="space-y-8">
      <!-- Email/Password Section -->
      <section class="space-y-4">
        <h3 class="text-lg font-medium">Password & Email</h3>
        <div class="flex items-center justify-between rounded-lg bg-black/20 p-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10">
              <Icon
                name="mdi:email"
                class="text-xl text-primary-500"
              />
            </div>
            <div>
              <h3 class="font-medium">Email Authentication</h3>
              <p class="text-sm text-gray-400">
                {{ profile.email }}
              </p>
            </div>
          </div>
          <template v-if="!hasEmailProvider">
            <PrimeButton
              severity="secondary"
              size="small"
              @click="showSetPasswordModal = true"
            >
              Set Password
            </PrimeButton>
          </template>
          <template v-else>
            <PrimeButton
              severity="secondary"
              size="small"
              @click="navigateTo(`${authURL}/settings/password`, { external: true })"
            >
              Change Password
            </PrimeButton>
          </template>
        </div>
      </section>

      <!-- Connected Accounts -->
      <section class="space-y-4">
        <h3 class="text-lg font-medium">Connected Accounts</h3>
        <div
          v-if="loading"
          class="flex justify-center"
        >
          <PrimeProgressSpinner />
        </div>
        <template v-else>
          <div
            v-for="identity in linkedIdentities"
            :key="identity.id"
            class="flex items-center justify-between rounded-lg bg-black/20 p-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10"
              >
                <Icon
                  :name="currentUser.getProviderIcon(identity.provider)"
                  class="text-xl text-primary-500"
                />
              </div>
              <div>
                <h3 class="font-medium">{{ currentUser.formatProviderName(identity.provider) }}</h3>
                <p class="text-sm text-gray-400">{{ identity.email }}</p>
              </div>
            </div>
            <PrimeButton
              text
              severity="danger"
              size="small"
              :disabled="linkedIdentities.length <= 1"
              @click="handleUnlinkIdentity(identity)"
            >
              Unlink
            </PrimeButton>
          </div>

          <!-- Add New Connection -->
          <div
            class="flex items-center justify-between rounded-lg border border-dashed border-gray-700 p-4"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                <Icon
                  name="mdi:plus"
                  class="text-xl text-gray-400"
                />
              </div>
              <div>
                <h3 class="font-medium">Add Account</h3>
                <p class="text-sm text-gray-400">Connect another social account</p>
              </div>
            </div>
            <PrimeButton
              severity="secondary"
              size="small"
              @click="security.linkIdentity('twitter')"
            >
              Connect
            </PrimeButton>
          </div>
        </template>
      </section>
      <section class="space-y-4">
        <h3 class="text-lg font-medium">Two-Step Verification</h3>
        <Settings2FA />
      </section>
      <section class="space-y-4">
        <h3 class="text-lg font-medium">Delete Account</h3>
        <div class="flex items-center justify-between rounded-lg bg-black/20 p-4">
          <PrimeButton
            severity="danger"
            size="small"
            :feedback="false"
            required
            @click="showDeleteUserModal = true"
          >
            Delete Account
          </PrimeButton>
        </div>
      </section>
    </div>

    <!-- Delete Account Modal -->
    <PrimeDialog
      v-model:visible="showDeleteUserModal"
      modal
      header="You are about to delete your account"
    >
      <span class="text-red-500">This action is irreversible</span>
      <div class="space-y-4">
        <PrimePassword
          v-if="hasEmailProvider"
          v-model="form.passwordForDeletion"
          :feedback="true"
          toggleMask
          placeholder="Enter your password"
        />
      </div>
      <template #footer>
        <PrimeButton
          label="Cancel"
          severity="secondary"
          @click="showSetPasswordModal = false"
        />
        <PrimeButton
          severity="danger"
          label="Delete Account Permanently"
          @click="handleDeleteUser"
        />
      </template>
    </PrimeDialog>

    <!-- Set Password Modal -->
    <PrimeDialog
      v-model:visible="showSetPasswordModal"
      modal
      header="Set Password"
    >
      <div class="space-y-4">
        <PrimePassword
          v-model="form.password"
          :feedback="true"
          toggleMask
          placeholder="Enter new password"
        />
        <PrimePassword
          v-model="form.confirmPassword"
          toggleMask
          placeholder="Confirm new password"
        />
      </div>
      <template #footer>
        <PrimeButton
          label="Cancel"
          severity="secondary"
          @click="showSetPasswordModal = false"
        />
        <PrimeButton
          label="Set Password"
          @click="handleSetPassword"
        />
      </template>
    </PrimeDialog>
  </SettingsCard>
</template>
