<template>
  <UCard class="foreground">
    <div class="flex flex-wrap gap-2">
      <UButton
        color="primary"
        class="mt-4"
        @click="testing.auth.register()"
      >
        Register
      </UButton>
      <!-- <UButton
        color="primary"
        class="mt-4"
        @click="admin.registerManyUsers()"
      >
        Register Many
      </UButton> -->
      <UButton
        color="primary"
        class="mt-4"
        @click="testing.auth.login()"
      >
        Login
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">

const testing = useTestingStore()

// const admin = useAdmin()

</script>

<style scoped></style>
