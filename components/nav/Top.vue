<template>
    <!-- Navigation starts -->
    <nav
        class="min-h-[80px] flex items-center lg:items-stretch w-full justify-end lg:justify-between bg-white shadow relative z-0"
    >
        <div class="lg:grid lg:grid-cols-[minmax(160px,220px)_minmax(1fr,420px)_minmax(160px,220px)] w-full gap-6 items-center">
            <!-- logo -->
            <div class="h-full flex items-center pl-6">
                <h1 class="text-2xl font-bold">AstroTribe</h1>
                <!-- <div class="w-full h-[40px] hidden lg:flex items-center">
                    <div class="relative w-full">
                        <div
                            class="text-gray-500 absolute ml-4 inset-0 m-auto w-4 h-4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-search"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <circle cx="10" cy="10" r="7" />
                                <line x1="21" y1="21" x2="15" y2="15" />
                            </svg>
                        </div>
                        <input
                            class="border focus:outline-none focus:border-indigo-700 rounded w-full h-[40px] text-sm text-gray-500 bg-gray-100 pl-12 py-2 border-none"
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                </div> -->
            </div>
            <!-- tabs -->
            <AppTabs class="h-full flex" />
            <div class="col-start-3 col-span-1 pr-6">
                <div class="w-full flex items-center justify-end">
                    <!-- avatar dropdown -->
                    <div
                        class="flex items-center relative cursor-pointer"
                        @click="dropdownHandler($event)"
                    >
                        <p class="text-gray-800 text-sm mx-3">{{ currentSession ? 'Authenticated' : 'No Auth' }}</p>

                        <div class="rounded-md">
                            <ul
                                class="p-2 w-full bg-white shadow-xl absolute rounded left-0 mt-[46px] border-gray-600 border-t-4 hidden"
                            >
                                <li
                                    class="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center"
                                >
                                    <div class="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="icon icon-tabler icon-tabler-user"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                            />
                                            <circle cx="12" cy="7" r="4" />
                                            <path
                                                d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"
                                            />
                                        </svg>
                                        <span class="text-sm ml-2"
                                            >My Profile</span
                                        >
                                    </div>
                                </li>
                                <li
                                    class="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center mt-2"
                                >
                                    <div class="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="icon icon-tabler icon-tabler-logout"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                            />
                                            <path
                                                d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                                            />
                                            <path d="M7 12h14l-3 -3m0 6l3 -3" />
                                        </svg>
                                        <button
                                            @click="logout()"
                                            v-if="currentSession !== null"
                                        >
                                            Logout
                                        </button>
                                        <button
                                            @click="navigateTo('/login')"
                                            v-else
                                        >
                                            Login
                                        </button>
                                    </div>
                                </li>
                            </ul>
                            <div class="relative">
                                <img
                                    class="rounded-md h-[40px] w-[40px] object-cover"
                                    src="/avatar.png"
                                    alt="avatar"
                                />
                                <div
                                    class="w-2 h-2 rounded-full bg-green-400 border border-white absolute inset-0 mb-0 mr-0 m-auto"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </nav>
</template>

<script setup>
const profile = ref({
    email: 'empty',
})

const { logout, session } = useAuth()

const { error, session: currentSession } = await session.getCurrent()
if (error) throw createError('error getting user session')
console.log('currentSession', currentSession)

function dropdownHandler(event) {
    let single = event.currentTarget.getElementsByTagName('ul')[0]
    single.classList.toggle('hidden')
}
</script>
