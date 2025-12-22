#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { readConfig } from "./lib/config";
import { scaffoldTemplate, writeSiteConfig, copyAssets, generateLockfile, initializeGit, pushToGitHub, copySharedComponents } from "./lib/fs";
import { createGitHubRepo, getRepoUrl } from "./lib/octokit";
import type { SiteConfig } from "../../types/site";
import { readFileSync } from "fs";
import { join, dirname } from "path";

// Utility functions (duplicated from lib/utils.ts for CLI use)
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function generateRepoName(firstName: string, lastName: string): string {
  const first = slugify(firstName);
  const last = slugify(lastName);
  return `landing-page-${first}-${last}`;
}

const program = new Command();

program
  .name("landing-foundry-cli")
  .description("CLI tool for applying landing page configurations")
  .version("0.1.0");

program
  .command("apply-config")
  .description("Apply a config.json and assets to a template")
  .requiredOption("--config <path>", "Path to config.json file")
  .requiredOption("--assets <path>", "Path to assets directory")
  .option("--theme <theme>", "Override theme ID")
  .option("--repo <name>", "Repository name (defaults to pattern)")
  .option("--owner <username>", "GitHub username (required for --create-repo)")
  .option("--create-repo", "Create GitHub repository")
  .option("--private", "Create private repository")
  .option("--push", "Push to GitHub after applying")
  .option("--target <path>", "Target directory (defaults to current directory)")
  .option("--template-path <path>", "Path to templates directory")
  .action(async (options) => {
    try {
      console.log(chalk.blue("🚀 Landing Foundry CLI"));
      console.log(chalk.gray("Applying configuration...\n"));

      // Read config
      const configResult = readConfig(options.config);
      if (!configResult.success || !configResult.config) {
        console.error(chalk.red("❌ Error reading config:"), configResult.error);
        process.exit(1);
      }

      let config = configResult.config;

      // Override theme if provided
      if (options.theme) {
        config.theme.id = options.theme as any;
      }

      // Always use classic layout
      config.layout = "classic";

      // Determine target directory
      const targetDir = options.target || process.cwd();
      const templatePath = options.templatePath || join(process.cwd(), "templates");
      // Determine source root (parent of templates directory)
      const sourceRoot = dirname(templatePath);

      // Scaffold template
      console.log(chalk.blue(`📦 Scaffolding classic template...`));
      scaffoldTemplate(templatePath, targetDir);

      // Copy shared components
      console.log(chalk.blue("📚 Copying shared components..."));
      copySharedComponents(sourceRoot, targetDir);

      // Copy assets and update paths
      console.log(chalk.blue("📁 Copying assets..."));
      copyAssets(options.assets, targetDir, config);

      // Write site config
      console.log(chalk.blue("✍️  Writing site.config.json..."));
      writeSiteConfig(targetDir, config);

      // Generate fresh pnpm-lock.yaml that matches the template's package.json
      console.log(chalk.blue("🔒 Generating pnpm-lock.yaml..."));
      generateLockfile(targetDir);

      // Initialize git
      console.log(chalk.blue("🔧 Initializing git repository..."));
      initializeGit(targetDir, "Initial commit: Landing page setup");

      // Create repo if requested
      let repoName = options.repo;
      let repoUrl: string | undefined;

      if (options.createRepo) {
        if (!options.owner) {
          console.error(chalk.red("❌ --owner is required when using --create-repo"));
          process.exit(1);
        }

        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
          console.error(chalk.red("❌ GITHUB_TOKEN environment variable is required"));
          process.exit(1);
        }

        // Generate repo name if not provided
        if (!repoName) {
          const nameParts = config.name.split(" ");
          const firstName = nameParts[0] || "user";
          const lastName = nameParts.slice(1).join("-") || "page";
          repoName = generateRepoName(firstName, lastName);
        }

        console.log(chalk.blue(`🔨 Creating GitHub repository: ${repoName}...`));
        const repoResult = await createGitHubRepo(githubToken, {
          name: repoName,
          owner: options.owner,
          private: options.private || false,
        });

        if (!repoResult.success) {
          console.error(chalk.red("❌ Failed to create repository:"), repoResult.error);
          process.exit(1);
        }

        repoName = repoResult.repoName;
        repoUrl = getRepoUrl(options.owner, repoName);
        console.log(chalk.green(`✅ Repository created: ${repoResult.repoUrl}`));
      }

      // Push to GitHub if requested
      if (options.push) {
        if (!repoUrl) {
          if (!options.owner || !repoName) {
            console.error(chalk.red("❌ --owner and --repo are required for --push"));
            process.exit(1);
          }
          repoUrl = getRepoUrl(options.owner, repoName);
        }

        console.log(chalk.blue("📤 Pushing to GitHub..."));
        pushToGitHub(targetDir, repoUrl);
        console.log(chalk.green("✅ Pushed to GitHub successfully!"));
      }

      // Print deployment instructions
      if (repoUrl) {
        console.log(chalk.green("\n✅ Configuration applied successfully!"));
        console.log(chalk.blue("\n📋 Next steps:"));
        console.log(chalk.gray(`   1. Repository: ${repoUrl}`));
        console.log(chalk.gray("   2. Deploy to Vercel:"));
        console.log(chalk.gray("      - Go to https://vercel.com"));
        console.log(chalk.gray(`      - Import repository: ${repoName}`));
        console.log(chalk.gray("      - Deploy!"));
      } else {
        console.log(chalk.green("\n✅ Configuration applied successfully!"));
        console.log(chalk.blue("\n📋 Next steps:"));
        console.log(chalk.gray("   1. Create a GitHub repository"));
        console.log(chalk.gray("   2. Push this directory to GitHub"));
        console.log(chalk.gray("   3. Deploy to Vercel"));
      }
    } catch (error: any) {
      console.error(chalk.red("❌ Error:"), error.message);
      process.exit(1);
    }
  });

program.parse();

