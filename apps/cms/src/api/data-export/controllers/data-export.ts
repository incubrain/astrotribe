module.exports = {
  async exportData(ctx) {
    console.log('Export Data Controller Loaded')

    const data = {
      global: await strapi.service('api::global.global').find(),
      about: await strapi.service('api::about.about').find(),
      categories: await strapi.service('api::category.category').find(),
      tags: await strapi.service('api::tag.tag').find(),
      authors: await strapi.service('api::author.author').find(),
      articles: await strapi.service('api::article.article').find(),
    }

    ctx.send(data)
  },
}
