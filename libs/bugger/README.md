# Site Debugger

A minimal, lightweight tool to crawl websites, capture DevTools logs, take screenshots, and organize
the results for internal debugging.

## Features

- Crawls websites starting from a sitemap or specific URL
- Captures console logs (errors, warnings, info, etc.)
- Records JavaScript errors and exceptions
- Logs failed network requests
- Takes screenshots of each page (above the fold)
- Organizes results by page in a clean directory structure
- Generates analysis reports and summaries

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/@astronera/bugger.git
cd @astronera/bugger

# Install dependencies
npm install

# Build the project
npm run build

# Link for global CLI usage (optional)
npm link
```

## Usage

### Basic Usage

```bash
# Using npm script with default options
npm run crawl -- https://example.com

# Or using the CLI (if linked globally)
@astronera/bugger --url https://example.com
```

### CLI Options

```
Usage: @astronera/bugger [options]

Options:
  -V, --version             output the version number
  -u, --url <url>           Starting URL to crawl (default: "https://example.com")
  -o, --output <directory>  Output directory (default: "./results")
  -m, --max-pages <number>  Maximum pages to crawl (default: "50")
  -h, --height <pixels>     Screenshot height (default: "1200")
  -r, --resources           Include HTML and resources (default: false)
  -c, --content             Log resource content (default: false)
  --visible                 Run in visible mode (not headless) (default: false)
  -t, --timeout <ms>        Page load timeout in milliseconds (default: "30000")
  --help                    display help for command
```

### Programmatic Usage

```typescript
import { WebsiteCrawler } from '@astronera/bugger'

async function runCrawler() {
  const crawler = new WebsiteCrawler({
    startUrl: 'https://example.com',
    outputDir: './results',
    maxPages: 50,
    screenshotHeight: 1200,
    includeResources: true,
    headless: true,
  })

  await crawler.crawl()
}

runCrawler()
```

## Output Structure

The tool creates a directory structure like:

```
results/
  ├── summary.json                 # Overall summary of the crawl
  ├── example_com_/                # Directory for each page (sanitized URL)
  │   ├── screenshot.png           # Screenshot of the page
  │   ├── console-logs.json        # All console logs
  │   ├── failed-requests.json     # Failed network requests
  │   ├── page.html                # Page HTML content (if includeResources=true)
  │   └── resources/               # Page resources (if logResourceContent=true)
  ├── example_com_about/
  │   ├── screenshot.png
  │   ├── ...
  ...
```

## Analyzing Results

After crawling, you can analyze the results:

```bash
# Run analysis on the crawl results
tsx src/analyze.ts ./results/summary.json ./analysis-results.json ./report.html

# Or using npm script
npm run analyze -- ./results/summary.json
```

This generates:

- A JSON file with detailed analysis
- An HTML report with visualizations of the found issues

## Internal Use Notes

This tool is designed for internal debugging only. It's a simple MVP focused on:

1. Capturing DevTools logs without modifying the target website
2. Taking screenshots for visual reference
3. Recording failed network requests
4. Organizing results in a consistent way

## Requirements

- Node.js 18+ (20.19 recommended)
- NPM/PNPM
- Chrome or Chromium (for Puppeteer)

## License

MIT
