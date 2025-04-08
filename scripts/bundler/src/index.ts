#!/usr/bin/env node
// src/index.ts
import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import { parse as parseSFC, compileScript } from '@vue/compiler-sfc'
import type { TemplateChildNode } from '@vue/compiler-dom'
import { parse as parseTemplate, NodeTypes, ElementTypes } from '@vue/compiler-dom'
import { init, parse as parseImports } from 'es-module-lexer'
import { glob } from 'glob'
import findUp from 'find-up'

// --- Configuration ---
const MONOREPO_ROOT = findMonorepoRoot()
const DEFAULT_EXTENSIONS = ['.ts', '.js', '.mjs', '.cjs', '.vue']
const INDEX_FILES = DEFAULT_EXTENSIONS.map((ext) => `index${ext}`)
const COMPONENT_DIRS = ['components']
const COMPOSABLE_DIRS = ['composables']
const STORE_DIRS = ['stores']
const UTIL_DIRS = ['utils']
const LAYER_DIRS: string[] = []

interface ResolveOptions {
  currentFilePath: string
  currentPackageRoot: string
  monorepoRoot: string
}

// --- State ---
const seen = new Set<string>()
const collectedFiles = new Set<string>()

// --- Main Function ---
export async function start() {
  const targetPageRelative = process.argv[2]

  if (!targetPageRelative) {
    console.error('❌ Please provide a path to the Nuxt page .vue file (relative to monorepo root)')
    console.error('   Example: pnpm run trace apps/website/pages/index.vue')
    process.exit(1)
  }

  if (!MONOREPO_ROOT) {
    console.error('❌ Could not find monorepo root (pnpm-workspace.yaml).')
    process.exit(1)
  }
  console.log(`🌳 Monorepo Root: ${MONOREPO_ROOT}`)

  const targetPageAbsolute = path.resolve(MONOREPO_ROOT, targetPageRelative)

  if (!fs.existsSync(targetPageAbsolute)) {
    console.error(`❌ File not found: ${targetPageAbsolute}`)
    process.exit(1)
  }

  const targetPackageRoot = findPackageRoot(targetPageAbsolute)
  if (!targetPackageRoot) {
    console.error(`❌ Could not find package.json for: ${targetPageAbsolute}`)
    process.exit(1)
  }
  console.log(`📦 Target Package Root: ${targetPackageRoot}`)

  console.log(`\n📄 Analyzing page: ${targetPageRelative}`)
  await init

  const initialOpts: ResolveOptions = {
    currentFilePath: targetPageAbsolute,
    currentPackageRoot: targetPackageRoot,
    monorepoRoot: MONOREPO_ROOT,
  }

  await traceDependencies(targetPageAbsolute, initialOpts)

  console.log(
    '\n HEY LOOK HERE \n Collected files relative to monorepo root (including node_modules 1 level deep):',
  )
  Array.from(collectedFiles)
    .sort()
    .forEach((f) => console.log(` - ${f}`))

  // --- Repomix Integration ---
  if (collectedFiles.size > 0) {
    const includeString = Array.from(collectedFiles).join(',')
    const outputPath = path.resolve(MONOREPO_ROOT, 'repomix-bundle.txt')
    const repomixCommand = `repomix --include="${includeString}" --output="${outputPath}"`

    console.log('\n🚀 Running Repomix:')
    console.log(repomixCommand)

    try {
      const output = execSync(repomixCommand, {
        cwd: MONOREPO_ROOT,
        stdio: 'pipe',
        encoding: 'utf-8',
      })
      console.log('\n✅ Repomix executed successfully.')
      if (output) console.log('   Repomix Output:', output.trim())
      console.log(`📝 Repomix bundle content should be in: ${outputPath}`)
    } catch (error: any) {
      console.error('\n❌ Repomix command failed:')
      console.error(error.stderr || error.stdout || error.message)
      process.exit(1)
    }
  } else {
    console.log('\n🤷 No local dependencies found to bundle.')
  }
}

