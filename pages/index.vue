<template>
    <div
        class="min-h-full grid 
        max-w-[1240px] mx-auto 
        grid-cols-[minmax(160px,1fr)]
        lg:grid-cols-[minmax(140px,.4fr)_minmax(600px,4fr)_minmax(140px,0.4fr)]"
    >
        <div
            class="bg-red-200 rounded-lg row-start-1 col-span-1 lg:col-span-3 col-start-1 w-full h-[420px] relative bg-cover"
            :style="{ 'background-image': `url('./cover.jpg')` }"
        ></div>
        <div
            class="bg-white w-full h-[200px] relative col-start-2 row-span-1 row-start-2 py-[140px] px-12 rounded-b-lg"
        >
            <div
                class="absolute left-0 top-[-120px] w-[240px] h-[240px] rounded-full bg-black border-8 border-white"
            >
                <SupaUpload />
            </div>
            <div>
                <h1 class="text-2xl font-semibold">Drew MacGibbon</h1>
                <h4 class="text-lg">Mac Astronomer</h4>
                <h6 class="text-md pt-3 flex items-center">
                    <Icon name="uil:location-point" size="18px" />
                    Pune, India
                </h6>
            </div>
            <div class="absolute bottom-12 right-12 pl-[260px] flex items-center gap-4 justify-between 2-full">
                <Icon name="ion:ios-bell-outline" size="23px"/>
                <!-- <Icon name="ion:ios-bell" size="23px"/> -->
                <Icon name="fluent-mdl2:add-friend" size="23px"/>
                <Icon name="material-symbols:edit-outline-sharp" size="23px"/>
                <button class="px-6 py-2 text-sm bg-black rounded-lg shadow-lg">Message</button>
            </div>
            <div class="absolute top-4 pl-[200px] flex items-center gap-4 justify-between 2-full">
                <p class="px-6 py-2 text-lg font-normal">A personal quote to show your personality and likes</p>
            </div>
        </div>
        <!-- <div
        class="bg-white p-6 shadow-lg flex flex-row gap-6 justify-between  w-full rounded-b-lg"
        >
            <InteractiveModal>
                <FormEditModal />
            </InteractiveModal>
        </div> -->
        <div
            class="bg-white w-full relative p-12 rounded-lg mt-10 row-start-3 row-span-1 col-start-2"
        >
            <h1 class="text-2xl pb-4 font-semibold">About</h1>
            <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
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
        <AppifyTest  class="col-start-2 row-start-4"/>
    </div>
</template>

<script setup lang="ts">

definePageMeta({ name: 'Home' })

</script>

<style scoped></style>
