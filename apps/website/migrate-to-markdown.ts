// scripts/migrate-strapi-to-content.js
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import mkdirp from 'mkdirp'
import yaml from 'js-yaml'

const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

// Configuration
const CONTENT_JSON_PATH = path.resolve(process.cwd(), 'strapi-data.json') // Update with your JSON file path
const OUTPUT_DIR = path.resolve(process.cwd(), 'content/blog')

/**
 * Convert Strapi blocks to markdown content
 * @param {Array} blocks - The blocks array from Strapi
 * @returns {string} - The markdown content
 */
function blocksToMarkdown(blocks) {
  if (!blocks || !blocks.length) {
    return ''
  }

  let markdown = ''

  for (const block of blocks) {
    if (block.__component === 'shared.rich-text') {
      markdown += block.body + '\n\n'
    }
    // Add handling for other block types here if needed
  }

  return markdown
}

/**
 * Main migration function
 */
async function migrateStrapiToContent() {
  try {
    console.log('Starting migration from Strapi JSON to Nuxt Content...')

    // Create the output directory if it doesn't exist
    await mkdirp(OUTPUT_DIR)

    // Read the JSON file
    console.log('Reading JSON file...')
    const jsonData = await readFileAsync(CONTENT_JSON_PATH, 'utf8')
    const data = JSON.parse(jsonData)

    // Extract articles from the JSON structure
    const articles = data.articles?.data || []
    console.log(`Found ${articles.length} articles to process.`)

    // Process each article
    for (const [index, article] of articles.entries()) {
      console.log(`Processing article ${index + 1}/${articles.length}: ${article.title}`)

      try {
        // Extract article data
        const {
          title,
          description,
          slug,
          publishedAt,
          updatedAt,
          cover,
          author,
          category,
          blocks,
          tags = [],
        } = article

        // Create frontmatter
        const frontmatter = {
          title,
          description,
          date: publishedAt,
          updatedAt,
          author: author
            ? {
                name: author.name,
                avatar: {
                  url: author.avatar?.url,
                },
                bio: author.bio,
              }
            : undefined,
          category: category
            ? {
                name: category.name,
                slug: category.slug,
              }
            : undefined,
          cover: cover
            ? {
                url: cover.url,
                alternativeText: cover.alternativeText,
                width: cover.width,
                height: cover.height,
              }
            : undefined,
          tags: tags.map((tag) => ({ name: tag.name })),
          draft: false,
        }

        // Convert blocks to markdown content
        const content = blocksToMarkdown(blocks)

        // Convert frontmatter to YAML
        const yamlFrontmatter = yaml.dump(frontmatter)

        // Create the markdown file content
        const fileContent = `---\n${yamlFrontmatter}---\n\n${content}`

        // Save to file in category directory
        const categoryDir = category?.slug || 'uncategorized'
        const categoryPath = path.join(OUTPUT_DIR, categoryDir)
        await mkdirp(categoryPath) // Create category directory if it doesn't exist

        const filePath = path.join(categoryPath, `${slug}.md`)
        await writeFileAsync(filePath, fileContent, 'utf8')
        console.log(`Created ${filePath}`)
      } catch (error) {
        console.error(`Error processing article: ${article.title || 'unknown'}`, error.message)
      }
    }

    console.log('Migration complete!')
  } catch (error) {
    console.error('Migration failed:', error.message)
  }
}

// Run the migration
migrateStrapiToContent().catch(console.error)
