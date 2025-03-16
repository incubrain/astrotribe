// nuxt.schema.ts
import { field, group } from '@nuxt/content/preview'

export default defineNuxtSchema({
  appConfig: {
    blog: group({
      title: 'Blog Configuration',
      description: 'Configure blog settings',
      icon: 'i-lucide-file-text',
      fields: {
        siteTitle: field({
          type: 'string',
          title: 'Site Title',
          description: 'Title displayed in blog pages',
          default: 'AstronEra Blog',
        }),
        postsPerPage: field({
          type: 'number',
          title: 'Posts Per Page',
          description: 'Number of posts to display per page',
          default: 9,
        }),
        showAuthor: field({
          type: 'boolean',
          title: 'Show Author',
          description: 'Display author information on blog posts',
          default: true,
        }),
      },
    }),
  },
})
