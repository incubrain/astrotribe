<template>
    <div
        class="absolute top-0 left-0 right-0 w-full"
    >
        <img src="/cover.jpg" class="w-full bg-contain bg-no-repeat "/>
        <div class="bg-[#12060620] w-full h-full bg-blend-overlay absolute top-0 left-0"></div>
    </div>
        
        <div
            class="min-h-full grid grid-cols-[minmax(160px,1fr)]
                lg:grid-cols-[minmax(140px,.4fr)_minmax(600px,4fr)_minmax(140px,0.4fr)] lg:max-w-[1240px]
                mx-auto
                "
        >
            <div
                class="rounded-lg row-start-1 col-span-1 col-start-2 w-full h-[420px] relative bg-cover"
        >
                <AppStars
                    :rating="user.overall_rating"
                    class="lg:col-start-2 absolute bottom-0 right-0 bg-[#343434] py-2 px-4 rounded-t-lg"
                />
            </div>
            <div
                class="bg-white w-full h-[200px] relative lg:col-start-2 row-span-1 row-start-2 py-[140px] px-12 rounded-b-lg"
            >
                <div
                    class="absolute left-0 top-[-60px] w-[120px] h-[120px] lg:top-[-120px] lg:w-[240px] lg:h-[240px] rounded-full border-8 border-white
                        group text-black overflow-hidden"
                >
                    <p class="absolute flex justify-center items-center w-full h-full  z-20 px-6 py-2 
                    group-hover:bg-slate-100 group-hover:before:content-['Change']"></p>
                    <img
                        :src="`/users/avatars/${user.avatar}`"
                        alt=""
                        class="w-full rounded-full"
                    >
                    <SupaUpload />
                </div>
                <div>
                    <h1 class="text-2xl font-semibold"> {{ user.name }}</h1>
                    <h4 class="text-lg">{{ user.role }}</h4>
                    <h6 class="text-md pt-3 flex items-center">
                        <Icon name="uil:location-point" size="18px" />
                        {{ home.town }}, {{ home.district }}, {{ home.state }}, {{ home.country }} 
                    </h6>
                </div>
                <div
                    class="absolute bottom-12 right-12 lg:pl-[260px] pl-[100px] flex items-center gap-4 justify-between 2-full"
                >
                    <Icon name="ion:ios-bell-outline" size="23px" />
                    <!-- <Icon name="ion:ios-bell" size="23px"/> -->
                    <Icon name="fluent-mdl2:add-friend" size="23px" />
                    <Icon name="material-symbols:edit-outline-sharp" size="23px" />
                    <button class="px-6 py-2 text-sm bg-black rounded-lg shadow-lg">
                        Message
                    </button>
                </div>
                <!-- <div
                    class="absolute top-4 pl-[100px] lg:pl-[200px] flex items-center gap-4 justify-between 2-full"
                >
                    <p class="px-6 py-2 text-lg font-normal">
                        A personal quote to
                    </p>
                </div> -->
            </div>
            <!-- <div
            class="bg-white p-6 shadow-lg flex flex-row gap-6 justify-between  w-full rounded-b-lg"
            >
                <InteractiveModal>
                    <FormEditModal />
                </InteractiveModal>
            </div> -->
            <div
                class="w-full relative flex mt-6 gap-6 row-start-3 row-span-1 lg:col-start-2"
            >
                <div class="card">
                    <h1 class="text-2xl pb-4 font-semibold">AstroGuide Rating</h1>
                    <ProfileSkills :skills="user.skills" />
                </div>
                <div class="card">
                    <h1 class="text-2xl pb-4 font-semibold">About</h1>
                    <p class="pb-2">
                        This is where the tribal kids can express themselves and let people
                        know a bit about them.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur
                        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                        quae ab illo inventore veritatis et quasi architecto beatae
                        vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                        voluptas sit aspernatur aut odit aut fugit, sed quia
                        consequuntur magni dolores eos qui ratione voluptatem sequi
                        nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
                        sit amet, consectetur, adipisci velit, sed quia non numquam eius
                        modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                        voluptatem.
                    </p>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">

import users from '~/data/users.json'

console.log('users', users)

const user = await users.users[0]
const home = user.location.find(l => l.type === 'home')

definePageMeta({
    name: 'Profile',
    layout: 'no-spacing',
})

</script>
