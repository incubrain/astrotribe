<template>
    <div
        id="space"
        class="space h-full w-full flex justify-center items-center"
    >
        <div id="stars"></div>
        <div class="ship">
            <div class="ship-rotate">
                <div class="fuselage"></div>
                <div class="pod"></div>
            </div>
        </div>
        <div class="ship-shadow"></div>
        <div class="mars">
            <div class="tentacle"></div>
            <div class="flag">
                <div class="small-tentacle"></div>
            </div>
            <div class="planet">
                <div class="surface"></div>
                <div class="crater1"></div>
                <div class="crater2"></div>
                <div class="crater3"></div>
            </div>
        </div>
        <div class="relative w-full pt-[300px] text-center">
            <h1 class="text-[7vw]">AstroTribe</h1>
            <h2 class="text-[2vw] arriving-soon">Arriving Soon!</h2>
        </div>
    </div>
</template>

<script setup lang="ts">

onMounted(() => {
    let limit = 1001
    const space = document.getElementById('space')

    const stars = {
        rand: () => {
            return Math.random()
        },

        createStar: () => {
            let star = document.createElement('div')
            star.className = 'star'

            return star
        },

        create: () => {
            for (let i = 0; i <= limit; i += 1) {
                let star = stars.createStar()
                star.style.top = `${stars.rand() * 100}%`
                star.style.left = `${stars.rand() * 100}%`
                star.style.animationDelay = `${stars.rand() * 8}s`
                space.appendChild(star)
            }
        },
    }

    stars.create()
})
</script>

<style>
/* @import 'compass/css3'; */

@import url('https://fonts.googleapis.com/css2?family=Mansalva&family=Merienda:wght@300;400;500;600;700;800;900&display=swap');

:root {
    --space: #435d70;
    --space-shadow: #374d5c;
    --ship: #eee;
    --mars: #ff5f40;
    --alien: #1aae1e;
    --gray: #aaa;
    --timing: 12s;
    --curve1: cubic-bezier(0.455, 0.03, 0.615, 0.555);
    --curve2: cubic-bezier(0.645, 0.045, 0.355, 1);
}

.arriving-soon {
    font-family: 'Mansalva', cursive;
}

.space {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
    overflow: hidden;
}

.mars {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    /* animation: planet-bump var(--timing) var(--curve2) infinite; */
}
.tentacle {
    position: absolute;
    top: -60px;
    right: -80px;
    z-index: 1;
    height: 70px;
    width: 70px;
    box-sizing: border-box;
    border-radius: 100%;
    border-left: 15px solid var(--alien);
    transform: rotate(-30deg);
    animation: tentacle var(--timing) var(--curve2) infinite;
}

.flag {
    position: absolute;
    height: 17px;
    width: 15px;
    top: -57px;
    left: -1px;
    animation: flag-pole var(--timing) var(--curve2) infinite;
}

.flag:before {
    content: '';
    position: absolute;
    height: 17px;
    width: 2px;
    background: #eee;
}

.flag:after {
    content: '';
    position: absolute;
    height: 10px;
    width: 14px;
    left: 2px;
    top: 0;
    background: var(--gray);
    animation: flag-unfurl var(--timing) var(--curve2) infinite;
}

.small-tentacle {
    position: absolute;
    left: -16px;
    top: 3px;
    height: 50px;
    width: 50px;
    border-left: 10px solid var(--alien);
    border-radius: 100%;
    transform: rotate(25deg);
    animation: small-tentacle var(--timing) var(--curve2) infinite;
    z-index: 2;
}

.small-tentacle:before {
    content: '';
    position: absolute;
    top: 80px;
    left: -30px;
    height: 10px;
    width: 60px;
    background: rgba(0, 0, 0, 0.2);
    background: var(--space-shadow);
    border-radius: 100%;
}

.planet {
    box-sizing: border-box;
    position: absolute;
    border-radius: 100%;
    height: 120px;
    width: 120px;
    overflow: hidden;
    margin-left: -60px;
    margin-top: -60px;
    z-index: 2;
}

.surface {
    position: absolute;
    border-radius: 100%;
    height: 140%;
    width: 140%;
    top: -30%;
    right: -10%;
    box-sizing: border-box;
    border: 30px solid rgba(0, 0, 0, 0.15);
    background: var(--mars);
}
.crater1,
.crater2,
.crater3 {
    position: absolute;
    border-radius: 100%;
    background: rgba(0, 0, 0, 0.15);
    box-shadow: inset 3px 3px 0 rgba(0, 0, 0, 0.2);
}
.crater1 {
    height: 20px;
    width: 20px;
    top: 32%;
    left: 17%;
}

