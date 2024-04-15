export function useModal() {
  // was used for news modals at one point
  const currentPost = computed(() => news.value[currentIndex.value])
  const nextPost = computed(() => news.value[nextIndex.value])
  const previousPost = computed(() => news.value[previousIndex.value])
  const isModalOpen = ref(false)
  const currentIndex = ref(0)
  const previousIndex = computed(() => (currentIndex.value > 0 ? currentIndex.value - 1 : 0))
  const nextIndex = computed(() =>
    currentIndex.value < news.value.length - 1 ? currentIndex.value + 1 : currentIndex.value
  )

  const toggleModal = (postIndex?: number) => {
    isModalOpen.value = !isModalOpen.value
    if (postIndex !== undefined) {
      currentIndex.value = postIndex
    }
  }

  const next = () => {
    if (currentIndex.value < news.value.length - 1) {
      currentIndex.value++
    }
  }

  const previous = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }
}
