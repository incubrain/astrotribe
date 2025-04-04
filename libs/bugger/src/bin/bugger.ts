// bin/@astronera/bugger.js

// This file is the CLI entry point for the @astronera/bugger tool
import path from 'path'
import { program } from 'commander'
import { WebsiteCrawler } from '../index'

program
  .name('site-debugger')
  .description('Crawl a website and capture DevTools logs and screenshots')
  .version('0.1.0')
  .option('-u, --url <url>', 'Starting URL to crawl', 'http://localhost:3000')
  .option('-o, --output <directory>', 'Output directory', './results')
  .option('-m, --max-pages <number>', 'Maximum pages to crawl', '50')
  .option('-h, --height <pixels>', 'Screenshot height', '1200')
  .option('-r, --resources', 'Include HTML and resources', false)
  .option('-c, --content', 'Log resource content', false)
  .option('--visible', 'Run in visible mode (not headless)', false)
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds', '30000')
  .option('-b, --browser <type>', 'Browser to use (chromium, firefox, webkit)', 'chromium')
  .action(async (options) => {
    try {
      const outputDir = path.resolve(process.cwd(), options.output)

      console.log(`Starting crawler with URL: ${options.url}`)
      console.log(`Using browser: ${options.browser}`)
      console.log(`Saving results to: ${outputDir}`)

      const crawler = new WebsiteCrawler({
        startUrl: options.url,
        outputDir: outputDir,
        maxPages: parseInt(options.maxPages),
        screenshotHeight: parseInt(options.height),
        includeResources: options.resources,
        logResourceContent: options.content,
        headless: !options.visible,
        timeout: parseInt(options.timeout),
        browser: options.browser,
      })

      await crawler.crawl()
      process.exit(0)
    } catch (error: any) {
      console.error(`Error: ${error.message || error}`)
      process.exit(1)
    }
  })

program.parse()
