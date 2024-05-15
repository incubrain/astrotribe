<template>
  <div id="player"></div>
</template>

<script setup lang="ts">
const player = ref(null)

onMounted(() => {
  // Load the YouTube IFrame API dynamically if it's not already loaded
if (!window.YT) {
    // Check if YT object is already present
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // Define the callback globally to initialize player when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer
  } else {
    // Initialize the player immediately if YT is already loaded
    initializePlayer()
  }
})

function initializePlayer() {
  // Make sure the YT object and YT.Player are defined
  if (typeof YT !== 'undefined' && YT.Player) {
    player.value = new YT.Player('player', {
      // Ensure the element ID matches your template
      height: '390',
      width: '640',
      listType: 'user_uploads',
      list: 'Fireship', // Make sure 'Fireship' is a correct videoId or replace it with a valid one
      events: {
        onReady: onPlayerReady
      }
    })
  }
}

function onPlayerReady(event) {
  event.target.playVideo()
}

onBeforeUnmount(() => {
  if (player.value) {
    player.value.destroy()
  }
})
</script>
