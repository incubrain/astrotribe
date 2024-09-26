<script setup>
onMounted(() => {
  const { signIn } = useAuth()
  const urlParams = new URLSearchParams(window.location.search)
  const email = urlParams.get('email')
  const password = urlParams.get('password')

  signIn({ email, password })
    .then((result) => {
      window.opener.postMessage(
        { type: 'AUTH_RESULT', success: true, user: result.user },
        'https://app.domain.com', // Origin of the main app
      )
      window.close()
    })
    .catch((error) => {
      window.opener.postMessage(
        { type: 'AUTH_RESULT', success: false, error: error.message },
        'https://app.domain.com',
      )
      window.close()
    })
})
</script>

<template>
  <div>Authenticating...</div>
</template>
