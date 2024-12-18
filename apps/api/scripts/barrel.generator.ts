// scripts/barrel.generator.ts
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { CustomLogger } from "../src/core/logger/custom.logger";

interface BarrelConfig {
  // Root directory to start scanning from
  rootDir: string;
  // Array of directory names to generate barrels for
  directories: string[];
  // Optional: File extensions to include (defaults to .ts and .tsx)
  extensions?: string[];
  // Optional: Files to ignore (defaults to .spec.ts, .test.ts, etc)
  ignorePatterns?: string[];
  // Optional: Whether to generate nested barrel files (defaults to true)
  generateNestedBarrels?: boolean;

  excludeDirs?: string[];
}

export class BarrelGenerator {
  private readonly logger: CustomLogger;
  private readonly defaultExtensions = [".ts", ".tsx"];
  private readonly defaultIgnorePatterns = [
    ".spec.ts",
    ".test.ts",
    ".e2e-spec.ts",
    ".d.ts",
    "index.ts",
  ];
  private readonly defaultExcludeDirs = ["__tests__"];

  constructor(logger: CustomLogger) {
    this.logger = logger;
    this.logger.setContext("BarrelGenerator");
  }

  private shouldExcludeDir(dirPath: string, excludeDirs: string[]): boolean {
    return excludeDirs.some(
      (excludeDir) =>
        dirPath.includes(`/${excludeDir}/`) ||
        dirPath.endsWith(`/${excludeDir}`)
    );
  }

  async generateBarrels(config: BarrelConfig): Promise<void> {
    const {
      rootDir,
      directories,
      extensions = this.defaultExtensions,
      ignorePatterns = this.defaultIgnorePatterns,
      generateNestedBarrels = true,
    } = config;

    this.logger.log(
      `Starting barrel file generation for directories: ${directories.join(
        ", "
      )}`
    );

    for (const dir of directories) {
      const fullPath = path.join(rootDir, dir);

      if (!fs.existsSync(fullPath)) {
        this.logger.warn(`Directory not found: ${fullPath}`);
        continue;
      }

      await this.processDirectory(fullPath, {
        extensions,
        ignorePatterns,
        generateNestedBarrels,
      });
    }

    this.logger.log("Barrel file generation completed");
  }

  private async processDirectory(
    dirPath: string,
    options: Pick<
      BarrelConfig,
      "extensions" | "ignorePatterns" | "generateNestedBarrels"
    >,
    isRootDir = true // Add flag to identify root level directories
  ): Promise<string[]> {
    // Return exports to collect from nested dirs
    try {
      const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
      const exports: string[] = [];
      const rootDir = isRootDir ? dirPath : path.dirname(dirPath);
      const excludeDirs = options.excludeDirs || this.defaultExcludeDirs;

      // Skip this directory if it's in the exclude list
      if (!isRootDir && this.shouldExcludeDir(dirPath, excludeDirs)) {
        return exports;
      }

      // Process all files in current directory
      const validFiles = files
        .filter((file) => file.isFile())
        .map((file) => file.name)
        .filter((filename) => {
          const isValidExtension = options.extensions.some((ext) =>
            filename.endsWith(ext)
          );
          const shouldInclude = !options.ignorePatterns.some((pattern) =>
            filename.includes(pattern)
          );
          return isValidExtension && shouldInclude;
        });

      // Generate exports for valid files
      validFiles.forEach((filename) => {
        const relativePath = path.relative(
          rootDir,
          path.join(dirPath, filename)
        );
        exports.push(this.generateExportForFile(relativePath));
      });

      // Process subdirectories
      const subdirs = files.filter((file) => file.isDirectory());
      for (const subdir of subdirs) {
        const subdirPath = path.join(dirPath, subdir.name);
        // Skip excluded directories
        if (!this.shouldExcludeDir(subdirPath, excludeDirs)) {
          const nestedExports = await this.processDirectory(
            subdirPath,
            options,
            false
          );
          exports.push(...nestedExports);
        }
      }

      // Only write barrel file if this is a root directory
      if (isRootDir && exports.length > 0) {
        await this.writeBarrelFile(dirPath, exports);
      }

      return exports;
    } catch (error) {
      this.logger.error(`Error processing directory ${dirPath}:`, error.stack);
      throw error;
    }
  }

  private generateExportForFile(filename: string): string {
    // Remove .ts extension if it exists
    const withoutExt = filename.replace(/\.ts$/, "");
    return `export * from './${withoutExt}';`;
  }

  private generateBarrelContent(exports: string[]): string {
    // Remove any duplicate exports
    const uniqueExports = [...new Set(exports)];

    return `// Auto-generated barrel file
  ${uniqueExports.join("\n")}
  `;
  }

  private async writeBarrelFile(
    dirPath: string,
    exports: string[]
  ): Promise<void> {
    const barrelPath = path.join(dirPath, "index.ts");
    const content = this.generateBarrelContent(exports);

    try {
      await fs.promises.writeFile(barrelPath, content);
      this.logger.debug(`Generated barrel file: ${barrelPath}`);
    } catch (error) {
      this.logger.error(
        `Error writing barrel file ${barrelPath}:`,
        error.stack
      );
      throw error;
    }
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Example usage script
export async function generateProjectBarrels() {
  const logger = new CustomLogger("BarrelGenerator");
  const generator = new BarrelGenerator(logger);

  await generator.generateBarrels({
    rootDir: path.resolve(__dirname, "../src"),
    directories: ["core", "content", "types"],
    // Optional: Customize extensions if needed
    extensions: [".ts", ".tsx"],
    // Optional: Add custom ignore patterns
    ignorePatterns: [
      ".spec.ts",
      ".test.ts",
      ".e2e-spec.ts",
      ".d.ts",
      "index.ts",
      ".mock.ts",
      "__tests__",
    ],
    // Optional: Set to false if you don't want nested barrel files
    generateNestedBarrels: false,
    excludeDirs: ["__tests__"], // Add directories to exclude here
  });
}

// If running directly
if (import.meta.url.endsWith(process.argv[1])) {
  generateProjectBarrels().catch((error) => {
    console.error("Error generating barrel files:", error);
    process.exit(1);
  });
}
