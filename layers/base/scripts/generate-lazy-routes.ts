import fs from 'fs'
import path from 'path'

function generateRoutes(dir: string, basePath: string = ''): any[] {
  const files = fs.readdirSync(dir)

  return files.reduce((routes: any[], file: string) => {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      // Recursively traverse subdirectories
      return [...routes, ...generateRoutes(filePath, path.join(basePath, file))]
    } else if (file.endsWith('.vue') && file !== 'index.vue') {
      // Generate route for .vue files, excluding index.vue
      const routePath = path.join(basePath, file.replace('.vue', ''))
      const componentPath = path.relative(process.cwd(), filePath)

      return [
        ...routes,
        {
          path: `/${routePath}`,
          component: () => import(`@/${componentPath}`),
        },
      ]
    }

    return routes
  }, [])
}

export default generateRoutes