// --- Dependency Tracing ---
async function traceDependencies(absoluteFilePath: string, opts: ResolveOptions) {
  const normalizedPath = path.normalize(absoluteFilePath)

  if (
    seen.has(normalizedPath) ||
    normalizedPath.includes(path.normalize('/.nuxt/')) ||
    !normalizedPath.startsWith(opts.monorepoRoot)
  ) {
    return
  }
  seen.add(normalizedPath)

  const relativePath = path.relative(opts.monorepoRoot, normalizedPath)
  collectedFiles.add(relativePath)
  console.log(`  -> Adding: ${relativePath}`)

  if (normalizedPath.includes(path.normalize('/node_modules/'))) {
    console.log('     (Dependency is in node_modules, stopping recursion for this path)')
    return
  }

  console.log('     (Analyzing local dependency for further includes)')

  let code: string
  try {
    code = await fs.readFile(normalizedPath, 'utf-8')
  } catch (err: any) {
    console.warn(`⚠️ Could not read local file ${relativePath}: ${err.message}`)
    return
  }

  let scriptContent = ''
  let templateContent = ''
  const potentialDependencies = new Set<string>()

  if (normalizedPath.endsWith('.vue')) {
    try {
      const { descriptor, errors } = parseSFC(code, { filename: normalizedPath })
      if (errors.length)
        console.warn(`⚠️ Errors parsing ${relativePath}:`, errors.map((e) => e.message).join(', '))
      if (descriptor.script || descriptor.scriptSetup) {
        const scriptResult = compileScript(descriptor, { id: normalizedPath })
        scriptContent = scriptResult.content
      }
      if (descriptor.template) templateContent = descriptor.template.content
    } catch (e: any) {
      console.warn(`⚠️ Could not parse SFC ${relativePath}: ${e.message}`)
    }
  } else if (
    DEFAULT_EXTENSIONS.some(
      (ext) => normalizedPath.endsWith(ext) && !normalizedPath.endsWith('.vue'),
    )
  ) {
    scriptContent = code
  } else {
    return
  }

  if (scriptContent) {
    try {
      const [imports] = parseImports(scriptContent)
      imports.forEach((imp) => {
        if (imp.n) potentialDependencies.add(imp.n)
      })

      const composableUsageRegex = /[^a-zA-Z0-9_]?(use[A-Z][a-zA-Z0-9_]*)\(/g
      let match
      while ((match = composableUsageRegex.exec(scriptContent)) !== null) {
        potentialDependencies.add(match[1])
      }
      const storeToRefsUsageRegex = /storeToRefs\(([^)]+)\)/g
      while ((match = storeToRefsUsageRegex.exec(scriptContent)) !== null) {
        potentialDependencies.add(match[1].trim())
      }
    } catch (e: any) {
      console.warn(
        `⚠️ Could not parse imports in ${relativePath} with es-module-lexer: ${e.message}. Trying regex fallback.`,
      )
      const importRegex = /import(?:["'\s]*(?:[\w*{}\n\r\t, ]+)from\s*)?(["'])(.+?)\1/g
      let regexMatch
      while ((regexMatch = importRegex.exec(scriptContent)) !== null) {
        if (regexMatch[2] && !regexMatch[2].startsWith('type '))
          potentialDependencies.add(regexMatch[2])
      }
    }
  }

  if (templateContent) {
    try {
      const templateAst = parseTemplate(templateContent)
      const findComponentsInNode = (node: TemplateChildNode | null | undefined) => {
        if (!node) return
        if (node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.COMPONENT) {
          potentialDependencies.add(node.tag)
        }
        if (node.type === NodeTypes.ELEMENT) {
          const isProp = node.props.find(
            (p) =>
              p.type === NodeTypes.DIRECTIVE &&
              p.name === 'bind' &&
              p.arg?.type === NodeTypes.SIMPLE_EXPRESSION &&
              p.arg.content === 'is',
          )
          if (
            isProp &&
            isProp.type === NodeTypes.DIRECTIVE &&
            isProp.exp?.type === NodeTypes.SIMPLE_EXPRESSION
          ) {
            potentialDependencies.add(isProp.exp.content)
          }
        }
        if ('children' in node && Array.isArray(node.children)) {
          node.children
            .filter((child): child is TemplateChildNode => child != null)
            .forEach(findComponentsInNode)
        }
      }
      templateAst.children.forEach(findComponentsInNode)
    } catch (e: any) {
      console.warn(`⚠️ Could not parse or traverse template in ${relativePath}: ${e.message}`)
    }
  }

  const currentPackageRoot = findPackageRoot(normalizedPath)
  if (!currentPackageRoot) {
    console.warn(`⚠️ Could not determine package root for ${relativePath}. Resolution inaccurate.`)
    return
  }
  const currentOpts: ResolveOptions = {
    ...opts,
    currentFilePath: normalizedPath,
    currentPackageRoot,
  }

  console.log(
    `     Found potential dependencies in ${relativePath}:`,
    Array.from(potentialDependencies),
  )

  for (const depSpecifier of potentialDependencies) {
    // --- Increased logging for debugging resolution ---
    console.log(`    🔍 Attempting to resolve: ${depSpecifier}`)
    const resolvedPath = await resolveDependency(depSpecifier, currentOpts)
    if (resolvedPath) {
      console.log(
        `      ✅ Resolved '${depSpecifier}' to: ${path.relative(opts.monorepoRoot, resolvedPath)}`,
      )
      await traceDependencies(resolvedPath, currentOpts)
    } else {
      console.log(`      ❌ Failed to resolve '${depSpecifier}'`)
    }
  }
}

// --- Dependency Resolution Logic ---
async function resolveDependency(specifier: string, opts: ResolveOptions): Promise<string | null> {
  // Skip known external, built-ins, http links, type imports
  if (
    specifier.startsWith('node:') ||
    specifier.startsWith('http:') ||
    specifier.startsWith('https:') ||
    ['vue', 'pinia', 'nuxt', 'axios', 'storeToRefs', 'definePageMeta', 'onMounted'].includes(
      specifier,
    ) ||
    specifier.startsWith('nuxt/') ||
    specifier.startsWith('virtual:') ||
    specifier.startsWith('type ')
  ) {
    return null
  }
  // Skip Nuxt built-in components
  if (
    (specifier.startsWith('Nuxt') || specifier.startsWith('Lazy')) &&
    /^[A-Z]/.test(specifier.substring(specifier.startsWith('Lazy') ? 4 : 4))
  )
    return null
  if (['ClientOnly', 'ServerPlaceholder', 'Icon'].includes(specifier)) return null

  let potentialPath: string | null = null
  let resolvedFile: string | null = null // Store the final resolved file path

  // A. Handle Aliases (~/, @/)
  if (specifier.startsWith('~/') || specifier.startsWith('@/')) {
    potentialPath = path.resolve(opts.currentPackageRoot, specifier.substring(2))
    resolvedFile = tryResolveFile(potentialPath) // Try resolving with extensions/index
  } else if (specifier.startsWith('#')) {
    // B. Handle #imports (skip)
    return null
  } else if (specifier.startsWith('.')) {
    // C. Handle Relative Paths (./, ../)
    potentialPath = path.resolve(path.dirname(opts.currentFilePath), specifier)
    resolvedFile = tryResolveFile(potentialPath) // Try resolving with extensions/index
  } else {
    // D. Handle Bare Specifiers (packages, auto-imports, components)
    // D.1 Try resolving as a workspace or node_modules package first
    potentialPath = await resolveWorkspacePackage(specifier, opts)
    if (potentialPath) {
      // If resolved as package, potentialPath *is* the resolved file path (incl. extension)
      resolvedFile = potentialPath
    } else {
      // D.2 If not a package, try resolving as a Nuxt Auto-Import
      potentialPath = await resolveNuxtAutoImport(specifier, opts)
      if (potentialPath) {
        // If resolved as auto-import, potentialPath *is* the resolved file path (incl. extension) found by glob
        resolvedFile = potentialPath
      }
      // else: It's an unresolved bare specifier
    }
  }

  // If no resolution method yielded a file path
  if (!resolvedFile) {
    return null
  }

  // Final check: Ensure it's not in .nuxt and is within the monorepo OR node_modules
  const normalizedResolvedFile = path.normalize(resolvedFile)
  if (
    normalizedResolvedFile.includes(path.normalize('/.nuxt/')) ||
    (!normalizedResolvedFile.startsWith(opts.monorepoRoot) &&
      !normalizedResolvedFile.includes(path.normalize('/node_modules/')))
  ) {
    return null
  }

  return normalizedResolvedFile // Return the successfully resolved and verified path
}

// --- Resolution Helpers ---

function tryResolveFile(basePath: string): string | null {
  const normalizedBasePath = path.normalize(basePath)
  // Check direct file first
  try {
    if (fs.existsSync(normalizedBasePath) && fs.lstatSync(normalizedBasePath).isFile())
      return normalizedBasePath
  } catch {
    // Ignore errors
  }
  // Check with extensions
  for (const ext of DEFAULT_EXTENSIONS) {
    const filePath = normalizedBasePath + ext
    try {
      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile())
        return path.normalize(filePath)
    } catch {
      // Ignore errors
    }
  }
  // Check directory index files
  try {
    if (fs.existsSync(normalizedBasePath) && fs.lstatSync(normalizedBasePath).isDirectory()) {
      for (const indexFile of INDEX_FILES) {
        const filePath = path.join(normalizedBasePath, indexFile)
        try {
          if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile())
            return path.normalize(filePath)
        } catch {
          // Ignore errors
        }
      }
    }
  } catch {
    // Ignore errors
  }
  return null
}

