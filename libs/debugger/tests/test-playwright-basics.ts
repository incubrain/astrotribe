// test-playwright-basic.ts
import { execSync, spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

async function testPlaywrightBasic() {
  console.log('Testing basic Playwright installation and browser launch')

  try {
    // Step 1: Check if Playwright is installed
    console.log('Checking if Playwright is installed...')
    try {
      const versionOutput = execSync('npx playwright --version', { encoding: 'utf8' })
      console.log(`Playwright version: ${versionOutput.trim()}`)
    } catch (error) {
      console.error('Playwright is not installed or not in PATH')
      console.log('Attempting to install Playwright...')
      execSync('npm install -D playwright', { stdio: 'inherit' })
    }

    // Step 2: Create a simple test script
    const testDir = path.join(process.cwd(), 'playwright-test')
    const testFile = path.join(testDir, 'test-browser.js')

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }

    // Write a simple test script
    fs.writeFileSync(
      testFile,
      `
      // Simple Playwright test script
      import { chromium } from 'playwright';
      
      (async () => {
        console.log('Launching browser...');
        const browser = await chromium.launch({ 
          headless: false,
          slowMo: 100
        });
        console.log('Browser launched successfully');
        
        const context = await browser.newContext();
        const page = await context.newPage();
        
        console.log('Navigating to google.com...');
        await page.goto('https://google.com');
        console.log('Navigation successful');
        
        // Wait for 5 seconds to observe the browser
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed');
      })().catch(err => {
        console.error('Test failed:', err);
        process.exit(1);
      });
    `,
    )

    // Step 3: Run the test script
    console.log(`Running test script: ${testFile}`)
    const testProcess = spawn('node', [testFile], {
      stdio: 'inherit',
    })

    return new Promise((resolve, reject) => {
      testProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Playwright test completed successfully')
          resolve(true)
        } else {
          console.error(`Playwright test failed with code ${code}`)
          reject(new Error(`Test failed with code ${code}`))
        }
      })

      testProcess.on('error', (err) => {
        console.error('Error running test process:', err)
        reject(err)
      })
    })
  } catch (error) {
    console.error('Test failed:', error)
    return false
  }
}

// Run the test
testPlaywrightBasic()
  .then((success) => {
    console.log(`Test ${success ? 'passed' : 'failed'}`)
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })
