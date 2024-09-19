<script setup lang="ts">
import type { ArticleFullT } from '~/types/articles'

const { width } = useWindowSize()

const expandToc = computed(() => {
  console.log('width.value', width.value)
  return width.value < 1280
})

const articleContent = ref<HTMLElement | null>(null)
const articleHtml = ref<string>('')

watch(
  () => articleContent.value,
  async (newVal) => {
    if (newVal && p.article.body) {
      // awiat timeout of 1 seconds
      await new Promise((resolve) => setTimeout(resolve, 1000))
      articleHtml.value = newVal.innerHTML
    }
  },
)

const p = defineProps({
  article: {
    type: Object as PropType<ArticleFullT>,
    required: true,
  },
})

// !todo:low add full width images
// !todo:fun - add full width image grids with text
// !todo:med - add a read time to the article
// !todo:med - add social links to author block and links to profile
// !todo:med - add links to the tags and category
</script>

<template>
  <div
    v-if="article.body"
    class="max-w-full pb-10"
  >
    <main>
      <BlogArticleHero :article="article" />
      <div
        class="padded-x grid grid-cols-[minmax(300px,700px)] justify-center pt-8 xl:grid-cols-[minmax(240px,1fr)_minmax(660px,740px)_minmax(240px,1fr)] xl:gap-8"
      >
        <div class="w-full xl:col-start-1">
          <BlogArticleToc
            class="background border-color rounded-md border p-4 xl:sticky xl:left-0 xl:top-24 xl:border-none xl:p-0"
            :toc="article.body.toc.links"
            :updated-at="article.updatedAt"
            :version="article.version"
            :expanded="expandToc"
          />
        </div>
        <div class="xl:padded-x xl:col-start-2">
          <ContentRenderer :value="article">
            <div class="pb-12">
              <div
                ref="articleContent"
                class="mx-auto space-y-8"
              >
                <ContentRendererMarkdown
                  :value="article.body"
                  class="nuxt-content"
                >
                  {{ article.body }}
                </ContentRendererMarkdown>
              </div>
              <BlogArticleShare
                :link="article._id.replaceAll(':', '/')"
                :summary="article.description"
              />
              <BlogArticleAuthorCard :author-ids="article.authorIds" />
            </div>
          </ContentRenderer>
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
