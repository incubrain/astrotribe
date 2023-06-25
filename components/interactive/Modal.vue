<template>
  <div
    id="modal"
    class="fixed top-0 bottom-0 left-0 right-0 z-50 hidden py-12 transition duration-150 ease-in-out bg-gray-900 bg-opacity-30"
  >
    <div
      role="alert"
      :class="
        fullscreen
          ? 'relative z-50 mx-auto w-11/12 md:w-2/3'
          : 'relative z-50 mx-auto w-11/12 w-full'
      "
    >
      <div
        class="relative py-8 px-5 md:px-10 shadow-md rounded border border-gray-400 h-[80vh] overflow-y-scroll"
      >
        <div class="flex flex-col justify-start w-full">
          <slot />
          <div v-if="buttonsVisible">
            <button
              class="px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-indigo-700 rounded focus:outline-none hover:bg-indigo-600"
            >
              Submit
            </button>
            <button
              class="px-8 py-2 ml-3 text-sm text-gray-600 transition duration-150 ease-in-out bg-gray-100 border rounded focus:outline-none hover:border-gray-400 hover:bg-gray-300"
              @click="modalHandler()"
            >
              Cancel
            </button>
          </div>
        </div>
        <div
          class="absolute top-0 right-0 mt-4 mr-5 text-gray-400 transition duration-150 ease-in-out cursor-pointer hover:text-gray-600"
          @click="modalHandler()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Close"
            class="icon icon-tabler icon-tabler-x"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              stroke="none"
              d="M0 0h24v24H0z"
            />
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
  <div
    id="button"
    class="absolute items-center justify-center hidden w-full h-full py-12 group-hover:flex"
  >
    <button
      class="px-4 py-2 mx-auto text-xs text-white transition duration-150 ease-in-out bg-indigo-700 rounded focus:outline-none hover:bg-indigo-600 sm:px-8 sm:text-sm"
      @click="modalHandler(true)"
    >
      {{ modalTitle }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  buttonsVisible: boolean
  fullscreen: boolean
  modalTitle: string
}

withDefaults(defineProps<Props>(), {
  buttonsVisible: true,
  fullscreen: false,
  modalTitle: 'hello'
})

function fadeOut(el) {
  el.style.opacity = 1
  ;(function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = 'none'
    } else {
      requestAnimationFrame(fade)
    }
  })()
}

function fadeIn(el) {
  el.style.opacity = 0
  el.style.display = 'flex'
  ;(function fade() {
    let val = parseFloat(el.style.opacity)
    if (!((val += 0.2) > 1)) {
      el.style.opacity = val
      requestAnimationFrame(fade)
    }
  })()
}

function modalHandler(val) {
  const modal = document.getElementById('modal')
  if (val) {
    fadeIn(modal)
  } else {
    fadeOut(modal)
  }
}
</script>
