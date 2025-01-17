import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SCHEMA_PATH = path.join(__dirname, 'schema.prisma')
dotenv.config({ path: path.join(__dirname, '../../../../../.env') })

const TYPE_MAPPINGS = {
  'bookmark_folders.path': 'Unsupported("ltree")',
  'news_summaries.embedding': 'Unsupported("vector")',
  'research_embeddings.embedding': 'Unsupported("vector")',
  'searches.embedding': 'Unsupported("vector")',
  'table_query_performance.avg_duration': 'Unsupported("interval")',
}

async function updateViews(schemaContent: string): Promise<string> {
  console.log('\nUpdating views...')
  const lines = schemaContent.split('\n')
  const updatedLines: string[] = []
  let insideView = false
  let viewBuffer: string[] = []
  let hasValidIdColumn = false
  let currentViewName = ''

  for (const line of lines) {
    const trimmedLine = line.trim()

    // Skip the invalid unique identifier comment for views
    if (
      trimmedLine.startsWith('/// The underlying view does not contain a valid unique identifier')
    ) {
      continue
    }

    // Start of a view block
    if (trimmedLine.startsWith('view ')) {
      insideView = true
      viewBuffer = [line]
      hasValidIdColumn = false
      currentViewName = trimmedLine.split(' ')[1]
      console.log(`\nProcessing view: ${currentViewName}`)

      // Add the opening brace
      if (!line.includes('{')) {
        viewBuffer.push(' {')
      }
      continue
    }

    // Inside a view block
    if (insideView) {
      // Skip @@ignore directive
      if (trimmedLine === '@@ignore') {
        continue
      }

      // Check for any column with @id
      if (trimmedLine.includes(' @id')) {
        console.log(`Found ID column in ${currentViewName} with @id:`, trimmedLine)
        hasValidIdColumn = true
        viewBuffer.push(line)
        continue
      }

      // Check for potential ID columns that need @id added
      if (
        (trimmedLine.startsWith('id ') && trimmedLine.includes('@db.Uuid')) ||
        trimmedLine.startsWith('time_bucket ') ||
        trimmedLine.startsWith('query_id ') ||
        trimmedLine.startsWith('queryid ')
      ) {
        console.log(`Found potential ID column in ${currentViewName}:`, trimmedLine)
        hasValidIdColumn = true

        // Make column non-optional and add @id if missing
        const updatedLine = line.replace(/(\w+\s+[^?@\s]+)\??(\s+@[^@]*)?(\s*)$/, '$1 @id$2$3')
        console.log(`- Updated to:`, updatedLine.trim())
        viewBuffer.push(updatedLine)
        continue
      }

      // End of a view block
      if (trimmedLine === '}') {
        insideView = false
        console.log(`End of view ${currentViewName}:`)
        console.log(`- Has valid ID column: ${hasValidIdColumn}`)

        // If no valid ID column found, add one after the opening brace
        if (!hasValidIdColumn) {
          console.log(`- Adding generated ID column to ${currentViewName}`)
          const idLine = '  id      String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid'

          // Find the position after the opening brace
          const openBraceIndex = viewBuffer.findIndex((l) => l.trim() === '{')
          if (openBraceIndex !== -1) {
            viewBuffer.splice(openBraceIndex + 1, 0, idLine)
          } else {
            // If no opening brace found (shouldn't happen), add it after view declaration
            viewBuffer.splice(1, 0, idLine)
          }
        }

        // Make required fields non-optional for views
        viewBuffer = viewBuffer.map((line) => {
          if (
            line.includes(' DateTime?') ||
            line.includes(' String?') ||
            line.includes(' ErrorType?') ||
            line.includes(' ErrorSeverity?')
          ) {
            return line.replace('?', '')
          }
          return line
        })

        updatedLines.push(...viewBuffer)
        updatedLines.push(line)
        continue
      }

      viewBuffer.push(line)
    } else {
      // Add non-view lines directly
      updatedLines.push(line)
    }
  }

  return updatedLines.join('\n')
}

