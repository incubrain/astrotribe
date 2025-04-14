// nuxt.schema.ts
import { field, group } from '@nuxt/content/preview'

export default defineNuxtSchema({
  appConfig: {
    blog: group({
      title: 'Blog Configuration',
      slug: 'blog',
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
        slug: field({
          type: 'string',
          title: 'Slug',
          description: 'URL-friendly version of the title',
        }),
        description: field({
          type: 'string',
          title: 'Description',
          description: 'Short description of the blog post',
        }),
        createdAt: field({
          type: 'string',
          title: 'Date',
          description: 'Publication date (YYYY-MM-DD)',
        }),
        publishedAt: field({
          type: 'string',
          title: 'Published At',
          description: 'Publication date (YYYY-MM-DD)',
        }),
        updatedAt: field({
          type: 'string',
          title: 'Updated At',
          description: 'Last updated date (YYYY-MM-DD)',
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
        image: field({
          type: 'string',
          title: 'Image',
          description: 'Image Path',
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
        featured: field({
          type: 'boolean',
          title: 'Featured',
          description: 'Is this post featured?',
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
        slug: field({
          type: 'string',
          title: 'Slug',
          description: 'URL-friendly version of the author name',
        }),
        bio: field({
          type: 'string',
          title: 'Bio',
          description: 'Author bio',
        }),
        avatar: field({
          type: 'string',
          title: 'Avatar',
          description: 'Path to author avatar image',
        }),
        website: field({
          type: 'string',
          title: 'Website',
          description: 'Author website URL',
        }),
        twitter: field({
          type: 'string',
          title: 'Twitter',
          description: 'Author Twitter handle',
        }),
        linkedin: field({
          type: 'string',
          title: 'LinkedIn',
          description: 'Author LinkedIn profile URL',
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
        slug: field({
          type: 'string',
          title: 'Slug',
          description: 'URL-friendly version of the category name',
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
        slug: field({
          type: 'string',
          title: 'Slug',
          description: 'URL-friendly version of the tag name',
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
