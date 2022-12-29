<template>
    <div
        class="min-h-full grid 
        grid-cols-[minmax(160px,1fr)]
        lg:grid-cols-[minmax(100px,.2fr)_minmax(600px,4fr)_minmax(100px,0.2fr)]
        rounded-md shadow-sm"
    >
        <div class="bg-red-200 rounded-lg row-start-1 col-span-1 lg:col-span-3 col-start-1 w-full h-[360px] relative">
        </div>
        <div class="bg-white w-full h-[200px] relative col-start-2 row-span-1 row-start-2">
            <div class="absolute left-0 top-[-120px] w-[240px] h-[240px] rounded-full bg-black border-8 border-white">
                <SupaUpload />
            </div>

        </div>
        <div class="bg-white p-6 shadow-lg flex flex-row gap-6 justify-between row-start-3 col-start-2 w-full">
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
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'Home' })
</script>

<style scoped>

</style>
