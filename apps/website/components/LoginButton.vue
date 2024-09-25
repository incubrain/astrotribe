<template>
  <button @click="initiateLogin">Login</button>
</template>

<script setup>
const user = ref(null);

const initiateLogin = () => {
  const authWindow = window.open(
    "https://auth.domain.com/auth-handler",
    "Auth",
    "width=600,height=600"
  );

  window.addEventListener(
    "message",
    (event) => {
      if (event.origin !== "https://auth.domain.com") return;

      if (event.data.type === "AUTH_RESULT") {
        if (event.data.success) {
          user.value = event.data.user;
          // Handle successful login
        } else {
          // Handle login error
        }
      }
    },
    false
  );
};
</script>
