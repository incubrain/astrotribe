<script setup lang="ts">
import { ref, computed } from 'vue'
import QRCode from 'qrcode'

const supabase = useSupabaseClient()
const toast = useNotification()

const currentUser = useCurrentUser()
const { profile } = storeToRefs(currentUser)

const loading = ref(false)
const setupStep = ref<'initial' | 'qr' | 'verify'>('initial')
const qrCodeUrl = ref('')
const verificationCode = ref('')
const factorId = ref('')
const secret = ref('')

const isVerifying = ref(false)
const setupError = ref('')

// Keep track of enrolled factors
const enrolledFactors = ref<any[]>([])

// Check if 2FA is already set up
async function checkExistingFactors() {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.mfa.listFactors()

    if (error) throw error

    enrolledFactors.value = data.totp
  } catch (error) {
    toast.error({
      summary: 'Error',
      message: 'Could not fetch 2FA status',
    })
  } finally {
    loading.value = false
  }
}

const showSetupModal = ref(false) // New ref for controlling modal visibility
const factorName = ref(`AstronEra_${profile.value?.id}`) // Default name
const nameError = ref('')

// Modified startSetup to include validation
async function startSetup() {
  try {
    if (!factorName.value.trim()) {
      nameError.value = 'Please provide a name for this authenticator'
      return
    }

    loading.value = true
    setupError.value = ''
    nameError.value = ''

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'AstronEra', // Add your app name here
      friendlyName: factorName.value.trim(),
    })

    if (error) throw error

    if (data.type === 'phone') {
      throw new Error('Phone enrollment is not supported')
    }

    // Generate QR code
    factorId.value = data.id
    secret.value = data.totp.secret

    const qrCode = await QRCode.toDataURL(data.totp.uri)
    qrCodeUrl.value = qrCode

    setupStep.value = 'qr'
  } catch (error: any) {
    setupError.value = 'Failed to start 2FA setup. Please try again.'
    toast.error({
      summary: 'Setup Failed',
      message: error.message || 'Could not start 2FA setup',
    })
  } finally {
    loading.value = false
  }
}

// Reset form should also clear the factor name
function resetForm() {
  setupStep.value = 'initial'
  verificationCode.value = ''
  qrCodeUrl.value = ''
  factorId.value = ''
  secret.value = ''
  setupError.value = ''
  factorName.value = ''
  nameError.value = ''
}

// Verify the setup
async function verifySetup() {
  try {
    isVerifying.value = true
    setupError.value = ''

    if (!verificationCode.value) {
      throw new Error('Please enter verification code')
    }

    const { data, error } = await supabase.auth.mfa.challenge({
      factorId: factorId.value,
    })

    if (error) throw error

    // Verify the challenge
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: factorId.value,
      challengeId: data.id,
      code: verificationCode.value,
    })

    if (verifyError) throw verifyError

    toast.success({
      summary: '2FA Enabled',
      message: 'Two-factor authentication has been successfully enabled',
    })

    // Reset the form and refresh factors
    await checkExistingFactors()
    resetForm()
    showSetupModal.value = false
  } catch (error: any) {
    setupError.value = error.message || 'Invalid verification code'
    toast.error({
      summary: 'Verification Failed',
      message: error.message || 'Could not verify 2FA setup',
    })
  } finally {
    isVerifying.value = false
  }
}

async function startEnrollment() {
  try {
    loading.value = true
    setupError.value = ''

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'AstronEra',
      friendlyName: factorName.value,
    })

    if (error) throw error

    // Generate QR code
    factorId.value = data.id
    secret.value = data.totp.secret

    const qrCode = await QRCode.toDataURL(data.totp.uri)
    qrCodeUrl.value = qrCode

    setupStep.value = 'qr'
  } catch (error: any) {
    setupError.value = 'Failed to start 2FA setup. Please try again.'
    toast.error({
      summary: 'Setup Failed',
      message: error.message || 'Could not start 2FA setup',
    })
  } finally {
    loading.value = false
  }
}

// Disable 2FA
async function disableTwoFactor(factorId: string) {
  try {
    loading.value = true

    const { error } = await supabase.auth.mfa.unenroll({
      factorId,
    })

    if (error) throw error

    toast.success({
      summary: '2FA Disabled',
      message: 'Two-factor authentication has been disabled',
    })

    await checkExistingFactors()
  } catch (error: any) {
    toast.error({
      summary: 'Error',
      message: error.message || 'Could not disable 2FA',
    })
  } finally {
    loading.value = false
  }
}

