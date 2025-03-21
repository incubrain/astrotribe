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
      },
    }),
  },
  // Define schemas for content types
  content: {
    blog: group({
      title: 'Blog Post',
      description: 'Blog post configuration',
      icon: 'i-lucide-file-text',
      fields: {
        title: field({
          type: 'string',
          title: 'Title',
          description: 'Blog post title',
        }),
        description: field({
          type: 'string',
          title: 'Description',
          description: 'Short description of the blog post',
        }),
        date: field({
          type: 'string',
          title: 'Date',
          description: 'Publication date (YYYY-MM-DD)',
        }),
        author: field({
          type: 'string',
          title: 'Author',
          description: 'Author ID',
        }),
        category: field({
          type: 'string',
          title: 'Category',
          description: 'Category slug',
        }),
        tags: field({
          type: 'array',
          title: 'Tags',
          description: 'Array of tag IDs',
          default: [],
        }),
        draft: field({
          type: 'boolean',
          title: 'Draft',
          description: 'Is this post a draft?',
          default: false,
        }),
      },
    }),
    authors: group({
      title: 'Author',
      description: 'Author information',
      icon: 'i-lucide-user',
      fields: {
        name: field({
          type: 'string',
          title: 'Name',
          description: 'Author name',
        }),
        bio: field({
          type: 'string',
          title: 'Bio',
          description: 'Author bio',
        }),
      },
    }),
    categories: group({
      title: 'Category',
      description: 'Category information',
      icon: 'i-lucide-folder',
      fields: {
        name: field({
          type: 'string',
          title: 'Name',
          description: 'Category name',
        }),
        description: field({
          type: 'string',
          title: 'Description',
          description: 'Category description',
        }),
        color: field({
          type: 'string',
          title: 'Color',
          description: 'Tailwind color class (without bg- prefix)',
        }),
      },
    }),
    tags: group({
      title: 'Tag',
      description: 'Tag information',
      icon: 'i-lucide-tag',
      fields: {
        name: field({
          type: 'string',
          title: 'Name',
          description: 'Tag name',
        }),
        description: field({
          type: 'string',
          title: 'Description',
          description: 'Tag description',
        }),
        color: field({
          type: 'string',
          title: 'Color',
          description: 'Tailwind color class (without bg- prefix)',
        }),
      },
    }),
  },
})
