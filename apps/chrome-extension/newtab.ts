const APP_URL = 'https:/app.astronera.org'

document.addEventListener('DOMContentLoaded', () => {
  const frame = document.getElementById('app-frame') as HTMLIFrameElement
  const loading = document.getElementById('loading')

  if (frame) {
    frame.src = APP_URL

    frame.addEventListener('load', () => {
      if (loading) {
        loading.style.display = 'none'
      }

      frame.style.opacity = '1'
    })

    frame.addEventListener('error', (e) => {
      console.error('Failed to load application:', e)
      if (loading) {
        loading.textContent = 'Failed to load application. Please check your connection.'
      }
    })
  }
})
