<template>
    <div
        class="overflow-y-scroll transition-all duration-700"
        :style="
            isFullscreen
                ? {
                      background: 'white',
                      width: '100vw',
                      height: '100vh',
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      'z-index': 1000,
                      display: 'flex',
                      flexDirection: 'column',
                  }
                : { width: '100%' }
        "
    >
        <div
            class="max-w-[90%] lg:max-w-[620px] mx-auto py-20 text-black relative"
            v-show="store.news.length"
        >
            <div
                class="absolute top-4 right-4"
                @click="isFullscreen = !isFullscreen"
            >
                fullscreen
            </div>
            <h1 class="text-2xl mb-8">{{ store.news[1].title }}</h1>
            <div class="flex justify-left gap-8 items-center pb-8">
                <h4
                    class="text-sm mb-4 border-green-400 border-2 border-solid rounded-full py-1 px-3 w-auto"
                >
                    {{ store.news[1].category }}
                </h4>
                <h4 class="text-sm mb-4">
                    Published {{ store.news[1].published }}
                </h4>
            </div>
            <span
                v-html="purifiedHTML(store.news[1].body)"
                class="parsed-article flex flex-col gap-4 pb-20"
            ></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'

const store = usePostsStore()
await store.getNews()

const isFullscreen = ref(false)

onMounted(() => {
    window.addEventListener('keydown', (e) => {
        console.log('keydown')
        if (e.key === 'Escape') {
            isFullscreen.value = false
        }
    })
})
function purifiedHTML(d) {
    DOMPurify.addHook('uponSanitizeElement', (node) => {
        if (node.tagName) {
            node.setAttribute('class', '')
            if (node.tagName.toLowerCase() === 'div') {
                node.parentNode.removeChild(node)
            }
        }
    })
    return DOMPurify.sanitize(d)
}
</script>

<style>
.parsed-article figure img {
    margin: 32px auto;
    border-radius: 1.6rem;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
}

.fullscreen {
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
}
</style>
