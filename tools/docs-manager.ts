import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import axios from 'axios'
import yaml from 'js-yaml'
import chalk from 'chalk'

// Core interfaces
interface DocMetadata {
  path: string
  hash: string
  lastUpdated: string
  firstSeen: string
  updateHistory: {
    date: string
    hash: string
  }[]
  sourceType: 'markdown' | 'vue'
}

interface DocContent {
  title: string
  path: string
  content: string
  frontMatter: Record<string, any>
  category?: string
  sourceType: 'markdown' | 'vue'
}

interface DocScore {
  score: number
  reason?: string
  categories: string[]
  usage: {
    timesUsed: number
    lastUsed?: string // Last time the document was accessed/used
    commonErrors?: string[]
    usefulness?: {
      productivity: number
      frequency: number
      complexity: number
    }
  }
}

// Version tracking class
class DocVersionTracker {
  private metadata: Map<string, DocMetadata> = new Map()
  private metadataFile: string

  constructor(baseDir: string) {
    this.metadataFile = path.join(baseDir, 'doc-versions.yml')
  }

  async init() {
    try {
      const content = await fs.readFile(this.metadataFile, 'utf-8')
      this.metadata = new Map(Object.entries(yaml.load(content) as Record<string, DocMetadata>))
    } catch (e) {
      console.log('No existing version metadata found, starting fresh')
    }
  }

  private calculateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  async checkDocument(
    docPath: string,
    content: string,
  ): Promise<{
      isNew: boolean
      isUpdated: boolean
      docMeta: DocMetadata
    }> {
    const currentHash = this.calculateHash(content)
    const existing = this.metadata.get(docPath)

    if (!existing) {
      const docMeta: DocMetadata = {
        path: docPath,
        hash: currentHash,
        firstSeen: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        updateHistory: [
          {
            date: new Date().toISOString(),
            hash: currentHash,
          },
        ],
      }
      this.metadata.set(docPath, docMeta)
      await this.save()
      return { isNew: true, isUpdated: false, docMeta }
    }

    if (existing.hash !== currentHash) {
      existing.hash = currentHash
      existing.lastUpdated = new Date().toISOString()
      existing.updateHistory.push({
        date: new Date().toISOString(),
        hash: currentHash,
      })
      this.metadata.set(docPath, existing)
      await this.save()
      return { isNew: false, isUpdated: true, docMeta: existing }
    }

    return { isNew: false, isUpdated: false, docMeta: existing }
  }

  private async save() {
    const metadataObj = Object.fromEntries(this.metadata)
    await fs.writeFile(this.metadataFile, yaml.dump(metadataObj))
  }
}

// Scoring management class
class DocScoreManager {
  private scores: Map<string, DocScore> = new Map()
  private scoresFile: string

  constructor(baseDir: string) {
    this.scoresFile = path.join(baseDir, 'doc-scores.yml')
  }

  async init() {
    try {
      const content = await fs.readFile(this.scoresFile, 'utf-8')
      this.scores = new Map(Object.entries(yaml.load(content) as Record<string, DocScore>))
    } catch (e) {
      console.log('No existing scores found, starting fresh')
    }
  }

  calculateRelevance(docMeta: DocMetadata, score: DocScore): number {
    let finalScore = score.score

    // Age-based adjustments
    const monthsOld =
      (new Date().getTime() - new Date(docMeta.lastUpdated).getTime()) / (1000 * 60 * 60 * 24 * 30)
    if (monthsOld < 1) finalScore *= 1.2
    else if (monthsOld < 3) finalScore *= 1
    else if (monthsOld < 6) finalScore *= 0.9
    else if (monthsOld < 12) finalScore *= 0.7
    else finalScore *= 0.5

    // Update frequency bonus
    if (docMeta.updateHistory.length > 5) {
      finalScore *= 1.1
    }

    // Usage-based adjustments
    if (score.usage.timesUsed > 10) finalScore *= 1.1

    return Math.min(10, finalScore)
  }