.crater2 {
    height: 10px;
    width: 10px;
    top: 26%;
    left: 55%;
    box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.crater3 {
    height: 10px;
    width: 10px;
    top: 60%;
    left: 40%;
    box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.ship {
    position: absolute;
    right: 50%;
    top: 50%;
    margin-top: -55px;
    margin-right: -55px;
    height: 22px;
    background: rgba(0, 0, 0, 0.1);
    transform-origin: 0% 100% 0;
    z-index: 1;
    animation: ship var(--timing) var(--curve2) infinite;
}
.ship-rotate {
    position: absolute;
    height: 22px;
    transform: rotate(-110deg);
    animation: ship-rotate var(--timing) var(--curve2) infinite;
}

.pod {
    position: absolute;
    top: 0;
    left: -8px;
    height: 16px;
    width: 16px;
    background: var(--ship);
    border-radius: 100% 0 100% 0;
    transform: rotate(-45deg);
}

.fuselage {
    position: absolute;
    top: 14px;
    left: -6px;
    height: 8px;
    width: 12px;
    background: var(--ship);
    border-radius: 100% 100% 0 0;
}

.fuselage:after {
    content: '';
    position: absolute;
    left: 2px;
    top: 100%;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid red;
}

.ship-shadow {
    position: absolute;
    right: 10%;
    top: 50%;
    margin-right: -28px;
    margin-top: 83px;
    height: 4px;
    width: 16px;
    background: var(--space-shadow);
    border-radius: 100%;
    animation: ship-shadow var(--timing) var(--curve2) infinite;
}

@keyframes small-tentacle {
    0% {
        transform: rotate(-60deg);
    }
    86% {
        transform: rotate(-60deg);
    }
    89% {
        transform: rotate(10deg);
    }
    100% {
        transform: rotate(10deg);
    }
}

@keyframes tentacle {
    0% {
        transform: rotate(-30deg);
    }
    75% {
        transform: rotate(-30deg);
    }
    80% {
        transform: rotate(-165deg) translate(6px, 8px);
    }
    82.5% {
        transform: rotate(-165deg) translate(28px, -17px);
    }
    100% {
        transform: rotate(-165deg) translate(35px, -22px);
    }
}

@keyframes ship {
    0% {
        right: -10%;
        top: -10%;
        margin-top: -55px;
        margin-right: -55px;
    }
    40% {
        right: 50%;
        top: 50%;
    }
    79.5% {
        margin-top: -55px;
        margin-right: -55px;
    }
    84% {
        margin-top: -20px;
        margin-right: 0px;
    }
    100% {
        right: 50%;
        top: 50%;
        margin-top: 0px;
        margin-right: 0px;
    }
}

@keyframes ship-rotate {
    0% {
        transform: rotate(-110deg);
    }
    20% {
        transform: rotate(-110deg);
    }
    34% {
        transform: rotate(47deg);
    }
    79% {
        transform: rotate(47deg);
    }
    100% {
        transform: rotate(47deg);
    }
}

@keyframes ship-shadow {
    0% {
        right: -10%;
        transform: scale(1.4, 1);
        opacity: 0.3;
    }
    40% {
        right: 50%;
        transform: scale(0.75, 1);
        opacity: 1;
    }
    100% {
        right: 50%;
    }
}

@keyframes planet-bump {
    0% {
        margin-left: 0;
    }
    39% {
        margin-left: 0;
    }
    40% {
        margin-left: -1px;
    }
    40.5% {
        margin-left: 1px;
    }
    41% {
        margin-left: 0;
    }
    100% {
        margin-left: 0;
    }
}

@keyframes flag-pole {
    0% {
        top: -57px;
    }
    48% {
        top: -57px;
    }
    54% {
        top: -77px;
    }
    90% {
        top: -77px;
    }
    92% {
        top: -57px;
    }
    100% {
        top: -57px;
    }
}

@keyframes flag-unfurl {
    0% {
        width: 0;
    }
    55% {
        width: 0;
    }
    60% {
        width: 14px;
    }
    90% {
        width: 14px;
    }
    100% {
        width: 14px;
    }
}

/* space background */

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes glitter {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }
    25% {
        transform: scale(1.6);
        opacity: 1;
    }
    50% {
        transform: scale(0.8);
        opacity: 0;
    }
    75% {
        transform: scale(1.6);
        opacity: 1;
    }
    100% {
        transform: scale(0.8);
        opacity: 0;
    }
}

html,
body {
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: #000;
}

* {
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    box-sizing: border-box;
}

#space {
    position: absolute;
    height: 400vh;
    width: 400vw;
    left: -150vw;
    top: -150vh;
    overflow: hidden;
    background: #000;
    transform-origin: 50% 50%;
    animation: spin 500s linear 0s infinite normal;
}

.star {
    position: absolute;
    width: 1px;
    height: 1px;
    background: #999;
    opacity: 0;
    animation: glitter 8s ease-in 0s infinite normal;
}
</style>