async function resolveNuxtAutoImport(name: string, opts: ResolveOptions): Promise<string | null> {
  const potentialNames: string[] = [
    name,
    kebabCase(name),
    name.replace(/^use/, ''),
    name.replace(/Store$/, ''),
    name.replace(/^use/, '').replace(/Store$/, ''),
  ].filter((value, index, self) => self.indexOf(value) === index && value)

  const searchRoots = [
    opts.currentPackageRoot,
    ...LAYER_DIRS.map((l) => path.resolve(opts.monorepoRoot, l)),
  ]
  const checks = [
    { dirs: COMPONENT_DIRS, type: 'Component' },
    { dirs: COMPOSABLE_DIRS, type: 'Composable' },
    { dirs: STORE_DIRS, type: 'Store' },
    { dirs: UTIL_DIRS, type: 'Util' },
  ]

  // --- Added logging inside auto-import search ---
  // console.log(`    🔍 Searching auto-import for '${name}' (checking names: ${potentialNames.join(', ')}) in roots: ${searchRoots.join(', ')}`);

  for (const { dirs, type } of checks) {
    // console.log(`      -> Checking ${type} dirs: ${dirs.join(', ')}`);
    const potentialFile = await findFileInDirs(dirs, potentialNames, searchRoots, opts.monorepoRoot)
    if (potentialFile) {
      // console.log(`        ✅ Found auto-import '${name}' as ${type} at: ${path.relative(opts.monorepoRoot, potentialFile)}`);
      return potentialFile // Return the exact path found by glob
    }
  }
  // console.log(`    ❌ Auto-import '${name}' not found.`);
  return null
}

