function isMobileDevice() {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent)
}

let deferredPrompt

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault()
  // Stash the event so it can be triggered later
  deferredPrompt = e

  // Check if the device is mobile
  if (isMobileDevice()) {
    // Show your custom install button or prompt
    showInstallButton()
  }
})

function showInstallButton() {
  // Display your custom install UI for mobile users
  const installButton = document.getElementById('install-button')
  installButton.style.display = 'block'

  installButton.addEventListener('click', async () => {
    // Hide the install button
    installButton.style.display = 'none'

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    deferredPrompt = null
  })
}
