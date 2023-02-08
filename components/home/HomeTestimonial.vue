<template>
    <body class="overflow-hidden">
        <div class="relative mx-4 lg:mx-20 my-12 lg:my-24">
            <button
                @click="goNext()"
                class="z-10 cursor-pointer absolute right-0 -top-8 lg:top-0"
            >
                <img
                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/testimonials_III_Svg1.svg"
                    alt="next"
                />
            </button>
            <button
                @click="goPrev()"
                class="z-10 absolute -top-8 lg:top-0 right-8"
            >
                <img
                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/testimonials_III_Svg2.svg"
                    alt="prev"
                />
            </button>
            <div class="slider">
                <div class="slide-ana">
                    <div style="transform: translateX(-200%)">
                        <div
                            class="flex flex-col lg:flex-row w-full gap-10 lg:gap-6"
                        >
                            <img
                                class="hidden w-full lg:block lg:h-96"
                                src="https://i.ibb.co/CQ4VzxP/Group-723-1.png"
                                alt="a woman"
                            />
                            <img
                                class="hidden md:block lg:hidden"
                                src="https://i.ibb.co/s2VCV3j/image-1.png"
                                alt="a woman"
                            />
                            <img
                                class="md:hidden"
                                src="https://i.ibb.co/5YY9XH9/image-1.png"
                                alt="a woman"
                            />
                            <div class="relative">
                                <div class="absolute top-0 left-0">
                                    <img
                                        src="https://tuk-cdn.s3.amazonaws.com/can-uploader/testimonials_III_Svg3.svg"
                                        alt="commas"
                                    />
                                </div>
                                <div class="absolute right-0 bottom-14">
                                    <img
                                        src="https://tuk-cdn.s3.amazonaws.com/can-uploader/testimonials_III_Svg4.svg"
                                        alt="commas"
                                    />
                                </div>
                                <div class="relative py-16 md:px-10 lg:px-12">
                                    <p
                                        class="text-lg lg:pr-10 leading-relaxed text-gray-600"
                                    >
                                        It is a long established fact that a
                                        reader will be distracted by the
                                        readable content of a page when looking
                                        at its layout. The point of using this
                                        project.In the first place we have
                                        granted to God, and by this our present
                                        charter confirmed for us and our heirs
                                        forever that the English Church shall be
                                        free, and shall have her rights entire,
                                        and her liberties inviolate; and we will
                                        that it be thus observed; which is
                                        apparent from
                                    </p>
                                    <p
                                        class="pt-14 pb-2 text-xl font-medium leading-tight text-indigo-700"
                                    >
                                        Maria Chilvers
                                    </p>
                                    <p
                                        class="text-base leading-none text-gray-600"
                                    >
                                        CEO & Co-founder
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="transform: translateX(-100%)">
                        <div
                            class="flex flex-col lg:flex-row w-full gap-10 lg:gap-6"
                        >
                            <img
                                class="hidden w-full lg:block lg:h-96"
                                src="https://i.ibb.co/CQ4VzxP/Group-723-1.png"
                                alt="a woman"
                            />
                            <img
                                class="hidden md:block lg:hidden"
                                src="https://i.ibb.co/s2VCV3j/image-1.png"
                                alt="a woman"
                            />
                            <img
                                class="md:hidden"
                                src="https://i.ibb.co/5YY9XH9/image-1.png"
                                alt="a woman"
                            />
                            <div class="relative">
                                <div class="absolute top-0 left-0">
                                    <img
                                        src="https://tuk-cdn.s3.amazonaws.com/can-uploader/testimonials_III_Svg3.svg"
                                        alt="commas"
                                    />
                                </div>
                                <div class="absolute right-0 bottom-14">
                                    <img
                                        src="https://tuk-cdn.s3.amazonaws.com/can-uploader/testimonials_III_Svg4.svg"
                                        alt="commas"
                                    />
                                </div>
                                <div
                                    class="relative py-16 px-5 md:px-10 lg:px-12"
                                >
                                    <p
                                        class="text-lg lg:pr-10 leading-relaxed text-gray-600"
                                    >
                                        It is a long established fact that a
                                        reader will be distracted by the
                                        readable content of a page when looking
                                        at its layout. The point of using this
                                        project.In the first place we have
                                        granted to God, and by this our present
                                        charter confirmed for us and our heirs
                                        forever that the English Church shall be
                                        free, and shall have her rights entire,
                                        and her liberties inviolate; and we will
                                        that it be thus observed; which is
                                        apparent from
                                    </p>
                                    <p
                                        class="pt-14 pb-2 text-xl font-medium leading-tight text-indigo-700"
                                    >
                                        Maria Chilvers
                                    </p>
                                    <p
                                        class="text-base leading-none text-gray-600"
                                    >
                                        CEO & Co-founder
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="transform: translateX(0%)">
                        <div
                            class="flex flex-col lg:flex-row w-full gap-10 lg:gap-6"
                        >
                            <img
                                class="hidden w-full lg:block lg:h-96"
                                src="https://i.ibb.co/CQ4VzxP/Group-723-1.png"
                                alt="a woman"
                            />
                            <img
                                class="hidden md:block lg:hidden"
                                src="https://i.ibb.co/s2VCV3j/image-1.png"
                                alt="a woman"
                            />
                            <img
                                class="md:hidden"
                                src="https://i.ibb.co/5YY9XH9/image-1.png"
                                alt="a woman"
                            />
                            <div class="relative">
                                <div class="absolute top-0 left-0">
                                    <img
                                        src="https://tuk-cdn.s3.amazonaws.com/can-uploader/testimonials_III_Svg3.svg"
                                        alt="commas"
                                    />
                                </div>
                                <div class="absolute right-0 bottom-14">
                                    <img
                                        src="https://tuk-cdn.s3.amazonaws.com/can-uploader/testimonials_III_Svg4.svg"
                                        alt="commas"
                                    />
                                </div>
                                <div
                                    class="relative py-16 px-5 md:px-10 lg:px-12"
                                >
                                    <p
                                        class="text-lg lg:pr-10 leading-relaxed text-gray-600"
                                    >
                                        It is a long established fact that a
                                        reader will be distracted by the
                                        readable content of a page when looking
                                        at its layout. The point of using this
                                        project.In the first place we have
                                        granted to God, and by this our present
                                        charter confirmed for us and our heirs
                                        forever that the English Church shall be
                                        free, and shall have her rights entire,
                                        and her liberties inviolate; and we will
                                        that it be thus observed; which is
                                        apparent from
                                    </p>
                                    <p
                                        class="pt-14 pb-2 text-xl font-medium leading-tight text-indigo-700"
                                    >
                                        Maria Chilvers
                                    </p>
                                    <p
                                        class="text-base leading-none text-gray-600"
                                    >
                                        CEO & Co-founder
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script setup lang="ts">
const slides = ref()
const slideSayisi = ref()
const loop = ref()

