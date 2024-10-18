import strapi from '@strapi/strapi'

export default strapi.factories.createCoreController(
  'api::export.exportData',
  ({ strapi }) =>
    async (ctx) => {
      const data = {
        global: strapi.apis.global.services.global.getGlobal(),
        about: strapi.apis.about.services.about.getAbout(),
        categories: strapi.apis.category.services.category.getCategories(),
        tags: strapi.apis.tag.services.tag.getTags(),
        authors: strapi.apis.author.services.author.getAuthors(),
        articles: strapi.apis.article.services.article.getArticles(),
      }

      ctx.send(data)
    },
)
