// cli/scanner/utils/nx-tree.ts
import * as fs from 'fs'
import * as path from 'path'
import type { Tree } from '@nx/devkit'
import { workspaceRoot } from '@nx/devkit'

export function createNxTree(): Tree {
  const changes = new Map<string, { content: string | null; isDeleted?: boolean }>()

  return {
    root: workspaceRoot,

    read(filePath: string): Buffer | null {
      const fullPath = path.join(workspaceRoot, filePath)
      try {
        return fs.readFileSync(fullPath)
      } catch {
        return null
      }
    },

    write(filePath: string, content: Buffer | string): void {
      changes.set(filePath, {
        content: content instanceof Buffer ? content.toString() : content,
      })
    },

    delete(filePath: string): void {
      changes.set(filePath, { content: null, isDeleted: true })
    },

    exists(filePath: string): boolean {
      const fullPath = path.join(workspaceRoot, filePath)
      return fs.existsSync(fullPath)
    },

    rename(from: string, to: string): void {
      const content = this.read(from)
      if (content) {
        this.write(to, content)
        this.delete(from)
      }
    },

    isFile(filePath: string): boolean {
      const fullPath = path.join(workspaceRoot, filePath)
      try {
        return fs.statSync(fullPath).isFile()
      } catch {
        return false
      }
    },

    children(dirPath: string): string[] {
      const fullPath = path.join(workspaceRoot, dirPath)
      try {
        return fs.readdirSync(fullPath)
      } catch {
        return []
      }
    },

    // Required for NX project detection
    listChanges(): {
      type: 'CREATE' | 'DELETE' | 'UPDATE'
      path: string
      content?: string | null
    }[] {
      return Array.from(changes.entries()).map(([path, change]) => ({
        type: change.isDeleted ? 'DELETE' : change.content ? 'UPDATE' : 'CREATE',
        path,
        content: change.content,
      }))
    },
  }
}
