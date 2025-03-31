# Type Extractor

A utility for extracting and processing TypeScript definition files from packages, optimized for
token-efficient LLM usage.

## Features

- Extract TypeScript definitions (`.d.ts` files) from any installed package
- Remove unnecessary imports and comments while preserving documentation
- Generate a file tree overview with token counts
- List top files by token count
- Calculate total token usage for LLM processing
- Generate a single, organized output file

## Installation

```bash
npm install
```

## Usage

```bash
# Basic usage
npm run extract -- @your-package/name

# With exclude patterns
npm run extract -- @your-package/name --exclude="**/node_modules/**,**/test/**"

# With debug mode for detailed logging
npm run extract -- @your-package/name --debug
```

## Debug Mode

When running with the `--debug` flag, the script creates a `debug` directory with multiple versions
of each processed file, making it easier to diagnose issues:

- `.original` - The original file content
- `.processed` - After comment removal
- `.imports-removed` - After import removal

## Plugin System

The utility has a modular plugin system:

- `token-calculator` - Calculates token usage
- `comment-remover` - Removes unnecessary comments
- `import-remover` - Removes import statements
- `file-tree` - Generates file tree visualization
- `largest-files` - Reports largest files by token count

## Example Output

The output file structure:

```
/* SUMMARY INFORMATION */
Package: @your-package/name
Extraction Date: 2025-03-31T12:29:10.268Z
Total Files: 89
Total Tokens: ~32743

/* TOP 15 FILES BY TOKEN COUNT */
1. types/button/index.d.ts (~1931 tokens)
2. types/datatable/index.d.ts (~1387 tokens)
...

/* FILE TREE WITH TOKEN ESTIMATIONS */
└── 📁 types
    ├── 📁 button
        └── 📄 index.d.ts (~1931 tokens)
    ...

/* --- types/button/index.d.ts --- */
export interface ButtonProps {
  ...
}
```
