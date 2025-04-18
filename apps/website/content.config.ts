import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    // Main content collection
    content: defineCollection(
      asSeoCollection({
        type: 'page',
        source: '**/*.md',
      }),
    ),

    // Blog posts collection
    blog: defineCollection(
      asSeoCollection({
        type: 'page',
        source: 'blog/**/*.md',
        schema: z.object({
          title: z.string(),
          description: z.string().optional(),
          createdAt: z.string(), // Use string instead of date for better compatibility
          publishedAt: z.string(), // Use string instead of date for better compatibility
          updatedAt: z.string().optional(),
          author: z.string(), // Reference to author ID
          category: z.string(), // Reference to category slug
          image: z.string(), // Reference to category slug
          tags: z.array(z.string()).optional(), // Array of tag IDs
          draft: z.boolean().default(false),
          featured: z.boolean().default(false),
          // SEO fields can be directly added in frontmatter
          ogImage: z.any().optional(),
          sitemap: z.any().optional(),
          robots: z.string().optional(),
          schemaOrg: z.any().optional(),
        }),
      }),
    ),

    // Authors collection
    authors: defineCollection({
      type: 'data',
      source: 'authors/**/*.{yml,json}',
      schema: z.object({
        name: z.string(),
        slug: z.string(), // Explicitly define the slug field
        bio: z.string().optional(),
        avatar: z.string().optional(),
        website: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
      }),
    }),

    // Categories collection
    categories: defineCollection({
      type: 'data',
      source: 'categories/**/*.{yml,json}',
      schema: z.object({
        name: z.string(),
        slug: z.string(), // Explicitly define the slug field
        description: z.string().optional(),
        color: z.string().optional(),
      }),
    }),

    // Tags collection
    tags: defineCollection({
      type: 'data',
      source: 'tags/**/*.{yml,json}',
      schema: z.object({
        name: z.string(),
        slug: z.string(), // Explicitly define the slug field
        description: z.string().optional(),
        color: z.string().optional(),
      }),
    }),
  },
})
