const fs = require('fs')
const path = require('path')

// Create store-assets directory if it doesn't exist
const storeDir = path.join(__dirname, '../store-assets')
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir)
}

// Create template files for required store assets
const templates = {
  'description.txt': `[Detailed Description]
What does your extension do?
Key features:
- Feature 1
- Feature 2

[Short Description - max 132 characters]
Brief overview of your extension's main function`,

  'privacy-policy.txt': `Privacy Policy Template:
1. Data Collection
2. Data Usage
3. Data Protection
4. User Rights`,

  'store-requirements.md': `# Chrome Web Store Submission Checklist
- [ ] Icon (128x128 PNG)
- [ ] Screenshots (1280x800 or 640x400)
- [ ] Detailed description
- [ ] Privacy policy
- [ ] Category selected
- [ ] Promotional images (optional)
`,
}

// Write template files
Object.entries(templates).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(storeDir, filename), content, 'utf8')
})

console.log('Store assets templates created in /store-assets')
