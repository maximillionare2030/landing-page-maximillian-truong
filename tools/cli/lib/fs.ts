import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { execSync } from "child_process";
import type { SiteConfig } from "../../../types/site";

/**
 * Copy template files to target directory
 */
export function scaffoldTemplate(
  templatePath: string,
  targetPath: string,
  layout: "classic" | "timeline" | "compact"
): void {
  const templateDir = join(templatePath, layout);

  if (!existsSync(templateDir)) {
    throw new Error(`Template ${layout} not found at ${templateDir}`);
  }

  // Copy all files recursively
  copyRecursive(templateDir, targetPath);
}

/**
 * Recursively copy directory
 */
function copyRecursive(src: string, dest: string): void {
  // Use platform-appropriate copy command
  if (process.platform === "win32") {
    execSync(`xcopy /E /I /Y "${src}" "${dest}"`, { stdio: "inherit" });
  } else {
    execSync(`cp -r "${src}"/* "${dest}"`, { stdio: "inherit" });
  }
}

/**
 * Write site config to target directory
 */
export function writeSiteConfig(targetPath: string, config: SiteConfig): void {
  const configPath = join(targetPath, "site.config.json");
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Copy assets to public/uploads directory
 */
export function copyAssets(
  assetsPath: string,
  targetPath: string,
  config: SiteConfig
): void {
  const uploadsDir = join(targetPath, "public", "uploads");

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  // Update image paths in config to point to /uploads
  if (config.about.image) {
    const assetName = basename(config.about.image);
    const sourcePath = join(assetsPath, assetName);
    const destPath = join(uploadsDir, assetName);

    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
      config.about.image = `/uploads/${assetName}`;
    }
  }

  // Copy portfolio images
  config.portfolio.forEach((project) => {
    if (project.image) {
      const assetName = basename(project.image);
      const sourcePath = join(assetsPath, assetName);
      const destPath = join(uploadsDir, assetName);

      if (existsSync(sourcePath)) {
        copyFileSync(sourcePath, destPath);
        project.image = `/uploads/${assetName}`;
      }
    }
  });

  // Copy avatar and hero images if present
  if (config.images?.avatar) {
    const assetName = basename(config.images.avatar);
    const sourcePath = join(assetsPath, assetName);
    const destPath = join(uploadsDir, assetName);

    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
      if (config.images) {
        config.images.avatar = `/uploads/${assetName}`;
      }
    }
  }

  if (config.images?.hero) {
    const assetName = basename(config.images.hero);
    const sourcePath = join(assetsPath, assetName);
    const destPath = join(uploadsDir, assetName);

    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
      if (config.images) {
        config.images.hero = `/uploads/${assetName}`;
      }
    }
  }
}

/**
 * Initialize git repository and make initial commit
 */
export function initializeGit(targetPath: string, message: string = "Initial commit"): void {
  const cwd = targetPath;

  try {
    // Check if git is already initialized
    execSync("git status", { cwd, stdio: "ignore" });
  } catch {
    // Initialize git if not already done
    execSync("git init", { cwd, stdio: "inherit" });
  }

  // Add all files
  execSync("git add .", { cwd, stdio: "inherit" });

  // Commit (ignore error if nothing to commit)
  try {
    execSync(`git commit -m "${message}"`, { cwd, stdio: "inherit" });
  } catch (error: any) {
    // If commit fails because there's nothing to commit, that's okay
    if (error.message?.includes("nothing to commit")) {
      console.log("No changes to commit");
    } else {
      throw error;
    }
  }
}

/**
 * Set git remote and push
 */
export function pushToGitHub(
  targetPath: string,
  repoUrl: string,
  branch: string = "main"
): void {
  const cwd = targetPath;

  try {
    // Check if remote already exists
    execSync("git remote get-url origin", { cwd, stdio: "ignore" });
    execSync(`git remote set-url origin ${repoUrl}`, { cwd, stdio: "inherit" });
  } catch {
    // Add remote if it doesn't exist
    execSync(`git remote add origin ${repoUrl}`, { cwd, stdio: "inherit" });
  }

  // Rename branch to main if needed
  try {
    execSync("git branch -M main", { cwd, stdio: "inherit" });
  } catch {
    // Branch might already be main
  }

  // Push to GitHub
  execSync(`git push -u origin ${branch}`, { cwd, stdio: "inherit" });
}

