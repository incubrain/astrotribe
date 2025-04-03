
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
    