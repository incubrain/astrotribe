<template>
    <!-- Navigation starts -->
    <nav
        class="min-h-[50px] flex items-center lg:items-stretch justify-end lg:justify-between bg-white shadow relative z-0"
    >
        <div class="hidden lg:flex w-full pr-6">
            <!-- searchbar -->
            <!-- <div class="w-1/2 h-full hidden lg:flex items-center pl-6 pr-24">
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
                        class="border border-gray-100 focus:outline-none focus:border-indigo-700 rounded w-full text-sm text-gray-500 bg-gray-100 pl-12 py-2"
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </div> -->
            <div class="w-1/2 hidden lg:flex">
                <!-- <p> user info: {{ profile }}</p> -->
            </div>
            <div class="w-1/2 hidden lg:flex">
                <div class="w-full flex items-center pl-8 justify-end">
                    <div
                        class="h-full w-20 flex items-center justify-center border-r border-l"
                    >
                        <div class="relative cursor-pointer text-gray-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-bell"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z"></path>
                                <path
                                    d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
                                ></path>
                                <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
                            </svg>
                            <div
                                class="w-2 h-2 rounded-full bg-red-400 border border-white absolute inset-0 mt-1 mr-1 m-auto"
                            ></div>
                        </div>
                    </div>
                    <div
                        class="h-full w-20 flex items-center justify-center border-r mr-4 cursor-pointer text-gray-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-messages"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path
                                d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"
                            />
                            <path
                                d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"
                            />
                        </svg>
                    </div>
                    <!-- avatar dropdown -->
                    <div
                        class="flex items-center relative cursor-pointer"
                        @click="dropdownHandler($event)"
                    >
                        <div class="rounded-full">
                            <ul
                                class="p-2 w-full border-r bg-white absolute rounded left-0 shadow mt-12 sm:mt-16 hidden"
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
                                    class="rounded-full h-10 w-10 object-cover"
                                    src="https://tuk-cdn.s3.amazonaws.com/assets/components/sidebar_layout/sl_1.png"
                                    alt="avatar"
                                />
                                <div
                                    class="w-2 h-2 rounded-full bg-green-400 border border-white absolute inset-0 mb-0 mr-0 m-auto"
                                ></div>
                            </div>
                        </div>
                        <p class="text-gray-800 text-sm mx-3">{{ currentSession ? 'Authenticated' : 'No Auth' }}</p>
                        <div class="cursor-pointer text-gray-600">
                            <svg
                                aria-haspopup="true"
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-chevron-down"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="text-gray-600 mr-8 visible lg:hidden relative"
            @click="dropdownHandler($event)"
        >
            <ul
                v-if="currentSession !== null"
                class="p-2 w-40 border-r bg-white absolute rounded right-0 shadow mt-12 hidden"
            >
                <li
                    class="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center"
                >
                    <div class="flex items-center">
                        <span class="text-sm">My Profile</span>
                    </div>
                </li>
                <li
                    class="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center mt-2"
                >
                    <div class="flex items-center">
                        <button
                            @click="logout()"
                            v-if="currentSession !== null"
                        >
                            Logout
                        </button>
                        <button @click="navigateTo('/login')" v-else>
                            Login
                        </button>
                    </div>
                </li>
            </ul>
            <ul
                class="p-2 w-full border-r bg-white absolute rounded left-0 shadow mt-12 sm:mt-16 hidden"
                v-else
            >
                <AuthLoginNav class="text-sm" />
            </ul>
            <svg
                aria-label="Main Menu"
                aria-haspopup="true"
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-menu cursor-pointer"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
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
