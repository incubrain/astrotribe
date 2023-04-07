<template>
  <div>
    <Title>AstroTribe</Title>
    <div
      class="flex items-center md:justify-between justify-center bg-white px-12 py-4"
    >
      <div class="hidden md:block">
        <button target="_blank" to="/register">
          Register
        </button>>
        <button target="_blank" to="/login">
          Login
        </button>
      </div>
      <div class="flex items-center">
        <button
          variant="transparent"
          :icon="colorModeIcon"
          @click="toggleDark"
        />
        <!-- <button v-if="user" class="u-text-white" variant="transparent" @click="logout">
          Logout
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const colorModeIcon = computed(() =>
  colorMode.preference === 'dark'
    ? 'heroicons-outline:moon'
    : 'heroicons-outline:sun'
)
</script>
