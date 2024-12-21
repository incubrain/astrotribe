// src/scripts/seed.ts
import path from 'path'
import fs from 'fs-extra'
import mime from 'mime-types'
import axios from 'axios'
import type { Core, UID } from '@strapi/strapi'

// Import your exported data
import exportedData from '../data/exported-data.json'

interface SeedOptions {
  strapi: Core.Strapi
}

interface FileData {
  filepath: string
  originalFileName: string
  size: number
  mimetype: string
}

interface BlockComponent {
  __component: string
  file?: any
  files?: string[]
  [key: string]: any
}

async function seedExampleApp({ strapi }: SeedOptions) {
  const shouldImportSeedData = await isFirstRun(strapi)

  if (shouldImportSeedData) {
    try {
      console.log('Setting up the template with production data...')
      await importSeedData(strapi)
      console.log('Ready to go')
    } catch (error) {
      console.log('Could not import seed data')
      console.error(error)
    }
  } else {
    console.log('Seed data has already been imported.')
  }
}

async function importSeedData(strapi: Core.Strapi) {
  // Allow read of application content types
  await setPublicPermissions(strapi, {
    article: ['find', 'findOne'],
    category: ['find', 'findOne'],
    tag: ['find', 'findOne'],
    author: ['find', 'findOne'],
    global: ['find', 'findOne'],
    about: ['find', 'findOne'],
  })

  // Create all entries
  await importCategories(strapi)
  await importTags(strapi)
  await importAuthors(strapi)
  await importArticles(strapi)
  // await importGlobal(strapi)
  // await importAbout(strapi)
}

async function importCategories(strapi: Core.Strapi) {
  for (const category of exportedData.categories.data) {
    await createEntry(strapi, {
      model: 'category',
      entry: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        publishedAt: category.publishedAt,
      },
    })
  }
}

async function importTags(strapi: Core.Strapi) {
  for (const tag of exportedData.tags.data) {
    await createEntry(strapi, {
      model: 'tag',
      entry: {
        name: tag.name,
        publishedAt: tag.publishedAt,
      },
    })
  }
}

async function importAuthors(strapi: Core.Strapi) {
  for (const author of exportedData.authors.data) {
    const avatar = await downloadFile(strapi, author.avatar.url)
    await createEntry(strapi, {
      model: 'author',
      entry: {
        name: author.name,
        email: author.email,
        bio: author.bio,
        socials: author.socials,
        avatar,
        publishedAt: author.publishedAt,
      },
    })
  }
}

async function importArticles(strapi: Core.Strapi) {
  for (const article of exportedData.articles.data) {
    const cover = await downloadFile(strapi, article.cover.url)
    const updatedBlocks = await updateBlocks(strapi, article.blocks)

    await createEntry(strapi, {
      model: 'article',
      entry: {
        title: article.title,
        description: article.description,
        slug: article.slug,
        cover,
        blocks: updatedBlocks,
        publishedAt: article.publishedAt || new Date(),
      },
    })
  }
}

async function createEntry(strapi: Core.Strapi, { model, entry }: { model: string; entry: any }) {
  try {
    const schemaPath = `api::${model}.${model}` as UID.Schema
    await strapi.query(schemaPath).create({
      data: entry,
    })
  } catch (error) {
    console.error({ model, entry, error })
  }
}

// async function importGlobal(strapi: Core.Strapi) {
//   const globalData = exportedData.data.attributes
//   const favicon = await downloadFile(strapi, globalData.favicon.data.attributes.url)
//   const shareImage = await downloadFile(
//     strapi,
//     globalData.defaultSeo.shareImage.data.attributes.url,
//   )

//   return createEntry(strapi, {
//     model: 'global',
//     entry: {
//       ...globalData,
//       favicon,
//       publishedAt: globalData.publishedAt || new Date(),
//       defaultSeo: {
//         ...globalData.defaultSeo,
//         shareImage,
//       },
//     },
//   })
// }

// async function importAbout(strapi: Core.Strapi) {
//   const aboutData = exportedData.about.data.attributes
//   const updatedBlocks = await updateBlocks(strapi, aboutData.blocks)