  async updateScore(docPath: string, updates: Partial<DocScore>) {
    const existing = this.scores.get(docPath) || {
      score: 5,
      categories: [],
      usage: {
        timesUsed: 0,
      },
    }

    this.scores.set(docPath, {
      ...existing,
      ...updates,
      usage: {
        ...existing.usage,
        ...updates.usage,
      },
    })

    await this.save()
  }

  async recordUsage(
    docPath: string,
    context?: {
      error?: string
      usefulness?: Partial<DocScore['usage']['usefulness']>
    },
  ) {
    const doc = this.scores.get(docPath)
    if (doc) {
      doc.usage.timesUsed++
      doc.usage.lastUsed = new Date().toISOString()

      if (context?.error) {
        doc.usage.commonErrors = doc.usage.commonErrors || []
        doc.usage.commonErrors.push(context.error)
      }

      if (context?.usefulness) {
        doc.usage.usefulness = {
          ...doc.usage.usefulness,
          ...context.usefulness,
        }
      }

      await this.save()
    }
  }

  private async save() {
    const scoresObj = Object.fromEntries(this.scores)
    await fs.writeFile(this.scoresFile, yaml.dump(scoresObj))
  }

  async getRelevantDocs(threshold = 4): Promise<string[]> {
    return Array.from(this.scores.entries())
      .filter(([_, doc]) => doc.score >= threshold)
      .map(([path]) => path)
  }
}

interface RepoConfig {
  owner: string
  repo: string
  branch: string
  docsPath: string
  type: 'docs' | 'components'
  filePattern: RegExp
  pathTransform?: (path: string) => string
}

// Main docs manager class
class NuxtDocsManager {
  private baseDir: string
  private versionTracker: DocVersionTracker
  private scoreManager: DocScoreManager

  protected readonly repoConfigs: Record<string, RepoConfig> = {
    nuxt: {
      owner: 'nuxt',
      repo: 'nuxt',
      branch: 'main',
      docsPath: 'docs',
      type: 'docs',
      filePattern: /\.md$/,
    },
    nitro: {
      owner: 'nitrojs',
      repo: 'nitro',
      branch: 'v2',
      docsPath: 'docs',
      type: 'docs',
      filePattern: /\.md$/,
      pathTransform: (path: string) => path.replace(/^docs\//, 'nitro/'),
    },
    primevue: {
      owner: 'primefaces',
      repo: 'primevue',
      branch: 'master',
      docsPath: 'packages/primevue/src',
      type: 'components',
      filePattern: /\.vue$/,
      pathTransform: (path: string) => {
        const componentName = path.split('/').pop()?.replace('.vue', '')
        return `primevue/components/${componentName}.vue`
      },
    },
  }

  constructor(baseDir: string) {
    this.baseDir = baseDir
    this.versionTracker = new DocVersionTracker(baseDir)
    this.scoreManager = new DocScoreManager(baseDir)
  }

  // Add method to check if repo key is valid
  isValidRepoKey(key: string): key is keyof typeof this.repoConfigs {
    return key in this.repoConfigs
  }

  async init() {
    await fs.mkdir(this.baseDir, { recursive: true })
    await Promise.all([this.versionTracker.init(), this.scoreManager.init()])
  }

  private async fetchGithubContent(
    owner: string,
    repo: string,
    path: string,
    branch = 'main',
  ): Promise<any> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    const response = await axios.get(url, {
      headers: process.env.GH_PERSONAL_TOKEN ?
        {
          Authorization: `token ${process.env.GH_PERSONAL_TOKEN}`,
        } :
        {},
    })
    return response.data
  }

  private async processVueComponent(content: string): Promise<string> {
    // Extract documentation from Vue component
    const docBlocks: string[] = []

    // Extract component description from comments
    const descriptionMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
    if (descriptionMatch) {
      docBlocks.push(descriptionMatch[1].replace(/\s*\*/g, ''))
    }

    // Extract props documentation
    const propsMatch = content.match(/props:\s*{([\s\S]*?)}/)
    if (propsMatch) {
      docBlocks.push('## Props\n' + propsMatch[1])
    }

    // Extract events documentation
    const eventsMatch = content.match(/emits:\s*{([\s\S]*?)}/)
    if (eventsMatch) {
      docBlocks.push('## Events\n' + eventsMatch[1])
    }

    return docBlocks.join('\n\n')
  }

