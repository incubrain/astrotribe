<template>
    <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <!-- <Account v-if="user" /> -->
        <LoginAuthTest />
        <AppThemeSwitch />
        <p>{{ user }}</p>
        <p class="text-black bg-red-200 px-20 py-8">subs: {{ data }}</p>
        <buttonw @click="createE">create error</buttonw>
        <!-- <img src="" alt=""> -->
        <!-- <LazySupaUpload /> -->
    </div>
</template>

<script setup lang="ts">
const createE = () => {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const { getUser } = useData()
const { subscribeTest } = useRealtime()
const { getUserFiles } = useStorage()

const data = ref()

data.value = await subscribeTest()
console.log('sub', data.value)
// if (error) throw createError('error with subscribe', error)

const user = await getUser()
// const files = await getUserFiles(user.id, true)
const files = null
</script>
