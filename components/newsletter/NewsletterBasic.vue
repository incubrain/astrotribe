<template>
  <div class="w-full lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:justify-end pb-4 lg:pb-0">
    <div class="w-10/12 lg:w-1/2">
      <h1 class="text-lg text-white font-semibold tracking-wide mb-6 text-center lg:text-left">
        Subscribe to our Newsletter
      </h1>
      <div class="flex justify-center">
        <div class="w-full bg-white rounded-2xl flex justify-center items-center relative">
          <input
            id="email"
            type="email"
            required="true"
            placeholder="Your Email"
            aria-label="email"
            class="placeholder-gray-600 h-12 lg:h-16 pl-4 rounded-lg text-gray-700 text-xs sm:text-base bg-transparent focus:outline-none w-full"
          />
          <button
            type="submit"
            class="absolute right-0 inset-y-0 h-full focus:outline-none transition duration-150 border-l border-gray-300 text-xs lg:text-base font-medium text-indigo-700 ease-in-out rounded px-2 sm:px-6 py-2 lg:py-4"
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
