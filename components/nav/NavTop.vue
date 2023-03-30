<template>
    <!-- Navigation starts -->
    <nav
        class="min-h-[60px] flex items-center md:items-stretch w-full justify-end md:justify-between bg-white shadow relative z-0"
    >
        <div class="md:grid md:grid-cols-[minmax(160px,220px)_minmax(1fr,420px)_minmax(160px,220px)] w-full gap-6 items-center flex space-between text-black">
            <!-- logo -->
            <div class="h-full flex items-center pl-4">
                <NavMobi class="flex lg:hidden" />
                <h1 class="text-2xl font-bold border-r hidden lg:block pr-4">AstroTribe</h1>
                <div 
                  v-show="route.path === '/'"
                  class="hidden lg:flex gap-4 pl-4 justify-center items-center h-full leading-none  text-sm font-semibold">
                    <NuxtLink to="/news" class="hover:text-[#471bc9]"> News </NuxtLink>
                    <NuxtLink to="/about" class="hover:text-[#471bc9]"> About </NuxtLink>
                    <NuxtLink to="/contact" class="hover:text-[#471bc9]"> Contact us </NuxtLink>
                </div>
                <!-- <div class="w-full h-[40px] hidden md:flex items-center">
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
            <AppTabs class="hidden h-full md:flex" />
            <div class="md:col-start-3 md:col-span-1 pr-6 flex w-full">
                <div class="w-full flex items-center justify-end">
                    <!-- avatar dropdown -->
                    <div
                        class="flex items-center relative cursor-pointer"
                        @click="dropdownHandler($event)"
                    >
                        <p class="text-gray-800 text-sm mx-3">{{ currentSession ? 'Authenticated' : 'Drew MacGibbon' }}</p>

                        <div class="rounded-md">
                            <ul
                                class="p-2 w-full bg-white shadow-xl absolute rounded left-0 mt-[50px] border-gray-500 border-t-2 hidden"
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
                                        <NuxtLink
                                            :to="`/profile/1`"
                                            class="text-sm ml-2 text-gray-600 hover:text-indigo-700 cursor-pointer items-center">
                                            My Profile
                                        </NuxtLink>
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
                                            v-if="currentSession !== null"
                                            @click="logout()"
                                        >
                                            Logout
                                        </button>
                                        <button
                                            v-else
                                            @click="navigateTo('/auth/login')"
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

const route = useRoute()

const { logout, session } = useAuth()

const { error, session: currentSession } = await session.getCurrent()

if (error) throw createError('error getting user session')

console.log('currentSession', session, currentSession, error)

function dropdownHandler(event) {
    const single = event.currentTarget.getElementsByTagName('ul')[0]
    single.classList.toggle('hidden')
}
</script>
