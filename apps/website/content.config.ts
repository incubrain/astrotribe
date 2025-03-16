import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // For existing docs content
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
    // New blog collection
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(),
        author: z.object({
          name: z.string(),
          avatar: z.object({
            url: z.string(),
          }),
          bio: z.string().optional(),
        }),
        tags: z
          .array(
            z.object({
              name: z.string(),
            }),
          )
          .optional(),
        category: z
          .object({
            name: z.string(),
            slug: z.string(),
          })
          .optional(),
        cover: z
          .object({
            url: z.string(),
            alternativeText: z.string().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
          })
          .optional(),
        draft: z.boolean().default(false),
        featured: z.boolean().default(false), // New field for featured posts
        metaImage: z.string().optional(), // For SEO
        excerpt: z.string().optional(), // Short excerpt for listings
      }),
    }),
  },
})
