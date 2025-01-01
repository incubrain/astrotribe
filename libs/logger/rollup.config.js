export default (config) => {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      {
        name: 'transform-package-json',
        generateBundle(options, bundle) {
          // Find the package.json in the bundle
          const pkgJson = bundle['package.json']
          if (pkgJson) {
            const content = JSON.parse(pkgJson.source)

            // Update paths
            content.types = './index.esm.d.ts'
            content.main = './index.cjs.js'
            content.module = './index.esm.js'
            content.exports['.'] = {
              import: './index.esm.js',
              require: './index.cjs.js',
              types: './index.esm.d.ts',
            }

            pkgJson.source = JSON.stringify(content, null, 2)
          }
        },
      },
    ],
  }
}
