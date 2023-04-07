<template>
  <div
    class="space h-full w-full flex justify-center items-center flex-col max-w-full max-h-full relative p-10 overflow-hidden"
  >
    <div id="space" class="h-[250vh] w-[250vw] animate-spin-slow bg-black absolute">
      <div class="star animate-glitter" />
    </div>
    <img class="ship" src="/rocket.png">
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
    <div class="relative w-full pt-20 text-center">
      <h1 class="text-[8vh] pt-[5vh] lg:text-[12vh] lg:pt-0">
        AstroTribe
      </h1>
      <h2 class="text-[3vh] lg:text-[4vh] arriving-soon">
        Arriving Soon!
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">

onMounted(() => {
  const limit = 500
  const space = document.getElementById('space')

  const stars = {
    rand: () => {
      return Math.random()
    },

    createStar: () => {
      const star = document.createElement('div')
      star.className = 'star'

      return star
    },

    create: () => {
      for (let i = 0; i <= limit; i += 1) {
        const star = stars.createStar()
        star.style.top = `${stars.rand() * 100}%`
        star.style.left = `${stars.rand() * 100}%`
        star.style.animation = `glitter 8s ease-in ${stars.rand() * 8}s infinite`
        space.appendChild(star)
      }
    }
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
    --timing: 22s;
    --curve1: cubic-bezier(0.455, 0.03, 0.615, 0.555);
    --curve2: cubic-bezier(0.645, 0.045, 0.355, 1);
}

.arriving-soon {
    font-family: 'Mansalva', cursive;
}

.mars {
    position: relative;
    z-index: 2;
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
    top: calc(50% - 10vh);
    margin-top: -55px;
    margin-right: -55px;
    height: 38px;
    background: rgba(0, 0, 0, 0.1);
    transform-origin: 0% 100% 0;
    z-index: 1;
    animation: ship var(--timing) var(--curve2) infinite;
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
        transform: rotate(-120deg);
    }
    40% {
        right: 52%;
        top: calc(50% + 10px);
        transform: rotate(-50deg);
    }
    79.5% {
        margin-top: -20px;
        right: 50%;
        margin-right: -75px;
        top: calc(50% - 12vh - 75px);
        transform: rotate(47deg);
    }
    84% {
        margin-top: 0;
        margin-right: 0px;
        /* top: calc(50% - 12vh - 55px); */
        right: calc(50% - 14px);
        transform: rotate(20deg);
    }
    100% {
        /* margin-top: 0px; */
        transform: rotate(0deg);
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

.star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgb(242, 202, 202);
    opacity: 0;
}
</style>