  async fetchRepositoryDocs(repoKey: keyof typeof this.repoConfigs) {
    const config = this.repoConfigs[repoKey]
    console.log(chalk.blue(`Fetching ${repoKey} documentation...`))

    const processContent = async (file: any) => {
      try {
        const content = await axios.get(file.download_url)
        const targetPath = config.pathTransform?.(file.path) || file.path
        const filePath = path.join(this.baseDir, targetPath)

        await fs.mkdir(path.dirname(filePath), { recursive: true })

        let processedContent = content.data
        if (config.type === 'components') {
          processedContent = await this.processVueComponent(content.data)
        }

        await fs.writeFile(filePath, processedContent)
        await this.processDocument(targetPath, processedContent)
        console.log(chalk.green(`✓ Downloaded: ${targetPath}`))
      } catch (error) {
        console.error(chalk.red(`✗ Error processing ${file.path}:`, error.message))
      }
    }

    const processDirectory = async (path: string) => {
      const contents = await this.fetchGithubContent(config.owner, config.repo, path, config.branch)

      for (const item of contents) {
        if (item.type === 'dir') {
          await processDirectory(item.path)
        } else if (config.filePattern.test(item.name)) {
          await processContent(item)
        }
      }
    }

    await processDirectory(config.docsPath)
  }

  async fetchAllDocs() {
    for (const repoKey of Object.keys(this.repoConfigs)) {
      await this.fetchRepositoryDocs(repoKey as keyof typeof this.repoConfigs)
    }
  }

  private getSourceType(docPath: string): 'markdown' | 'vue' {
    return docPath.endsWith('.vue') ? 'vue' : 'markdown'
  }

