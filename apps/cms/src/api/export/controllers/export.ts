import { factories } from '@strapi/strapi'

export default {
  async exportData(ctx) {
    const data = {
      global: await factories.service('api::global.global').find(),
      about: await factories.service('api::about.about').find(),
      categories: await factories.service('api::category.category').find(),
      tags: await factories.service('api::tag.tag').find(),
      authors: await factories.service('api::author.author').find(),
      articles: await factories.service('api::article.article').find({ populate: '*' }),
    }

    ctx.send(data)
  },
}
