<template>
    <div>

        <CommonCoverImg :coverImg="user.cover_image" />
        <div
            class="min-h-full grid grid-cols-[minmax(160px,1fr)] lg:grid-cols-[minmax(140px,.4fr)_minmax(600px,4fr)_minmax(140px,0.4fr)] lg:max-w-[1240px] mx-auto max-w-[95%]"
        >
            <div
                class="rounded-lg row-start-1 col-span-1 lg:col-start-2 w-full h-[220px] lg:h-[420px] relative bg-cover"
            >
                <div
                    class="lg:col-start-2 absolute bottom-0 right-0 bg-[#343434] py-2 px-4 rounded-t-lg flex flex-col justify-center"
                >
                    <h3 class="text-[22px] pb-1">AstroGuide Rating</h3>
                    <AppStars
                        :rating="user.guide.overall_rating"
                        :starSize="26"
                    />
                </div>
            </div>
            <div
                class="bg-white w-full h-[200px] relative lg:col-start-2 row-span-1 row-start-2 py-[140px] px-12 rounded-b-lg"
            >
                <ProfileBlockAvatar :avatar="user.avatar" />
                <ProfileBlockInfo :user="user" />
                <!-- ! Todo | add message and follow func -->
                <!-- <div
                        class="absolute bottom-12 right-12 lg:pl-[260px] pl-[100px] flex items-center gap-4 justify-between 2-full"
                    >
                        <Icon name="ion:ios-bell-outline" size="23px" />
                        <Icon name="ion:ios-bell" size="23px"/>
                        <Icon name="fluent-mdl2:add-friend" size="23px" />
                        <Icon name="material-symbols:edit-outline-sharp" size="23px" />
                        <button class="px-6 py-2 text-sm bg-black rounded-lg shadow-lg">
                            Message
                        </button>
                    </div> -->
            </div>
            <div
                class="w-full relative grid grid-cols-1 lg:grid-cols-3 mt-6 gap-6 row-start-3 row-span-1 lg:col-start-2"
            >
                <CommonBlockText
                    :body="user.introduction"
                    title="Introduction"
                    class="lg:col-span-2"
                />
                <ProfileBlockAstroRating :skills="user.guide.skills" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const s  = appState()
const user = s.user

</script>

<style scoped></style>
