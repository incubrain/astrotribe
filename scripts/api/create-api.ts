// src/scripts/generate-nestjs.ts
import { resolve } from 'path'
import pool from '../db/client'
import { SchemaAnalyzer } from '../schema-analyzer'
import { NestJSGenerator, type NestJSGeneratorOptions } from './generate-api'

const DEFAULT_OPTIONS: NestJSGeneratorOptions = {
  outputDir: './apps/api',
  features: {
    swagger: true,
    policies: true,
    validation: true,
    tests: false,
    graphql: false,
    migrations: false,
  },
  style: {
    usePrettier: true,
    useEslint: true,
  },
  database: {
    type: 'supabase',
  },
  structure: {
    monorepo: true,
    separateFiles: true,
  },
}

async function generateNestJSApp(options: Partial<NestJSGeneratorOptions> = {}) {
  try {
    const analyzer = new SchemaAnalyzer(pool)
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      features: {
        ...DEFAULT_OPTIONS.features,
        ...options.features,
      },
    }

    const generator = new NestJSGenerator(analyzer, mergedOptions)
    await generator.generate()

    console.log('NestJS API generation completed successfully!')
  } catch (error: any) {
    console.error('Error generating NestJS API:', error)
    throw error
  } finally {
    await pool.end()
  }
}

generateNestJSApp().catch((error: any) => {
  console.error(error)
  process.exit(1)
})
