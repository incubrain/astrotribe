# Playwright MCP Debugger

A focused debugging tool for the AstroTribe application using Playwright MCP with VS Code Insiders integration.

## Overview

This debugger uses Playwright MCP (Model Context Protocol) to automate browser interactions and capture issues in the AstroTribe application. It now integrates directly with VS Code Insiders, providing a streamlined approach with real browser automation while still supporting simulated responses as a fallback.

## Features

- **VS Code Insiders Integration**: Works directly with VS Code's Playwright MCP server
- **Simulated Responses Fallback**: Still works without requiring a Playwright MCP server
- **Console Log Capture**: Captures and formats console logs, errors, and warnings
- **Screenshot Capture**: Takes screenshots of pages and elements
- **Detailed Reporting**: Generates Markdown reports with logs and screenshots
- **Modular Architecture**: Clear separation of concerns for easy maintenance

## Prerequisites

- Node.js 20.19.0 or higher
- TypeScript
- VS Code Insiders with Playwright MCP extension (for non-simulated mode)

## Installation

1. Navigate to the debugger directory
2. Install dependencies:

```bash
npm install
```

3. Install the Playwright MCP extension in VS Code Insiders:

```bash
npm run install:vscode
```

Or manually install it through VS Code Insiders' extension panel by searching for "Playwright MCP".

## Project Structure

The debugger follows a modular structure:

```
libs/debugger/
├── src/
│   ├── config/
│   │   ├── index.ts     # Configuration settings
│   │   └── routes.json  # Predefined application routes
│   ├── utils/
│   │   ├── interaction.ts # Element interaction functions
│   │   ├── server_check.ts # VS Code MCP server check
│   │   ├── snapshot.ts    # Snapshot/screenshot functions
│   │   └── storage.ts     # File storage utilities
│   ├── index.ts         # Main entry point
│   ├── interactor.ts    # Page interaction functions
│   ├── logger.ts        # Console log capture and formatting
│   ├── mcp.ts           # MCP API with VS Code integration
│   ├── navigator.ts     # Navigation functions for login/routes
│   ├── reporter.ts      # Report generation and formatting
│   ├── types.ts         # Type definitions
│   └── vscode_integration.ts # VS Code specific functionality
├── output/              # Generated reports
├── playwright-test/     # Test scripts
├── tests/               # Integration tests
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # This documentation
```

## Configuration

The debugger is configured to use the following environment variables:

- `AUTH_URL`: URL of the authentication service (default: http://localhost:3009)
- `APP_URL`: URL of the main application (default: http://localhost:3000)
- `OUTPUT_PATH`: Path for the output report (default: ./output/bugfixing.md)
- `TEST_EMAIL`: Test user email (default: basic@testing.com)
- `TEST_PASSWORD`: Test user password (default: BasicTest123$)
- `MCP_SERVER_URL`: URL of the Playwright MCP server (default: http://localhost:9222/mcp)
- `USE_VSCODE_INTEGRATION`: Enable VS Code integration (default: false, true when running inside VS Code)
- `USE_VSCODE_INSIDERS`: Use VS Code Insiders instead of regular VS Code (default: true)
- `DISABLE_SIMULATION`: Disable simulation fallback mode (default: false)

## Usage

To run the debugger with different configurations:

```bash
# Run with VS Code Insiders integration (recommended)
npm run start:vscode

# Run in simple mode (without page interactions)
npm run start:simple

# Run in interactive mode (with page interactions)
npm run start:interactive

# Run with default settings
npm run start
```

### Run Modes

- `simple`: Runs through all routes in sequence
- `interactive`: Allows for interactive debugging with element interactions
- Using the `--use-vscode=true` flag enables VS Code integration

## VS Code Integration

The debugger now integrates directly with VS Code Insiders, providing several advantages:

1. **Direct Browser Control**: Uses VS Code's Playwright MCP server for reliable browser automation
2. **Automatic Installation**: Can install the required extension if not present
3. **VS Code Notifications**: Shows notifications in VS Code when running inside it
4. **Graceful Fallback**: Still works with simulated responses if VS Code integration is unavailable

To manually check if the Playwright MCP extension is installed in VS Code Insiders:

```bash
code-insiders --list-extensions | grep playwright
```

## Simulated Responses

When VS Code integration is unavailable or fails, the debugger falls back to simulated responses:

- Allows testing without a real browser
- Provides consistent behavior for CI/CD pipelines
- Useful for quick validation without VS Code dependencies

The simulated responses include all major browser actions like navigation, clicking, typing, and capturing screenshots.

## Output

The debugger generates a Markdown report at the configured output path with:

- Route information
- Console logs (categorized by type)
- Error summaries
- Warning details
- Screenshots (referenced in the report)

## Extending the Debugger

To extend the debugger with new functionality:

1. Add new utility functions to the appropriate module
2. Update the VS Code integration in `vscode_integration.ts` if needed
3. Modify the main flow in `index.ts` to use the new functionality

## Troubleshooting

If you encounter issues:

- **VS Code Integration Problems**:
  - Ensure VS Code Insiders is installed
  - Run `npm run install:vscode` to install the required extension
  - Check VS Code console for extension errors
  
- **General Issues**:
  - Check that environment variables are correctly set
  - Verify TypeScript compilation is successful
  - Ensure the output directory exists and is writable
  - Run with `--disable-simulation=false` to enable fallback mode

## License

This project is licensed under the MIT License.
