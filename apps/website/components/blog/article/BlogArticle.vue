<script setup lang="ts">
const { width } = useWindowSize()

const expandToc = computed(() => width.value < 1280)

const articleContent = ref<HTMLElement | null>(null)
const articleHtml = ref<string>('')
const tocLinks = ref<TocLink[]>([])

const p = defineProps({
  article: {
    type: Object as PropType<ArticleFullT>,
    required: true,
  },
})

console.log('Props Article:', p.article)

const ast = ref<MDCParserResult | null>(null)
const parse = useMarkdownParser()

// Function to render blocks as markdown
const renderBlocksAsMarkdown = (blocks) => {
  return blocks
    .map((block) => {
      if (block.__component === 'shared.rich-text') {
        return block.body
      }
      // Add more conditions for other block types if needed
      return ''
    })
    .join('\n\n')
}

onBeforeMount(async () => {
  if (p.article.blocks) {
    const markdown = renderBlocksAsMarkdown(p.article.blocks)
    extractToc(p.article.blocks)
    ast.value = await parse(markdown)
  }
})

interface TocLink {
  id: string
  text: string
  depth: number
  children: TocLink[]
}

const extractToc = (markdown: any): TocLink[] => {
  let currentH2: TocLink | null = null

  console.log('Markdown:', markdown)

  markdown.forEach((block) => {
    const lines = block.body.split('\n')

    lines.forEach((line) => {
      const match = line.match(/^(##|###)\s+(.+)$/)
      if (match) {
        const depth = match[1].length // 2 for h2, 3 for h3
        const text = match[2].trim()

        // Generate an id from the text
        const id = text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')

        const tocLink: TocLink = { id, text, depth, children: [] }

        if (depth === 2) {
          currentH2 = tocLink
          tocLinks.value.push(tocLink)
        } else if (depth === 3) {
          if (currentH2) {
            currentH2.children.push(tocLink)
          } else {
            // If there's no current H2, treat H3 as top-level
            tocLinks.value.push(tocLink)
          }
        }
      }
    })
  })
}

watch(
  () => articleContent.value,
  async (newVal) => {
    if (newVal && ast.value) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      articleHtml.value = newVal.innerHTML
    }
  },
)

console.log('Article:', p.article)
</script>

<template>
  <div class="max-w-full pb-10">
    <main>
      <BlogArticleHero :article="article" />
      <div
        class="padded-x grid grid-cols-[minmax(300px,700px)] justify-center pt-8 xl:grid-cols-[minmax(240px,1fr)_minmax(660px,740px)_minmax(240px,1fr)] xl:gap-8"
      >
        <div class="w-full xl:col-start-1">
          <BlogArticleToc
            v-if="tocLinks.length"
            class="background border-color rounded-md border p-4 xl:sticky xl:left-0 xl:top-24 xl:border-none xl:p-0"
            :toc="tocLinks"
            :updated-at="article.updatedAt"
            :expanded="expandToc"
          />
        </div>
        <div class="xl:padded-x xl:col-start-2">
          <div class="pb-12">
            <div
              ref="articleContent"
              class="mx-auto space-y-8"
            >
              <Suspense>
                <MDCRenderer
                  v-if="ast?.body"
                  class="nuxt-content"
                  :body="ast.body"
                  :data="ast.data"
                />
              </Suspense>
            </div>
            <BlogArticleShare
              :link="article.slug"
              :summary="article.description"
            />
            <BlogArticleAuthorCard :authors="[article.author]" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.nuxt-content p {
  font-size: 18px;
  margin-bottom: 22px;
  line-height: 1.65;
  font-family: 'Open Sans', sans-serif;
}

.nuxt-content h2,
.nuxt-content h3,
.nuxt-content h4,
.nuxt-content h5,
.nuxt-content h6 {
  text-decoration: none;
  margin-bottom: 18px;
  font-family: 'Oswald', 'sans-serif';
  font-weight: 700;
}

/* Golden Ratio for heading sizes */
.nuxt-content h2 {
  margin-top: 24px;
  font-size: 36px;
  line-height: 1.6;
}

.nuxt-content h3 {
  margin-top: 2.8rem;
  font-size: 28px;
  line-height: 1.6;
}

.nuxt-content h4 {
  font-size: 22px;
  line-height: 1.3;
}

.nuxt-content ul,
ol {
  margin-bottom: 28px;
  font-family: 'Open Sans', sans-serif;
}

.nuxt-content ul {
  list-style: disc;
}

.nuxt-content ol {
  list-style: decimal;
}

.nuxt-content li {
  margin-left: 1.6rem;
  font-size: 18px;
  margin-bottom: 22px;
  line-height: 1.55;
}

.nuxt-content p a {
  color: #10b981;
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 768px) {
  .nuxt-content p {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 16px;
    font-family: 'Open Sans', sans-serif;
  }

  .nuxt-content li {
    font-size: 16px;
  }

  .nuxt-content h2 {
    margin-top: 10px;
    font-size: 30px;
    line-height: 1.6;
  }

  .nuxt-content h3 {
    margin-top: 2.8rem;
    font-size: 26px;
    line-height: 1.6;
  }

  .nuxt-content h4 {
    font-size: 22px;
    line-height: 1.3;
  }

  .nuxt-content li {
    margin-left: 1.6rem;
    font-size: 16px;
    margin-bottom: 22px;
    line-height: 1.55;
  }
}
</style>
