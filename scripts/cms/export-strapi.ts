// scripts/export-data.ts
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'

const STRAPI_URL = 'https://cms.astronera.org' // LIVE Railway URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

async function fetchWithPopulate(endpoint: string) {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      params: {
        populate: '*', // Start with basic population
      },
    })

    console.log(`Successfully fetched ${endpoint}`)
    return response.data
  } catch (error: any) {
    console.error(`Error fetching ${endpoint}:`, error.response?.data || error.message)
    throw error
  }
}

async function exportData() {
  try {
    console.log('Starting export...')

    // Try fetching one endpoint first to test the connection
    console.log('Testing connection with articles endpoint...')
    const testResponse = await fetchWithPopulate('articles')
    console.log('Test successful:', testResponse ? 'Data received' : 'No data')

    const data = {
      articles: await fetchWithPopulate('articles'),
      categories: await fetchWithPopulate('categories'),
      authors: await fetchWithPopulate('authors'),
      tags: await fetchWithPopulate('tags'),
      // Commenting these out temporarily to test basic endpoints first
      // global: await fetchWithPopulate('global'),
      // about: await fetchWithPopulate('about'),
    }

    // Create the data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'backups', 'cms')
    await fs.mkdir(dataDir, { recursive: true })

    const outputPath = path.join(dataDir, 'exported-data.json')
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2))

    console.log('Export completed successfully!')
    console.log(`Data saved to: ${outputPath}`)
  } catch (error: any) {
    console.error('Export failed:', error.response?.data || error.message)
    process.exit(1)
  }
}

exportData().catch(console.error)
