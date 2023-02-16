<template>
    <div
        class="py-4 m-0 relative bg-white rounded-lg overflow-hidden flex flex-col justify-between animate-swipe-in scale-x-0 origin-left"
    >
        <div class="user-block">
            <div class="photo">
                <img src="/avatar.png" />
            </div>
            <section class="user-info">
                <h3>Drew MacGibbon <em>hosting</em></h3>
                <span class="date">10 October 2020, 09:15 am</span>
            </section>
        </div>
        <h3 class="pb-4 pl-4 flex items-center">
            <Icon name="uil:location-point" size="20px" class="mr-2" />
            Hilton Resort
        </h3>
        <article>
            <figure>
                <img src="/cover1.jpg" />
            </figure>
            <section class="article-info">
                <div class="date">
                    <span class="day">10</span>
                    <span class="month">Oct</span>
                </div>
                <h2>Come gaze at some stars</h2>
                <span class="text-sm text-black font-thin">Documentary</span>
            </section>
            <!-- <div
                class="flex flex-wrap gap-4 justify-left items-center text-black p-6"
            >
                <ul class="flex flex-row">
                    <li class="-mr-4 p-1.5 bg-white rounded-full">
                        <img src="/avatar.png" class="rounded-full h-10" />
                    </li>
                    <li class="-mr-4 p-1.5 bg-white rounded-full">
                        <img src="/avatar.png" class="rounded-full h-10" />
                    </li>
                    <li class="-mr-4 p-1.5 bg-white rounded-full">
                        <img src="/avatar.png" class="rounded-full h-10" />
                    </li>
                    <li class="-mr-4 p-1.5 bg-white rounded-full">
                        <img src="/avatar.png" class="rounded-full h-10" />
                    </li>
                </ul>
                <span>+ 146 going</span>
            </div> -->
        </article>
        <!-- <div class="flex flex-row justify-end items-center w-full h-[40px] text-black px-4 gap-4">
            <div class="flex flex-row gap-2 justify-center items-center">
                <span class="leading-none">847</span>
                <Icon name="bx:upvote" size="24px"/>
            </div>
            <div class="flex flex-row justify-center gap-2 items-center">
                <span class="leading-none">37</span>
                <Icon name="ion:share-social-outline" size="24px"/>
            </div>
            <button class="bg-gray-100 h-full w-1/2 rounded-lg">rsvp</button>
        </div> -->
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');

.user-block {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 15px;
}

.user-block .photo {
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 100%;
    margin-right: 10px;
}

.user-block .photo img {
    width: 100%;
}

.user-block .user-info h3 {
    margin: 0 0 2px 0;
    font-size: 16px;
    color: #162b39;
    font-weight: 700;
}

.user-block .user-info h3 em {
    color: #8492a6;
    font-style: normal;
}

.user-block .user-info .date {
    display: block;
    color: #8492a6;
    font-weight: 400;
    font-size: 13px;
}

article figure {
    margin: 0;
}

article figure img {
    width: 100%;
}

article .article-info {
    position: relative;
    padding: 30px 15px 15px 15px;
}

article .article-info .date {
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: 0 10px 20px 0 rgba(0, 10, 14, 0.1);
    padding: 10px 15px;
    position: absolute;
    left: 15px;
    top: -40px;
}

article .article-info .date .day {
    display: block;
    color: #162b39;
    font-weight: 400;
    font-size: 20px;
    line-height: 20px;
    margin-bottom: 2px;
}

article .article-info .date .month {
    display: block;
    color: #d73601;
    font-weight: 700;
    font-size: 14px;
}

article .article-info h2 {
    margin: 0 0 3px 0;
    color: #162b39;
    font-weight: 700;
    font-size: 18px;
}

.reaction:first-child {
    margin-right: 30px;
}

.reaction span {
    font-size: 13px;
    font-weight: 400;
    display: inline-block;
    margin-left: 7px;
}

.reaction button svg {
    vertical-align: middle;
    width: 26px;
    transition: all 0.3s ease-in-out;
}
.reaction.comment button svg {
    fill: #c46fcc;
}

.share button svg {
    vertical-align: middle;
    width: 26px;
    fill: #8492a6;
    transition: all 0.3s ease-in-out;
}
</style>