onMounted(() => {
    slides.value = document.querySelectorAll('.slide-ana>div')
    slideSayisi.value = slides.value.length
    for (let index = 0; index < slides.value.length; index++) {
        const element = slides.value[index]
        element.style.transform = 'translateX(' + 100 * index + '%)'
    }
    loop.value = 0 + 1000 * slideSayisi.value
})

function goNext() {
    loop.value++
    for (let index = 0; index < slides.value.length; index++) {
        const element = slides.value[index]
        element.style.transform =
            'translateX(' +
            100 * (index - (loop.value % slideSayisi.value)) +
            '%)'
    }
}

function goPrev() {
    loop.value--
    for (let index = 0; index < slides.value.length; index++) {
        const element = slides.value[index]
        element.style.transform =
            'translateX(' +
            100 * (index - (loop.value % slideSayisi.value)) +
            '%)'
    }
}
</script>

<style>
.slider {
    width: 100%;
    position: relative;
    overflow: hidden;
}

.slide-ana {
    height: 700px;
}

.slide-ana > div {
    position: absolute;
    transition: all 1s;
}

@media (max-width: 639px) {
    .slide-ana {
        height: 1150px;
    }
}

@media (max-width: 767px) {
    .slide-ana {
        height: 1250px;
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .slide-ana {
        height: 1000px;
    }
}
</style>