function snakeToPascalCase(str: string): string {
  return str.replace(/(^|_)(\w)/g, (_match, _p1, p2) => p2.toUpperCase())
}

function addOppositeRelations(schemaContent: string): string {
  let modelBlocks = schemaContent.match(/model\s+\w+\s*{[^}]+}/g) || []
  const models: Record<string, { fields: string[]; relations: any[] }> = {}

  // First pass: collect all models and their fields
  modelBlocks.forEach((block) => {
    const modelName = block.match(/model\s+(\w+)/)?.[1]
    if (!modelName) return

    const fields = block.match(/^\s+\w+.*$/gm) || []
    models[modelName] = {
      fields: fields.map((f) => f.trim()),
      relations: [],
    }
  })

  // Second pass: analyze relations
  Object.entries(models).forEach(([modelName, model]) => {
    model.fields.forEach((field) => {
      const relationMatch = field.match(/@relation\(fields:\s*\[(\w+)\],\s*references:\s*\[(\w+)\]/)
      if (relationMatch) {
        const [, fieldName, referencedField] = relationMatch
        const targetModelMatch = field.match(/(\w+)\s+@relation/)
        if (targetModelMatch) {
          const [, targetModel] = targetModelMatch
          models[targetModel]?.relations.push({
            sourceModel: modelName,
            fieldName,
            referencedField,
          })
        }
      }
    })
  })

  // Third pass: add missing opposite relations
  let updatedContent = schemaContent
  Object.entries(models).forEach(([modelName, model]) => {
    model.relations.forEach((relation) => {
      // Generate the base field name by converting to snake_case and removing trailing 's' if present
      const baseFieldName = relation.sourceModel.toLowerCase().replace(/s$/, '')
      const oppositeFieldName = `${baseFieldName}s` // Always use singular + 's' for consistency
      const modelPattern = new RegExp(`model\\s+${modelName}\\s*{[^}]+}`)

      // Check for existing relation with any variation of pluralization
      const hasExistingRelation = models[modelName]?.fields.some((field) => {
        const fieldNameMatch = field.match(/^\s*(\w+)\s+/)
        if (!fieldNameMatch) return false
        const existingFieldName = fieldNameMatch[1].toLowerCase()
        return (
          existingFieldName === oppositeFieldName ||
          existingFieldName === `${oppositeFieldName}s` ||
          existingFieldName === baseFieldName
        )
      })

      if (!hasExistingRelation) {
        // Add the new relation field with consistent pluralization
        updatedContent = updatedContent.replace(modelPattern, (match) =>
          match.replace('}', `  ${oppositeFieldName} ${relation.sourceModel}[]\n}`),
        )
      }
    })
  })

  // Final pass: clean up any duplicate or incorrectly pluralized relations
  modelBlocks = updatedContent.match(/model\s+\w+\s*{[^}]+}/g) || []
  modelBlocks.forEach((block) => {
    const modelName = block.match(/model\s+(\w+)/)?.[1]
    if (!modelName) return

    // Find all relation fields
    const relationFields = new Set()
    const relationDuplicates = new Set()
    const lines = block.split('\n')

    lines.forEach((line) => {
      const fieldMatch = line.match(/^\s*(\w+)\s+\w+\[\]/)
      if (fieldMatch) {
        const fieldName = fieldMatch[1].toLowerCase()
        if (relationFields.has(fieldName)) {
          relationDuplicates.add(fieldName)
        }
        relationFields.add(fieldName)
      }
    })

    // Remove duplicate relations
    relationDuplicates.forEach((dupField) => {
      const pattern = new RegExp(`\\s+${dupField}s?\\s+\\w+\\[\\]\\n`, 'gi')
      let found = false
      updatedContent = updatedContent.replace(pattern, (match) => {
        if (!found) {
          found = true
          return match
        }
        return ''
      })
    })
  })

  return updatedContent
}

