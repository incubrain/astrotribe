<template>
  <div>
    <h4 class="form-label">
      Creating the form
    </h4>
  </div>
  <h1>New Character</h1>

  <FormKit type="form">
    <FormKit
      id="name"
      type="text"
      name="name"
      validation="required|not:Admin"
      label="Name"
      help="Enter your character's full name"
      placeholder="“Scarlet Sword”"
    />

    <FormKit
      id="class"
      type="select"
      label="Class"
      name="class"
      placeholder="Select a class"
      :options="['Warrior', 'Mage', 'Assassin']"
    />

    <FormKit
      id="strength"
      type="range"
      name="strength"
      label="Strength"
      value="5"
      validation="min:2|max:9"
      validation-visibility="live"
      min="1"
      max="10"
      step="1"
      help="How many strength points should this character have?"
    />

    <FormKit
      id="skill"
      type="range"
      name="skill"
      validation="required|max:10"
      label="Skill"
      value="5"
      min="1"
      max="10"
      step="1"
      help="How much skill points to start with"
    />

    <FormKit
      id="dexterity"
      type="range"
      name="dexterity"
      validation="required|max:10"
      label="Dexterity"
      value="5"
      min="1"
      max="10"
      step="1"
      help="How much dexterity points to start with"
    />
  </FormKit>
</template>