  private parseMdContent(content: string): { frontMatter: Record<string, any>; content: string } {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/
    const match = content.match(frontMatterRegex)

    if (match) {
      try {
        const frontMatter = yaml.load(match[1]) as Record<string, any>
        const cleanContent = content.replace(frontMatterRegex, '').trim()
        return { frontMatter, content: cleanContent }
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Failed to parse front matter: ${error.message}`))
        return { frontMatter: {}, content }
      }
    }

    return { frontMatter: {}, content }
  }

  // Update checkDocument call in DocVersionTracker to include sourceType
  private async checkDocumentWithMeta(docPath: string, content: string) {
    const sourceType = this.getSourceType(docPath)
    const { isNew, isUpdated, docMeta } = await this.versionTracker.checkDocument(docPath, content)

    // Ensure sourceType is set
    if (docMeta) {
      docMeta.sourceType = sourceType
    }

    return { isNew, isUpdated, docMeta }
  }

  // Update processDocument to use checkDocumentWithMeta
  async processDocument(docPath: string, content: string): Promise<DocContent> {
    const sourceType = this.getSourceType(docPath)
    const { frontMatter, content: cleanContent } =
      sourceType === 'vue' ? this.parseVueContent(docPath, content) : this.parseMdContent(content)

    const { isNew, isUpdated } = await this.checkDocumentWithMeta(docPath, content)

    if (isNew) {
      console.log(chalk.green(`✨ New document found: ${docPath}`))
      await this.scoreManager.updateScore(docPath, {
        score: 5,
        categories: [
          frontMatter.category,
          sourceType === 'vue' ? 'component' : 'documentation',
        ].filter(Boolean),
      })
    } else if (isUpdated) {
      console.log(chalk.blue(`📝 Document updated: ${docPath}`))
      await this.scoreManager.recordUsage(docPath)
    }

    return {
      title: frontMatter.title || path.basename(docPath, sourceType === 'vue' ? '.vue' : '.md'),
      path: docPath,
      content: cleanContent,
      frontMatter,
      category: frontMatter.category,
      sourceType,
    }
  }

  // Fix parseVueContent to include docPath parameter
  private parseVueContent(
    docPath: string,
    content: string,
  ): { frontMatter: Record<string, any>; content: string } {
    const docBlocks: string[] = []
    const frontMatter: Record<string, any> = {}

    // Extract component description
    const descriptionMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
    if (descriptionMatch) {
      frontMatter.description = descriptionMatch[1].replace(/\s*\*/g, '').trim()
    }

    // Extract props
    const propsMatch = content.match(/props:\s*{([\s\S]*?)}/)
    if (propsMatch) {
      docBlocks.push('## Props\n' + propsMatch[1])
      frontMatter.props = propsMatch[1]
    }

    // Extract events
    const eventsMatch = content.match(/emits:\s*{([\s\S]*?)}/)
    if (eventsMatch) {
      docBlocks.push('## Events\n' + eventsMatch[1])
      frontMatter.events = eventsMatch[1]
    }

    // Add component name to frontMatter
    frontMatter.title = path.basename(docPath, '.vue')
    frontMatter.category = 'components'

    return {
      frontMatter,
      content: docBlocks.join('\n\n'),
    }
  }

  // Fix generateAIContext path handling
  async generateAIContext() {
    const relevantPaths = await this.scoreManager.getRelevantDocs()
    const docs = await Promise.all(
      relevantPaths.map(async (githubPath) => {
        // Convert GitHub path to local path based on source
        let localPath: string
        if (githubPath.includes('primevue')) {
          localPath = path.join(this.baseDir, githubPath)
        } else {
          // Handle Nuxt/Nitro docs
          const basePath = githubPath.startsWith('nitro/') ? 'nitro' : 'nuxt'
          localPath = path.join(this.baseDir, basePath, githubPath.replace(`${basePath}/`, ''))
        }

        try {
          const content = await fs.readFile(localPath, 'utf-8')
          return this.processDocument(githubPath, content)
        } catch (error) {
          console.error(chalk.yellow(`Warning: Could not read file ${localPath}`))
          return null
        }
      }),
    )

    // Filter out any null results from failed reads
    const validDocs = docs.filter((doc): doc is DocContent => doc !== null)

    if (validDocs.length === 0) {
      console.warn(chalk.yellow('No valid documents found to generate context'))
    }

    const contextContent = validDocs
      .map(
        (doc) =>
          `# ${doc.title}\n\nCategory: ${doc.category || 'Uncategorized'}\nType: ${doc.sourceType}\n\n${doc.content}\n\n---\n`,
      )
      .join('\n')

    await fs.writeFile(path.join(this.baseDir, 'ai-context.md'), contextContent)

    // Log some helpful information
    console.log(chalk.blue(`Found ${relevantPaths.length} relevant paths`))
    console.log(chalk.blue(`Successfully processed ${validDocs.length} documents`))
  }

  // Remove lastUpdated from scoreDocument as it's tracked in DocMetadata
  async scoreDocument(docPath: string, score: number, reason?: string) {
    await this.scoreManager.updateScore(docPath, {
      score,
      reason,
    })
    console.log(chalk.green(`✓ Updated score for ${docPath} to ${score}`))
  }
}

// Update the entry point command handler
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2]
  const manager = new NuxtDocsManager('./ai-docs')

  const docPath = process.argv[3]
  const score = Number(process.argv[4])
  const reason = process.argv[5]

  await manager
    .init()
    .then(async () => {
      const repoKey = docPath
      switch (command) {
        case 'fetch':
          return manager.fetchAllDocs()
        case 'fetch-repo':
          if (!repoKey || !(repoKey in manager.repoConfigs)) {
            throw new Error('Usage: fetch-repo <nuxt|nitro|primevue>')
          }
          return manager.fetchRepositoryDocs(repoKey as keyof typeof manager.repoConfigs)
        case 'generate':
          return manager.generateAIContext()
        case 'score':
          if (!docPath || isNaN(score)) {
            throw new Error('Usage: score <docPath> <score> [reason]')
          }
          return manager.scoreDocument(docPath, score, reason)
        default:
          throw new Error(`Unknown command: ${command}`)
      }
    })
    .catch((error) => {
      console.error(chalk.red(`Error: ${error.message}`))
      process.exit(1)
    })
}

export { NuxtDocsManager, DocVersionTracker, DocScoreManager }
