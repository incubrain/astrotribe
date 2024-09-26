<template>
  <div class="flex justify-center w-full pb-4 mt-10 lg:w-1/2 lg:mt-0 lg:justify-end lg:pb-0">
    <div class="w-10/12 lg:w-1/2">
      <h1 class="mb-6 text-lg font-semibold tracking-wide text-center text-white lg:text-left">
        Subscribe to our Newsletter
      </h1>
      <div class="flex justify-center">
        <div class="relative flex items-center justify-center w-full rounded-2xl">
          <input
            id="email"
            type="email"
            required="true"
            placeholder="Your Email"
            aria-label="email"
            class="w-full h-12 pl-4 text-xs text-gray-700 placeholder-gray-600 bg-transparent rounded-lg lg:h-16 sm:text-base focus:outline-none"
          />
          <button
            type="submit"
            class="absolute inset-y-0 right-0 h-full px-2 py-2 text-xs font-medium transition duration-150 ease-in-out border-l border-gray-300 rounded focus:outline-none lg:text-base text-primary-700 sm:px-6 lg:py-4"
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