async function findFileInDirs(
  relativeDirs: string[],
  names: string[],
  searchRoots: string[],
  monorepoRoot: string,
): Promise<string | null> {
  for (const root of searchRoots) {
    if (!fs.existsSync(root)) continue
    for (const relDir of relativeDirs) {
      const absoluteDir = path.join(root, relDir)
      if (!fs.existsSync(absoluteDir)) continue
      for (const name of names) {
        if (!name) continue
        // Construct absolute patterns for glob
        const patterns = DEFAULT_EXTENSIONS.flatMap((ext) => [
          path.join(absoluteDir, `${name}${ext}`),
          path.join(absoluteDir, name, `index${ext}`),
        ]).map((p) => p.replace(/\\/g, '/')) // Use forward slashes for glob

        // --- Logging the glob patterns ---
        // console.log(`        🔍 Globbing in ${absoluteDir} with patterns: ${patterns.join(', ')}`);

        try {
          // Remove cwd since patterns are absolute
          const results = await glob(patterns, {
            absolute: true,
            nodir: true,
            ignore: ['**/*.d.ts'],
          })
          if (results.length > 0) {
            // console.log(`          ✅ Glob found: ${results.join(', ')}`);
            const directMatch = results.find((r) => {
              const base = path.basename(r, path.extname(r))
              return base.toLowerCase() === name.toLowerCase()
            })
            const indexMatch = results.find((r) => path.basename(r).startsWith('index.'))
            const bestMatch = path.normalize(directMatch || indexMatch || results[0])
            // console.log(`          -> Returning best match: ${bestMatch}`);
            return bestMatch // Return the exact path found
          }
        } catch (err) {
          console.warn(`⚠️ Error during glob search in ${absoluteDir}:`, err)
        }
      }
    }
  }
  return null
}

