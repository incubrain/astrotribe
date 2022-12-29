<template>
    <div class="bg-white p-6 rounded-lg shadow-lg flex flex-row gap-10">
        <div>
            <FormKit
                label="Username"
                type="text"
                help="Pick a new username"
                validation="required|matches:/^@[a-zA-Z]+$/|length:5"
                value="@useFormKit"
            />
            <!-- location -->
            <!-- <FormKit
      type="form"
      #default="{ value }"
      :actions="false"
    >
      <FormKit
        type="autocomplete"
        name="country"
        label="Search for a country"
        placeholder="Example: United States"
      />
      <pre wrap>{{ value }}</pre>
    </FormKit> -->
            <FormKit
                type="date"
                value="2011-01-01"
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
                    matches: 'Phone number must be in the format xxx-xxx-xxxx',
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
        <FormSocial />
        <FormTags />
        <FormKit
            type="checkbox"
            label="Toppings"
            :options="['Mushrooms', 'Olives', 'Salami', 'Anchovies']"
            decorator-icon="happy"
            help="Select your pizza toppings"
            validation="required|min:3"
        />
    </div>
</template>
P
<script setup lang="ts"></script>