function filterSchemaContent(schemaContent: string): string {
  const lines = schemaContent.split('\n')
  let keepCurrentBlock = true
  let isInBlock = false
  let currentBuffer: string[] = []
  const filteredLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Always keep non-model/enum content (datasource, generator, etc.)
    if (!trimmedLine.startsWith('model') && !trimmedLine.startsWith('enum') && !isInBlock) {
      filteredLines.push(line)
      continue
    }

    // Start of a model or enum definition
    if (trimmedLine.startsWith('model') || trimmedLine.startsWith('enum')) {
      isInBlock = true
      currentBuffer = [line]
      continue
    }

    // Within a model or enum definition
    if (isInBlock) {
      currentBuffer.push(line)

      // Check if this is the end of the block
      if (trimmedLine === '}') {
        isInBlock = false
        const blockContent = currentBuffer.join('\n')

        // Keep if it's public schema OR if it's specifically the auth.users model
        const isPublicSchema = blockContent.includes('@@schema("public")')
        const isAuthUsers =
          blockContent.includes('@@schema("auth")') && blockContent.includes('model Users {')

        if (isPublicSchema || isAuthUsers) {
          filteredLines.push(...currentBuffer)
        }

        // Debug logging
        console.log(`Block processed:`, {
          type: blockContent.startsWith('model') ? 'model' : 'enum',
          name: currentBuffer[0].trim(),
          isPublic: isPublicSchema,
          isAuthUsers: isAuthUsers,
          kept: isPublicSchema || isAuthUsers,
        })

        currentBuffer = []
      }
    }
  }

  // Add the auth.users model if it's not already present
  const hasAuthUsers = filteredLines.some(
    (line) =>
      line.includes('model Users') &&
      filteredLines.slice(filteredLines.indexOf(line)).some((l) => l.includes('@@schema("auth")')),
  )

  if (!hasAuthUsers) {
    console.log('Adding auth.users model...')
    const authUsersModel = `
/// @client.name="users"
model Users {
  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid

  @@map("users")
  @@schema("auth")
}
`
    filteredLines.push(...authUsersModel.split('\n'))
  }

  // Debug - log counts
  const modelCount = filteredLines.filter((line) => line.trim().startsWith('model')).length
  const enumCount = filteredLines.filter((line) => line.trim().startsWith('enum')).length
  console.log(`Total kept: ${modelCount} models, ${enumCount} enums`)

  return filteredLines.join('\n')
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

async function updateSchema(): Promise<void> {
  try {
    console.log('Running prisma db pull...')
    await execCommand(`pnpx prisma db pull`)

    console.log('Reading schema file...', SCHEMA_PATH)
    let schemaContent = await fs.readFile(SCHEMA_PATH, 'utf8')

    schemaContent = filterSchemaContent(schemaContent)

    // Add relations handling
    console.log('Updating relations...')
    schemaContent = addOppositeRelations(schemaContent)

    // Add auth.users model if it doesn't exist
    if (!schemaContent.includes('@@schema("auth")')) {
      console.log('Adding auth.users model...')
      const authUsersModel = `
        /// @client.name="users"
        model Users {
          id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid

          @@map("users")
          @@schema("auth")
        }
      `
      schemaContent = schemaContent + '\n' + authUsersModel
    }

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
        return `/// @client.name="${name}"
    model ${pascalName} {
      @@map("${name}")`
      },
    )

    // 4. Update enum declarations similarly
    schemaContent = schemaContent.replace(
      /enum\s+([A-Za-z0-9_]+)\s*{(?![^}]*@@map)/g,
      (match, name) => {
        const pascalName = snakeToPascalCase(name)
        return `/// @client.name="${name}"
            enum ${pascalName} {\n  @@map("${name}")`
      },
    )

    // 5. Update views before writing the file
    console.log('Updating views...')
    schemaContent = await updateViews(schemaContent)

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
  const newCmd = `${command} --schema=${SCHEMA_PATH}`
  return new Promise((resolve, reject) => {
    exec(newCmd, (error, stdout, stderr) => {
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
