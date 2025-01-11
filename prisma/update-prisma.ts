import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

const SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma')

const TYPE_MAPPINGS = {
  'bookmark_folders.path': 'Unsupported("ltree")',
  'news_summaries.embedding': 'Unsupported("vector")',
  'research_embeddings.embedding': 'Unsupported("vector")',
  'searches.embedding': 'Unsupported("vector")',
  'table_query_performance.avg_duration': 'Unsupported("interval")',
}

function snakeToPascalCase(str: string): string {
  return str.replace(/(^|_)(\w)/g, (_match, _p1, p2) => p2.toUpperCase())
}

function updateReferences(
  schemaContent: string,
  names: { models: Set<string>; enums: Set<string> },
): string {
  const lines = schemaContent.split('\n')

  return lines
    .map((line) => {
      // Skip comments and JSON
      if (line.trim().startsWith('//') || (line.includes('@default(') && line.includes('{'))) {
        return line
      }

      const updatedLine = line

      // Model reference pattern
      const modelRefPattern = /^(\s+)(\w+)(\s+)([a-z][a-z0-9_]+)(\??|\[\])?(\s+@relation.*|\s*)$/
      const modelMatch = line.match(modelRefPattern)
      if (modelMatch) {
        const [, indent, fieldName, spacing, typeName, arrayMarker = '', rest] = modelMatch
        if (names.models.has(typeName.toLowerCase())) {
          return `${indent}${fieldName}${spacing}${snakeToPascalCase(typeName)}${arrayMarker}${rest}`
        }
      }

      // Enum reference pattern - now includes array notation
      const enumRefPattern =
        /^(\s+)([a-z][a-z0-9_]+)(\s+)([a-z][a-z0-9_]+(?:_enum)?)(\??|\[\])?(\s+.*)?$/
      const enumMatch = line.match(enumRefPattern)
      if (enumMatch) {
        const [, indent, fieldName, spacing, typeName, modifier = '', rest = ''] = enumMatch
        const baseTypeName = typeName.replace(/_enum$/, '')
        if (
          names.enums.has(typeName.toLowerCase()) ||
          names.enums.has(`${baseTypeName}_enum`.toLowerCase())
        ) {
          const enumTypeName = snakeToPascalCase(
            baseTypeName + (typeName.endsWith('_enum') ? '_enum' : ''),
          )
          return `${indent}${fieldName}${spacing}${enumTypeName}${modifier}${rest}`
        }
      }

      return updatedLine
    })
    .join('\n')
}

function collectNames(schemaContent: string): { models: Set<string>; enums: Set<string> } {
  const models = new Set<string>()
  const enums = new Set<string>()

  // Match model definitions
  const modelRegex = /model\s+([A-Za-z0-9_]+)\s*{/g
  let match
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    models.add(match[1].toLowerCase())
  }

  // Match enum definitions
  const enumRegex = /enum\s+([A-Za-z0-9_]+)\s*{/g
  while ((match = enumRegex.exec(schemaContent)) !== null) {
    enums.add(match[1].toLowerCase())
  }

  return { models, enums }
}

/**
 * Updates all references (both in relations and type definitions) to PascalCase
 */

function updateModelDeclarations(schemaContent: string): string {
  return schemaContent.replace(/model\s+([A-Za-z0-9_]+)\s*{(?![^}]*@@map)/g, (match, name) => {
    const pascalName = snakeToPascalCase(name)
    return `model ${pascalName} {\n  @@map("${name}")`
  })
}

async function updateSchema(): Promise<void> {
  try {
    console.log('Running prisma db pull...')
    await execCommand('pnpx prisma db pull')

    console.log('Reading schema file...')
    let schemaContent = await fs.readFile(SCHEMA_PATH, 'utf8')

    // 1. Collect all model and enum names
    console.log('Collecting schema names...')
    const { models, enums } = collectNames(schemaContent)

    // 2. Update all references to PascalCase
    console.log('Updating references...')
    schemaContent = updateReferences(schemaContent, { models, enums })

    // 3. Update model declarations to PascalCase (only if no @@map exists)
    console.log('Updating declarations...')
    schemaContent = schemaContent.replace(
      /model\s+([A-Za-z0-9_]+)\s*{(?![^}]*@@map)/g,
      (match, name) => {
        const pascalName = snakeToPascalCase(name)
        return `model ${pascalName} {\n  @@map("${name}")`
      },
    )

    // 4. Update enum declarations similarly
    schemaContent = schemaContent.replace(
      /enum\s+([A-Za-z0-9_]+)\s*{(?![^}]*@@map)/g,
      (match, name) => {
        const pascalName = snakeToPascalCase(name)
        return `enum ${pascalName} {\n  @@map("${name}")`
      },
    )

    console.log('Writing updated schema...')
    await fs.writeFile(SCHEMA_PATH, schemaContent, 'utf8')

    console.log('Formatting schema...')
    await execCommand('pnpx prisma format')

    console.log('Generating Prisma Client...')
    await execCommand('pnpx prisma generate')

    console.log('Schema update completed successfully!')
  } catch (error: any) {
    console.error('Error updating schema:', error)
    process.exit(1)
  }
}

// Helper function for executing commands
async function execCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${stderr}`)
        reject(error)
        return
      }
      console.log(stdout)
      resolve()
    })
  })
}

updateSchema().catch((e) => {
  console.error(e)
  process.exit(1)
})
