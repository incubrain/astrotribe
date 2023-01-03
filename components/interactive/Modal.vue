<template>
    <div
        class="py-12 bg-gray-900 bg-opacity-30 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0 hidden"
        id="modal"
    >
        <div role="alert" class="container mx-auto w-11/12 md:w-2/3 max-w-lg">
            <div
                class="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400"
            >
                
                <div class="flex flex-col justify-start w-full">
                    <slot />
                    <div>
                        <button
                            class="focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                        >
                            Submit
                        </button>
                        <button
                            class="focus:outline-none ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                            @click="modalHandler()"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                <div
                    class="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
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
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
    <div class="w-full flex justify-center py-12" id="button">
        <button
            class="focus:outline-none mx-auto transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-4 sm:px-8 py-2 text-xs sm:text-sm"
            @click="modalHandler(true)"
        >
            Open Modal
        </button>
    </div>
</template>

<script setup lang="ts">


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
    let modal = document.getElementById('modal')
    if (val) {
        fadeIn(modal)
    } else {
        fadeOut(modal)
    }
}

</script>
