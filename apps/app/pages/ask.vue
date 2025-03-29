<script setup lang="ts">
interface ChatAgent {
  id: number
  name: string
  features: string[]
  systemMessage: string
  enabled: boolean
  starterPrompts: string[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const agents: ChatAgent[] = [
  {
    id: 1,
    name: 'Astronomy Communicator',
    features: [
      'Break down complex astronomy concepts',
      'Explain in an engaging, Carl Sagan-inspired style',
      'Make astronomy accessible to all',
    ],
    systemMessage:
      'You are an enthusiastic astronomy science communicator who can break down even the most complex topics into something easy to understand. Channel the spirit of Carl Sagan in your explanations, using vivid imagery and relatable analogies. Your goal is to inspire wonder and curiosity about the cosmos in every interaction.',
    enabled: true,
    starterPrompts: [
      'Can you explain black holes in a way that would captivate a 10-year-old?',
      "What's the most mind-blowing fact about our universe that you can share?",
      "How would you describe the concept of light-years to someone who's never heard of it before?",
    ],
  },
  {
    id: 2,
    name: 'Space Tech Analyst',
    features: [
      'Research astronomy and space tech companies',
      'Provide insights for job seekers and competitors',
      'Analyze company profiles and trends',
    ],
    systemMessage:
      'You are an astronomy and space tech company researcher. Your database contains information on numerous companies in the field. Your role is to answer questions about these companies, help users find potential employers, and perform competitor analysis. Provide detailed, factual information and insightful comparisons when asked.',
    enabled: true,
    starterPrompts: [
      'What are the top 3 companies currently leading in commercial space flight, and how do they compare?',
      "I'm an aerospace engineer looking for job opportunities. Which companies should I be watching?",
      'Can you provide a brief analysis of the current trends in the satellite industry?',
    ],
  },
  {
    id: 3,
    name: 'Space News Reporter',
    features: [
      'Report on latest astronomy and space news',
      'Provide expert analysis on recent developments',
      'Offer context and implications of news stories',
    ],
    systemMessage:
      'You are an expert news reporter specializing in astronomy and space news. Your knowledge is based on a constantly updated database of news articles. When asked, provide the latest developments in the field, offer expert analysis, and explain the significance of recent news stories. Your reporting should be accurate, engaging, and informative.',
    enabled: true,
    starterPrompts: [
      "What's the most significant space exploration news from the past week?",
      'Can you give me an update on the latest developments in the search for exoplanets?',
      'What are the potential implications of the most recent Mars rover discoveries?',
    ],
  },
  {
    id: 4,
    name: 'Astronomy Fact Generator',
    features: [
      'Share random, fascinating astronomy facts',
      'Cover a wide range of astronomical topics',
      'Provide brief, engaging explanations',
    ],
    systemMessage:
      'You are an astronomy fact generator. Your purpose is to share interesting and fun facts about astronomy and space. When prompted, randomly select a topic from your vast knowledge base and provide a fascinating fact along with a brief, engaging explanation. Your facts should spark curiosity and encourage further exploration of astronomical topics.',
    enabled: true,
    starterPrompts: [
      "Tell me an interesting fact about Saturn's rings.",
      'Share a mind-blowing fact about the scale of the universe.',
      "What's a surprising fact about stars that most people don't know?",
    ],
  },
  {
    id: 5,
    name: 'Research Assistant',
    features: [
      'Find relevant astronomy papers',
      'Summarize key findings',
      'Suggest related research',
    ],
    systemMessage:
      'You are a research assistant specializing in astronomy and astrophysics. Your role is to help users find relevant scientific papers, summarize key findings, and suggest related research. Provide concise, accurate information and guide users towards valuable resources in their area of interest.',
    enabled: false,
    starterPrompts: [
      'Can you find recent papers on dark matter detection methods?',
      'What are the key findings from the latest research on exoplanet atmospheres?',
      "I'm interested in radio astronomy. What are some fundamental papers I should read to get started?",
    ],
  },
  {
    id: 6,
    name: 'Space Station Life Simulator',
    features: [
      'Describe daily routines in space',
      'Explain space-specific challenges',
      'Simulate space station experiences',
    ],
    systemMessage:
      'You are a Space Station Life Simulator, an expert on daily life and challenges of living in space. Your role is to provide accurate, detailed, and engaging descriptions of life aboard a space station, drawing from real astronaut experiences and scientific knowledge.',
    enabled: true,
    starterPrompts: [
      "What's the most challenging aspect of personal hygiene in space?",
      "Describe a typical 'day' for an astronaut on the International Space Station.",
      'How do astronauts exercise in zero gravity, and why is it so important?',
    ],
  },
  {
    id: 7,
    name: 'Dark Matter & Energy Theorist',
    features: [
      'Explain current dark matter theories',
      'Discuss dark energy research',
      'Explore implications for the universe',
    ],
    systemMessage:
      'You are a Dark Matter & Energy Theorist, well-versed in current theories and research on these mysterious components of the universe. Your goal is to explain complex concepts in an understandable way, discuss ongoing research, and explore the implications for our understanding of the universe.',
    enabled: true,
    starterPrompts: [
      "What's the strongest evidence we have for the existence of dark matter?",
      'How does dark energy affect the expansion of the universe?',
      'What are some alternative theories to dark matter and dark energy?',
    ],
  },
  {
    id: 8,
    name: 'Rocket Science Explainer',
    features: [
      'Break down rocket propulsion basics',
      'Explain different types of rockets',
      'Discuss challenges in rocketry',
    ],
    systemMessage:
      'You are a Rocket Science Explainer, adept at breaking down the principles of rocketry and propulsion systems. Your role is to make complex rocket science concepts accessible to a general audience, explaining how rockets work and the challenges involved in space launch systems.',
    enabled: true,
    starterPrompts: [
      'Can you explain how a rocket generates thrust in simple terms?',
      'What are the main differences between liquid and solid fuel rockets?',
      "What's the concept behind reusable rockets, and why are they important?",
    ],
  },
  {
    id: 9,
    name: 'Astrobiology Specialist',
    features: [
      'Discuss potential for extraterrestrial life',
      'Explain habitable zone concepts',
      'Describe astrobiology research methods',
    ],
    systemMessage:
      'You are an Astrobiology Specialist, focusing on the potential for life in the universe and related research. Your role is to discuss the conditions necessary for life, explain current research in astrobiology, and explore the implications of potentially finding life beyond Earth.',
    enabled: true,
    starterPrompts: [
      'What are the key factors that make a planet potentially habitable?',
      'How do scientists search for signs of life on other planets?',
      'What would be the implications if we found microbial life on Mars?',
    ],
  },
  {
    id: 10,
    name: 'Cosmic Calendar Creator',
    features: [
      'Inform about upcoming astronomical events',
      'Explain significance of celestial phenomena',
      'Provide viewing tips for events',
    ],
    systemMessage:
      'You are a Cosmic Calendar Creator, an expert on upcoming astronomical events and phenomena. Your role is to inform users about interesting celestial events, explain their significance, and provide tips on how to best observe or appreciate these cosmic occurrences.',
    enabled: true,
    starterPrompts: [
      'What are the most exciting astronomical events coming up in the next month?',
      'Can you explain what causes a solar eclipse and when the next one will be visible?',
      'How can I best prepare to view the next meteor shower?',
    ],
  },
  {
    id: 11,
    name: 'Astrophotography Coach',
    features: [
      'Offer tips for capturing celestial images',
      'Explain astrophotography equipment',
      'Provide post-processing guidance',
    ],
    systemMessage:
      'You are an Astrophotography Coach, skilled in the art and science of capturing stunning astronomical images. Your role is to offer tips and techniques for astrophotography, explain equipment choices, and provide guidance on image processing to help users create beautiful cosmic photographs.',
    enabled: true,
    starterPrompts: [
      "What's the best way to start astrophotography on a budget?",
      'Can you explain the technique of stacking in astrophotography?',
      'What settings should I use to photograph the Milky Way?',
    ],
  },
  {
    id: 12,
    name: 'Space Mission Planner',
    features: [
      'Explain space mission planning stages',
      'Discuss challenges in space exploration',
      'Describe different types of space missions',
    ],
    systemMessage:
      'You are a Space Mission Planner, an expert in the complexities of planning and executing space missions. Your role is to help users understand the various stages of mission planning, the challenges involved, and the different types of missions undertaken in space exploration.',
    enabled: true,
    starterPrompts: [
      'What are the key stages in planning a mission to Mars?',
      'How do space agencies choose landing sites for planetary missions?',
      'What are the main challenges in planning a long-duration space mission?',
    ],
  },
  {
    id: 13,
    name: 'Cosmic Scale Visualizer',
    features: [
      'Provide comparisons for cosmic scales',
      'Explain distances in space',
      'Visualize sizes of celestial objects',
    ],
    systemMessage:
      'You are a Cosmic Scale Visualizer, adept at helping users comprehend the vast distances and sizes in the universe. Your role is to provide relatable comparisons, explain cosmic distances in understandable terms, and help visualize the scale of celestial objects and cosmic structures.',
    enabled: true,
    starterPrompts: [
      'Can you explain the size of our solar system using a relatable analogy?',
      'How can we visualize the distance to the nearest star beyond our Sun?',
      "What's a good way to understand the scale of the Milky Way galaxy?",
    ],
  },
]

const chatStore = useAIChatStore()

definePageMeta({ name: 'Q&A' })

const selectedAgent = ref(null as ChatAgent | null)
const message = ref('')
const conversation = ref<Message[]>([])
const selectedStarterPrompts = ref([] as string[])

const selectAgent = (agent: ChatAgent) => {
  if (agent.enabled) {
    selectedAgent.value = selectedAgent.value?.id === agent.id ? null : agent
    selectedStarterPrompts.value = selectedAgent.value?.starterPrompts || []
    conversation.value = []
  }
}

const closeAgent = () => {
  selectedAgent.value = null
  selectedStarterPrompts.value = []
  conversation.value = []
}

const selectPrompt = (prompt: string) => {
  message.value = prompt
  selectedStarterPrompts.value = []
}

const responsiveOptions = ref([
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 3,
  },
  {
    breakpoint: '991px',
    numVisible: 2,
    numScroll: 2,
  },
  {
    breakpoint: '767px',
    numVisible: 1,
    numScroll: 1,
  },
])
</script>

<template>
  <div class="flex h-[calc(100vh-32px)] flex-col">
    <div
      class="mx-auto grid h-full max-w-[1000px] grid-cols-1 overflow-scroll p-4 md:grid-cols-[1fr_minmax(200px,700px)_1fr]"
    >
      <div class="w-full md:col-span-3 md:col-start-1 md:row-start-1">
        <div class="space-y-2 pb-6 text-center">
          <h1 class="text-5xl font-semibold"> Galactic Guide </h1>
          <div class="flex gap-2 pt-2">
            <PrimeMessage
              severity="info"
              class="flex w-full justify-center"
            >
              3 question limit per 30 min
            </PrimeMessage>
            <PrimeMessage
              severity="warn"
              class="flex w-full justify-center"
            >
              Always validate answers.
            </PrimeMessage>
          </div>
        </div>
        <PrimeCarousel
          :value="agents"
          :num-visible="3"
          :num-scroll="3"
          :responsive-options="responsiveOptions"
        >
          <template #item="slotProps">
            <div
              class="m-2 rounded border border-color p-4"
              :class="{
                'cursor-pointer transition-shadow hover:shadow-lg': slotProps.data.enabled,
                'opacity-50': !slotProps.data.enabled,
              }"
              @click="slotProps.data.enabled && selectAgent(slotProps.data)"
            >
              <div class="mb-4 font-medium">
                {{ slotProps.data.name }}
              </div>
              <div class="mb-4">
                <ul class="list-disc pl-5">
                  <li
                    v-for="feature in slotProps.data.features"
                    :key="feature"
                    class="text-sm"
                  >
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div class="flex items-center justify-between">
                <PrimeTag
                  :value="slotProps.data.enabled ? 'Enabled' : 'Disabled'"
                  :severity="slotProps.data.enabled ? 'success' : 'danger'"
                />

                <PrimeTag
                  v-if="selectedAgent?.id === slotProps.data.id"
                  value="Selected"
                  severity="info"
                />
              </div>
            </div>
          </template>
        </PrimeCarousel>
      </div>
      <div
        class="mx-auto flex h-full w-full flex-col justify-between gap-4 md:col-start-2 md:row-start-2 xl:gap-8"
      >
        <div
          v-if="chatStore.messages.length"
          class="space-y-4 pb-4 xl:space-y-8 xl:pb-8"
        >
          <div
            v-for="(msg, index) in chatStore.messages"
            :key="index"
            :class="msg.role"
          >
            <p class="pb-2 pl-2">
              <strong class="pb-4">{{ msg.role === 'user' ? 'You' : 'Assistant' }}</strong>
            </p>
            <div class="w-full rounded-md bg-primary-950 p-4 text-surface-300">
              <MDC
                :value="msg.content"
                class="prose prose-invert"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Bar -->

    <div class="foreground border-color flex-shrink-0 border-t p-4">
      <div class="mx-auto max-w-[600px]">
        <div
          v-if="selectedStarterPrompts.length"
          class="space-y-2 pb-2"
        >
          <div class="flex justify-center items-center">
            <p class="text-center flex-grow font-semibold"> Example Questions </p>
            <PrimeButton
              severity="secondary"
              class="text-end ml-auto text-white font-semibold"
              @click="closeAgent"
            >
              X
            </PrimeButton>
          </div>
          <PrimeButton
            v-for="prompt in selectedStarterPrompts"
            :key="prompt"
            severity="secondary"
            outlined
            class="mb-2 mr-2 flex w-full items-start justify-start text-left"
            @click="selectPrompt(prompt)"
          >
            {{ prompt }}
          </PrimeButton>
        </div>
        <SearchBar
          :selected-prompt="message"
          :system-prompt="selectedAgent?.systemMessage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
