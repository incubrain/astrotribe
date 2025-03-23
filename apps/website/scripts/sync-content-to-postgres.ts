// scripts/sync-content-to-postgres.ts
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { promises as fs } from 'fs'
import { globby } from 'globby'
import pg from 'pg'
import { parse as parseYAML } from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const contentDir = join(__dirname, '../content')

// Frontmatter parser using the yaml library
function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content }
  }

  try {
    const yamlContent = match[1]
    const data = parseYAML(yamlContent) as Record<string, unknown>
    const bodyContent = match[2]

    return {
      data: data || {},
      content: bodyContent,
    }
  } catch (e) {
    console.warn('Error parsing frontmatter:', e)
    return { data: {}, content }
  }
}

async function main() {
  // Connect to database using native pg
  const pool = new pg.Pool({
    connectionString: process.env.NUXT_CONTENT_DATABASE_URL,
  })

  try {
    console.log('Connected to PostgreSQL')

    // Find all content files
    const files = await globby(['**/*.md', '**/*.json', '**/*.yml', '**/*.yaml'], {
      cwd: contentDir,
    })

    console.log(`Found ${files.length} content files`)

    // Process each file
    for (const file of files) {
      const filePath = join(contentDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const path = '/' + file.replace(/\.[^/.]+$/, '')

      // Parse content based on file type
      if (file.endsWith('.md')) {
        const { data, content: body } = parseFrontmatter(content)

        // Insert into database
        await pool.query(
          `INSERT INTO nuxt_content.documents 
           (source, path, title, description, body, metadata) 
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (path) DO UPDATE 
           SET title = $3, description = $4, body = $5, metadata = $6`,
          [file, path, data.title || '', data.description || '', body, JSON.stringify(data)],
        )
      } else if (file.endsWith('.json')) {
        // Parse JSON directly
        try {
          const jsonData = JSON.parse(content)
          await pool.query(
            `INSERT INTO nuxt_content.documents 
             (source, path, body, metadata) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (path) DO UPDATE 
             SET body = $3, metadata = $4`,
            [file, path, content, JSON.stringify({ type: 'json' })],
          )
        } catch (e) {
          console.error(`Error processing JSON file ${file}:`, e)
        }
      } else if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        // Parse YAML file using the yaml library
        try {
          const yamlData = parseYAML(content)
          await pool.query(
            `INSERT INTO nuxt_content.documents 
             (source, path, body, metadata) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (path) DO UPDATE 
             SET body = $3, metadata = $4`,
            [file, path, content, JSON.stringify({ type: 'yaml', data: yamlData })],
          )
        } catch (e) {
          console.error(`Error processing YAML file ${file}:`, e)
        }
      }
    }

    console.log('Content sync complete')
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error('Error syncing content:', err)
  process.exit(1)
})
