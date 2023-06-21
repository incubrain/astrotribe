<template>
  <div>
    <div class="w-full flex justify-start text-gray-600 mb-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-wallet"
        width="52"
        height="52"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <path
          d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"
        />
        <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
      </svg>
    </div>
    <h1
      class="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4"
    >
      Enter Billing Details
    </h1>
    <label
      for="name"
      class="text-gray-800 text-sm font-bold leading-tight tracking-normal"
    >Owner Name</label>
    <input
      id="name"
      class="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
      placeholder="James"
    />
    <label
      for="email2"
      class="text-gray-800 text-sm font-bold leading-tight tracking-normal"
    >Card Number</label>
    <div class="relative mb-5 mt-2">
      <div
        class="absolute text-gray-600 flex items-center px-4 border-r h-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-credit-card"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="7" y1="15" x2="7.01" y2="15" />
          <line x1="11" y1="15" x2="13" y2="15" />
        </svg>
      </div>
      <input
        id="email2"
        class="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-16 text-sm border-gray-300 rounded border"
        placeholder="XXXX - XXXX - XXXX - XXXX"
      />
    </div>
    <label
      for="expiry"
      class="text-gray-800 text-sm font-bold leading-tight tracking-normal"
    >Expiry Date</label>
    <div class="relative mb-5 mt-2">
      <div
        class="absolute right-0 text-gray-600 flex items-center pr-3 h-full cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-calendar-event"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <rect x="4" y="5" width="16" height="16" rx="2" />
          <line x1="16" y1="3" x2="16" y2="7" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="4" y1="11" x2="20" y2="11" />
          <rect x="8" y="15" width="2" height="2" />
        </svg>
      </div>
      <input
        id="expiry"
        class="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
        placeholder="MM/YY"
      />
    </div>
    <label
      for="cvc"
      class="text-gray-800 text-sm font-bold leading-tight tracking-normal"
    >CVC</label>
    <div class="relative mb-5 mt-2">
      <div
        class="absolute right-0 text-gray-600 flex items-center pr-3 h-full cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-info-circle"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z"></path>
          <circle cx="12" cy="12" r="9"></circle>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
          <polyline points="11 12 12 12 12 16 13 16"></polyline>
        </svg>
      </div>
      <div class="w-full">
        <FormKit
          label="Username"
          type="text"
          help="Pick a new username"
          validation="required|matches:/^@[a-zA-Z]+$/|length:5"
          value="@useFormKit"
        />
        <FormKit
          type="date"
          value="yyyy-mm-dd"
          label="Birthday"
          help="Enter your birth day"
          validation="required|date_before:2010-01-01"
          validation-visibility="live"
        />
        <FormKit
          type="email"
          label="Student email address"
          help="Please enter your student email address."
          validation="required|email|ends_with:.edu"
          validation-visibility="live"
          placeholder="vikas@school.edu"
        />
        <FormKit
          type="tel"
          label="Phone number"
          placeholder="xxx-xxx-xxxx"
          validation="matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
          :validation-messages="{
            matches:
              'Phone number must be in the format xxx-xxx-xxxx',
          }"
          validation-visibility="dirty"
        />
        <FormKit
          type="textarea"
          label="Your Essay"
          rows="10"
          placeholder="Remember to write in complete sentences."
          help="I'll know if you didn't read the book!"
        />
        <FormKit type="button" help="You can bind event listeners.">
          Click me!
        </FormKit>
      </div>
      <!-- <FormSocial /> -->
      <div class="w-full ">
        <FormKit
          type="checkbox"
          label="Toppings"
          :options="['Mushrooms', 'Olives', 'Salami', 'Anchovies']"
          decorator-icon="happy"
          help="Select your pizza toppings"
          validation="required|min:3"
        />
      </div>
      <input
        id="cvc"
        class="mb-8 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
        placeholder="MM/YY"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
