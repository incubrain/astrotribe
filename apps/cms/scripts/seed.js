'use strict'

const path = require('path')
const fs = require('fs-extra')
const mime = require('mime-types')
const axios = require('axios')

// Import your exported data
const exportedData = require('../data/exported-data.json')

async function seedExampleApp() {
  const shouldImportSeedData = await isFirstRun()

  if (shouldImportSeedData) {
    try {
      console.log('Setting up the template with production data...')
      await importSeedData()
      console.log('Ready to go')
    } catch (error) {
      console.log('Could not import seed data')
      console.error(error)
    }
  } else {
    console.log('Seed data has already been imported.')
  }
}

async function importSeedData() {
  // Allow read of application content types
  await setPublicPermissions({
    article: ['find', 'findOne'],
    category: ['find', 'findOne'],
    tag: ['find', 'findOne'],
    author: ['find', 'findOne'],
    global: ['find', 'findOne'],
    about: ['find', 'findOne'],
  })

  // Create all entries
  await importCategories()
  await importTags()
  await importAuthors()
  await importArticles()
  await importGlobal()
  await importAbout()
}

async function importCategories() {
  for (const category of exportedData.categories.data) {
    await createEntry({ model: 'category', entry: category.attributes })
  }
}

async function importTags() {
  for (const tag of exportedData.tags.data) {
    await createEntry({ model: 'tag', entry: tag.attributes })
  }
}

async function importAuthors() {
  for (const author of exportedData.authors.data) {
    const avatar = await downloadFile(author.attributes.avatar.data.attributes.url)
    await createEntry({
      model: 'author',
      entry: {
        ...author.attributes,
        avatar,
      },
    })
  }
}

async function importArticles() {
  for (const article of exportedData.articles.data) {
    const cover = await downloadFile(article.attributes.cover.data.attributes.url)
    const updatedBlocks = await updateBlocks(article.attributes.blocks)

    await createEntry({
      model: 'article',
      entry: {
        ...article.attributes,
        cover,
        blocks: updatedBlocks,
        publishedAt: article.attributes.publishedAt || Date.now(),
      },
    })
  }
}

async function importGlobal() {
  const globalData = exportedData.global.data.attributes
  const favicon = await downloadFile(globalData.favicon.data.attributes.url)
  const shareImage = await downloadFile(globalData.defaultSeo.shareImage.data.attributes.url)

  return createEntry({
    model: 'global',
    entry: {
      ...globalData,
      favicon,
      publishedAt: globalData.publishedAt || Date.now(),
      defaultSeo: {
        ...globalData.defaultSeo,
        shareImage,
      },
    },
  })
}

async function importAbout() {
  const aboutData = exportedData.about.data.attributes
  const updatedBlocks = await updateBlocks(aboutData.blocks)

  await createEntry({
    model: 'about',
    entry: {
      ...aboutData,
      blocks: updatedBlocks,
      publishedAt: aboutData.publishedAt || Date.now(),
    },
  })
}

async function downloadFile(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, 'binary')
  const fileName = path.basename(url)
  const filePath = path.join('data', 'uploads', fileName)
  await fs.writeFile(filePath, buffer)
  return checkFileExistsBeforeUpload([fileName])
}

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  })
  const initHasRun = await pluginStore.get({ key: 'initHasRun' })
  await pluginStore.set({ key: 'initHasRun', value: true })
  return !initHasRun
}

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  })

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = []
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller]
    const permissionsToCreate = actions.map((action) => {
      return strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      })
    })
    allPermissionsToCreate.push(...permissionsToCreate)
  })
  await Promise.all(allPermissionsToCreate)
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath)
  const fileSizeInBytes = stats['size']
  return fileSizeInBytes
}

function getFileData(fileName) {
  const filePath = path.join('data', 'uploads', fileName)
  // Parse the file metadata
  const size = getFileSizeInBytes(filePath)
  const ext = fileName.split('.').pop()
  const mimeType = mime.lookup(ext || '') || ''

  return {
    filepath: filePath,
    originalFileName: fileName,
    size,
    mimetype: mimeType,
  }
}

async function uploadFile(file, name) {
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

// Create an entry and attach files if there are any
async function createEntry({ model, entry }) {
  try {
    // Actually create the entry in Strapi
    await strapi.documents(`api::${model}.${model}`).create({
      data: entry,
    })
  } catch (error) {
    console.error({ model, entry, error })
  }
}

async function checkFileExistsBeforeUpload(files) {
  const existingFiles = []
  const uploadedFiles = []
  const filesCopy = [...files]

  for (const fileName of filesCopy) {
    // Check if the file already exists in Strapi
    const fileWhereName = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: fileName.replace(/\..*$/, ''),
      },
    })

    if (fileWhereName) {
      // File exists, don't upload it
      existingFiles.push(fileWhereName)
    } else {
      // File doesn't exist, upload it
      const fileData = getFileData(fileName)
      const fileNameNoExtension = fileName.split('.').shift()
      const [file] = await uploadFile(fileData, fileNameNoExtension)
      uploadedFiles.push(file)
    }
  }
  const allFiles = [...existingFiles, ...uploadedFiles]
  // If only one file then return only that file
  return allFiles.length === 1 ? allFiles[0] : allFiles
}

async function updateBlocks(blocks) {
  const updatedBlocks = []
  for (const block of blocks) {
    if (block.__component === 'shared.media') {
      const uploadedFiles = await checkFileExistsBeforeUpload([block.file])
      // Copy the block to not mutate directly
      const blockCopy = { ...block }
      // Replace the file name on the block with the actual file
      blockCopy.file = uploadedFiles
      updatedBlocks.push(blockCopy)
    } else if (block.__component === 'shared.slider') {
      // Get files already uploaded to Strapi or upload new files
      const existingAndUploadedFiles = await checkFileExistsBeforeUpload(block.files)
      // Copy the block to not mutate directly
      const blockCopy = { ...block }
      // Replace the file names on the block with the actual files
      blockCopy.files = existingAndUploadedFiles
      // Push the updated block
      updatedBlocks.push(blockCopy)
    } else {
      // Just push the block as is
      updatedBlocks.push(block)
    }
  }

  return updatedBlocks
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi')

  const appContext = await compileStrapi()
  const app = await createStrapi(appContext).load()

  app.log.level = 'error'

  await seedExampleApp()
  await app.destroy()

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
