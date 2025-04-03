// test-playwright-mcp.ts
import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

// Function to read the Claude Desktop config
function readClaudeConfig() {
  try {
    const configPath =
      process.platform === 'darwin'
        ? join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
        : join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json')

    console.log(`Looking for Claude config at: ${configPath}`)
    const configData = readFileSync(configPath, 'utf8')
    return JSON.parse(configData)
  } catch (error) {
    console.error('Error reading Claude config:', error)
    return { mcpServers: {} }
  }
}

// Main test function
async function testPlaywrightMCP() {
  console.log('Testing Playwright MCP server from Claude Desktop')

  // Read the Claude config
  const claudeConfig = readClaudeConfig()

  // Check if Playwright MCP is configured
  if (!claudeConfig.mcpServers || !claudeConfig.mcpServers.playwright) {
    console.error('Playwright MCP server not found in Claude Desktop config')
    return
  }

  const serverConfig = claudeConfig.mcpServers.playwright
  console.log('Found Playwright server config:', serverConfig)

  const args = [...serverConfig.args]

  console.log(`Starting Playwright MCP server: ${serverConfig.command} ${args.join(' ')}`)

  // Start the server process
  const serverProcess = spawn(serverConfig.command, args, {
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  // Set up logging
  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server Output] ${data.toString().trim()}`)
  })

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error] ${data.toString().trim()}`)
  })

  // Wait for the server to start
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Send a navigate request
  const navigateRequest = {
    id: 'test-req-1',
    name: 'browser_navigate',
    args: {
      url: 'https://localhost:3000',
    },
  }

  console.log(`Sending navigate request: ${JSON.stringify(navigateRequest)}`)
  serverProcess.stdin.write(JSON.stringify(navigateRequest) + '\n')

  // Wait a bit for navigation
  await new Promise((resolve) => setTimeout(resolve, 5000))

  // Send a snapshot request
  const snapshotRequest = {
    id: 'test-req-2',
    name: 'browser_snapshot',
    args: {},
  }

  console.log(`Sending snapshot request: ${JSON.stringify(snapshotRequest)}`)
  serverProcess.stdin.write(JSON.stringify(snapshotRequest) + '\n')

  // Keep the process running for observation
  console.log('Test running. Press Ctrl+C to exit.')

  // Wait for user input to terminate
  process.stdin.on('data', () => {
    console.log('Terminating test...')
    serverProcess.kill()
    process.exit(0)
  })
}

// Run the test
testPlaywrightMCP().catch(console.error)