async function resolveWorkspacePackage(
  packageName: string,
  opts: ResolveOptions,
): Promise<string | null> {
  const potentialPackageRoots = [
    path.resolve(opts.monorepoRoot, 'packages', packageName),
    path.resolve(opts.monorepoRoot, 'apps', packageName),
    path.resolve(opts.monorepoRoot, 'libs', packageName),
  ]
  for (const potentialPackagePath of potentialPackageRoots) {
    const potentialPackageJson = path.join(potentialPackagePath, 'package.json')
    if (fs.existsSync(potentialPackageJson)) {
      try {
        const pkg = await fs.readJson(potentialPackageJson)
        let entryPoint = 'index'
        if (typeof pkg.exports === 'string') entryPoint = pkg.exports
        else if (typeof pkg.exports === 'object' && pkg.exports?.['.'])
          entryPoint = pkg.exports['.']
        else if (pkg.module) entryPoint = pkg.module
        else if (pkg.main) entryPoint = pkg.main
        // Resolve entry point relative to the package's path
        const resolvedEntry = tryResolveFile(path.resolve(potentialPackagePath, entryPoint))
        if (resolvedEntry) return resolvedEntry // Return the resolved entry file
        const resolvedDir = tryResolveFile(potentialPackagePath) // Check index file in root
        if (resolvedDir) return resolvedDir
      } catch (err) {
        console.warn(`⚠️ Error reading/resolving ${packageName} at ${potentialPackagePath}:`, err)
      }
      break
    }
  }
  // If not found locally, check node_modules
  return resolveNodeModulesPackage(packageName, opts)
}

async function resolveNodeModulesPackage(
  packageName: string,
  opts: ResolveOptions,
): Promise<string | null> {
  const nodeModulesRoots = [
    path.resolve(opts.monorepoRoot, 'node_modules'),
    path.resolve(opts.currentPackageRoot, 'node_modules'),
  ]
  for (const nmRoot of nodeModulesRoots) {
    const potentialPackagePath = path.join(nmRoot, packageName)
    const potentialPackageJson = path.join(potentialPackagePath, 'package.json')
    if (fs.existsSync(potentialPackageJson)) {
      try {
        const pkg = await fs.readJson(potentialPackageJson)
        let entryPoint = 'index'
        if (typeof pkg.exports === 'string') entryPoint = pkg.exports
        else if (typeof pkg.exports === 'object' && pkg.exports?.['.'])
          entryPoint = pkg.exports['.']
        else if (pkg.module) entryPoint = pkg.module
        else if (pkg.main) entryPoint = pkg.main
        const resolvedEntry = tryResolveFile(path.resolve(potentialPackagePath, entryPoint))
        if (resolvedEntry) return resolvedEntry // Return the resolved entry file
        const resolvedDir = tryResolveFile(potentialPackagePath) // Check index file in root
        if (resolvedDir) return resolvedDir
      } catch (err) {
        console.warn(`⚠️ Error reading/resolving ${packageName} at ${potentialPackagePath}:`, err)
      }
      return null // Found package.json but failed to resolve entry, stop checking
    }
  }
  return null
}

// --- Utility Functions ---
function findMonorepoRoot(): string | undefined {
  const workspaceFile = findUp.sync('pnpm-workspace.yaml', { cwd: process.cwd() })
  return workspaceFile ? path.dirname(workspaceFile) : undefined
}

function findPackageRoot(filePath: string): string | undefined {
  const pkgJsonPath = findUp.sync('package.json', { cwd: path.dirname(filePath) })
  return pkgJsonPath ? path.dirname(pkgJsonPath) : undefined
}

function kebabCase(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

// --- Bootstrap ---
if (import.meta.url === `file://${process.argv[1]}`) {
  start().catch((err) => {
    console.error('❌ Unhandled error during script execution:', err)
    process.exit(1)
  })
}
