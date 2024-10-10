<template>
  <div class="p-4">
    <h1 class="mb-4 text-3xl font-bold"> Complete Your Profile </h1>
    <PrimeStepper
      v-model:value="activeStep"
      linear
    >
      <PrimeStepList>
        <PrimeStep value="1"> Personal Info </PrimeStep>
        <PrimeStep value="2"> Professional Info </PrimeStep>
        <PrimeStep value="3"> Interests </PrimeStep>
      </PrimeStepList>
      <PrimeStepPanels>
        <PrimeStepPanel value="1">
          <OnboardingAccount @next="nextStep" />
        </PrimeStepPanel>
        <PrimeStepPanel value="2">
          <OnboardingProfessional
            @next="nextStep"
            @prev="prevStep"
          />
        </PrimeStepPanel>
        <PrimeStepPanel value="3">
          <OnboardingInterests
            @prev="prevStep"
            @submit="handleSubmit"
          />
        </PrimeStepPanel>
      </PrimeStepPanels>
    </PrimeStepper>
  </div>
</template>

<script setup lang="ts">
const activeStep = ref('1')
const { form } = useOnboarding()

const nextStep = () => {
  activeStep.value = String(Number(activeStep.value) + 1)
}

const prevStep = () => {
  activeStep.value = String(Number(activeStep.value) - 1)
}

const handleSubmit = () => {
  console.log('Form submitted:', form)
  // You can add your API call here
}
</script>
