<template>
    <div @click="logout()" class="flex flex-col gap-2">
        <form>
            <input
                v-model="email"
                :type="show ? 'password' : 'text'"
                placeholder="email"
                class="bg-gray-200 border rounded text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3"
            />
            <input
                v-model="password"
                placeholder="password"
                :type="show ? 'password' : 'text'"
                class="bg-gray-200 border rounded text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
            />
        </form>
        <button
            @click="login.loginWithEmail(email, password)"
            class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full"
        >
            Login
        </button>
    </div>
</template>

<script setup>
const show = ref(true)
const password = ref()
const email = ref()

const { logout, login } = useAuth()
</script>