//   await createEntry(strapi, {
//     model: 'about',
//     entry: {
//       ...aboutData,
//       blocks: updatedBlocks,
//       publishedAt: aboutData.publishedAt || new Date(),
//     },
//   })
// }

async function downloadFile(strapi: Core.Strapi, url: string) {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, 'binary')
  const fileName = path.basename(url)
  const filePath = path.join('data', 'uploads', fileName)
  await fs.writeFile(filePath, buffer)
  return checkFileExistsBeforeUpload(strapi, [fileName])
}

async function isFirstRun(strapi: Core.Strapi) {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  })
  const initHasRun = await pluginStore.get({ key: 'initHasRun' })
  await pluginStore.set({ key: 'initHasRun', value: true })
  return !initHasRun
}

async function setPublicPermissions(strapi: Core.Strapi, newPermissions: Record<string, string[]>) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  })

  const allPermissionsToCreate = [] as Promise<any>[]

  for (const [controller, actions] of Object.entries(newPermissions)) {
    const permissionsToCreate = actions.map(async (action) => {
      return await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      })
    })
    allPermissionsToCreate.push(...permissionsToCreate)
  }
  await Promise.all(allPermissionsToCreate)
}

function getFileSizeInBytes(filePath: string): number {
  const stats = fs.statSync(filePath)
  return stats.size
}

function getFileData(fileName: string): FileData {
  const filePath = path.join('data', 'uploads', fileName)
  const size = getFileSizeInBytes(filePath)
  const ext = fileName.split('.').pop() || ''
  const mimeType = mime.lookup(ext) || ''

  return {
    filepath: filePath,
    originalFileName: fileName,
    size,
    mimetype: mimeType,
  }
}

async function uploadFile(strapi: Core.Strapi, file: FileData, name: string) {
  return strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: file,
      data: {
        fileInfo: {
          alternativeText: `An image uploaded to Strapi called ${name}`,
          caption: name,
          name,
        },
      },
    })
}

async function checkFileExistsBeforeUpload(strapi: Core.Strapi, files: string[]) {
  const existingFiles = [] as any[]
  const uploadedFiles = [] as any[]
  const filesCopy = [...files]

  for (const fileName of filesCopy) {
    const fileWhereName = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: fileName.replace(/\..*$/, ''),
      },
    })

    if (fileWhereName) {
      existingFiles.push(fileWhereName)
    } else {
      const fileData = getFileData(fileName)
      const fileNameNoExtension = fileName.split('.').shift()
      const [file] = await uploadFile(strapi, fileData, fileNameNoExtension!)
      uploadedFiles.push(file)
    }
  }
  const allFiles = [...existingFiles, ...uploadedFiles]
  return allFiles.length === 1 ? allFiles[0] : allFiles
}

async function updateBlocks(strapi: Core.Strapi, blocks: BlockComponent[]) {
  const updatedBlocks = [] as BlockComponent[]
  for (const block of blocks) {
    if (block.__component === 'shared.media') {
      const uploadedFiles = await checkFileExistsBeforeUpload(strapi, [block.file])
      const blockCopy = { ...block }
      blockCopy.file = uploadedFiles
      updatedBlocks.push(blockCopy)
    } else if (block.__component === 'shared.slider') {
      const existingAndUploadedFiles = await checkFileExistsBeforeUpload(strapi, block.files ?? [])
      const blockCopy = { ...block }
      blockCopy.files = existingAndUploadedFiles
      updatedBlocks.push(blockCopy)
    } else {
      updatedBlocks.push(block)
    }
  }

  return updatedBlocks
}

interface BootstrapInput {
  strapi: Core.Strapi
}

export default async ({ strapi }: BootstrapInput) => {
  console.log('Bootstrap: Attempting to seed data...')
  if (process.env.SEED_DATA !== 'true') {
    console.log('Skipping seed data (SEED_DATA not set)')
    return
  }

try {
    await seedExampleApp({ strapi })
    console.log('Bootstrap: Seeding completed successfully')
  } catch (error) {
    console.error('Bootstrap: Seeding failed:', error)
    throw error
  }
}