const has2FAEnabled = computed(() => enrolledFactors.value.length > 0)

// Load existing factors on mount
onMounted(() => {
  checkExistingFactors()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between rounded-lg bg-black/20 p-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-warning-500/10">
          <Icon
            name="mdi:shield-lock"
            class="text-xl text-warning-500"
          />
        </div>
        <div>
          <h3 class="font-medium">Two-Step Verification</h3>
          <p class="text-sm text-gray-400">
            {{ has2FAEnabled ? 'Enabled' : 'Not configured' }}
          </p>
        </div>
      </div>

      <div
        v-if="loading"
        class="flex items-center"
      >
        <PrimeProgressSpinner style="width: 20px; height: 20px" />
      </div>
      <template v-else>
        <PrimeButton
          v-if="!has2FAEnabled"
          severity="secondary"
          size="small"
          @click="showSetupModal = true"
        >
          Configure
        </PrimeButton>
        <PrimeButton
          v-else
          severity="danger"
          size="small"
          @click="disableTwoFactor(enrolledFactors[0].id)"
        >
          Disable
        </PrimeButton>
      </template>
    </div>

    <!-- Setup Modal -->
    <PrimeDialog
      v-model:visible="showSetupModal"
      modal
      header="Set up two-step verification"
      :closable="!isVerifying"
      @update:visible="(value) => !value && resetForm()"
    >
      <div
        v-if="setupError"
        class="mb-4"
      >
        <PrimeMessage
          severity="error"
          :closable="false"
        >
          {{ setupError }}
        </PrimeMessage>
      </div>

      <div class="space-y-6">
        <!-- Initial Welcome Screen -->
        <template v-if="setupStep === 'initial'">
          <div class="space-y-4 max-w-lg">
            <p class="text-sm text-gray-400">
              Two-step verification adds an extra layer of security to your account. Once enabled,
              you'll need to enter a code from your authenticator app when signing in.
            </p>

            <div class="flex justify-end">
              <PrimeButton
                :loading="loading"
                @click="startEnrollment"
              >
                Begin Setup
              </PrimeButton>
            </div>
          </div>
        </template>
        <!-- QR Code Step -->
        <template v-if="setupStep === 'qr'">
          <div class="space-y-4">
            <p class="text-sm text-gray-400">
              1. Install an authenticator app (like Google Authenticator) on your mobile device
            </p>
            <p class="text-sm text-gray-400"> 2. Scan this QR code with your authenticator app: </p>

            <div class="flex justify-center bg-white p-4 rounded-lg">
              <img
                :src="qrCodeUrl"
                alt="QR Code"
                class="w-48 h-48"
              />
            </div>

            <div class="mt-4">
              <p class="text-sm text-gray-400">
                Can't scan the QR code? Enter this setup code manually in your app:
              </p>
              <div class="mt-2 flex items-center gap-2">
                <code class="block p-2 bg-gray-800 rounded text-base font-mono select-all">
                  {{ secret }}
                </code>
              </div>
            </div>

            <PrimeButton
              class="w-full"
              @click="setupStep = 'verify'"
            >
              Continue
            </PrimeButton>
          </div>
        </template>

        <!-- Verification Step -->
        <template v-if="setupStep === 'verify'">
          <div class="space-y-4">
            <p class="text-sm text-gray-400">
              Enter the 6-digit code from your authenticator app to verify setup
            </p>

            <PrimeInputText
              v-model="verificationCode"
              type="text"
              class="w-full"
              :disabled="isVerifying"
              placeholder="Enter 6-digit code"
              maxlength="6"
            />

            <div class="flex justify-end gap-2">
              <PrimeButton
                severity="secondary"
                :disabled="isVerifying"
                @click="setupStep = 'qr'"
              >
                Back
              </PrimeButton>
              <PrimeButton
                :loading="isVerifying"
                @click="verifySetup"
              >
                Enable two-step verification
              </PrimeButton>
            </div>
          </div>
        </template>
      </div>
    </PrimeDialog>
  </div>
</template>
