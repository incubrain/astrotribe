<script setup lang="ts">
const auth = useAuth()
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
        provider="twitter"
        @social-login="auth.loginSocial('twitter')"
      />
      <AuthSocialButton
        provider="linkedin"
        @social-login="auth.loginSocial('linkedin_oidc')"
      />
    </div>
  </div>
</template>

<style></style>
