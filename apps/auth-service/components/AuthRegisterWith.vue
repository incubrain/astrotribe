<script setup lang="ts">
const auth = useAuth()

const props = defineProps({
  disabled: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full">
      <PrimeDivider
        layout="horizontal"
        class="flex justify-left items-center"
      >
        <p>Or continue with</p>
      </PrimeDivider>
    </div>
    <div class="flex gap-4 xl:gap-6 w-full pt-4">
      <AuthSocialButton
        :disabled="props.disabled"
        provider="twitter"
        @social-login="auth.loginSocial('twitter')"
      />
      <AuthSocialButton
        :disabled="props.disabled"
        provider="linkedin"
        @social-login="auth.loginSocial('linkedin_oidc')"
      />
    </div>
  </div>
</template>

<style></style>
