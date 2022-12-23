<template>
    <article
        class="rounded-lg p-1 text-center flex items-center relative flex-col bg-gradient-to-tl from-white via-white to-purple-600 overflow-hidden"
    >
        <div
            class="bg-white w-full flex items-center flex-col rounded-lg h-full p-8 gap-4 justify-between"
        >
            <div>
                <img
                    src="https://assets.codepen.io/285131/neongirl.jpg"
                    class="rounded-full h-32 aspect-square object-cover object-top"
                />
            </div>
            <h2 class="text-lg font-semibold">Elena Zoldado</h2>
            <small class="text-xs font-light">@elena_zoldado</small>
            <div class="mt-3 flex gap-2 text-white">
                <button class="btn btn-primary">Follow</button>
                <button class="btn btn-icon">
                    <i class="ph-export"></i>
                </button>
                <button class="btn btn-icon">
                    <i class="fa-solid fa-info" />
                </button>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts"></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.btn {
    border: 0;
    background-color: transparent;
    padding: 0;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    line-height: 1;
    transition: 0.15s ease;
}

.btn-primary {
    border-radius: 99em;
    background-color: #3772ff;
    background-image: linear-gradient(135deg, #5587ff, #3772ff);
    color: #fff;
    padding: 0 1.375em;
}

.btn-primary:hover,
.btn-primary:focus {
    background-size: 150%;
}

.btn-icon {
    height: 46px;
    width: 46px;
    border-radius: 50%;
    border: 3px solid #343945;
    color: #ffffff;
}

.btn-icon i {
    font-size: 1.25em;
}

.btn-icon:hover,
.btn-icon:focus {
    border-color: #7d8396;
}

.profile-links {
    margin-top: 3.5rem;
}

.link {
    text-decoration: none;
    color: #7d8396;
    margin-left: 0.375rem;
    margin-right: 0.375rem;
}

.link i {
    font-size: 1.25em;
}
</style>
