import fs from 'fs'
import manifest from './manifest.json'
import packageJSON from './package.json'

manifest.version = packageJSON.version

fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2))
