import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { join, dirname, basename } from "path";
import { execSync } from "child_process";
import type { SiteConfig } from "../../../types/site";

// Export copyRecursive for use in copySharedComponents
function copyRecursive(src: string, dest: string): void {
  // Use platform-appropriate copy command
  if (process.platform === "win32") {
    execSync(`xcopy /E /I /Y "${src}" "${dest}"`, { stdio: "inherit" });
  } else {
    execSync(`cp -r "${src}"/* "${dest}"`, { stdio: "inherit" });
  }
}

/**
 * Copy template files to target directory
 */
export function scaffoldTemplate(
  templatePath: string,
  targetPath: string
): void {
  const templateDir = join(templatePath, "classic");

  if (!existsSync(templateDir)) {
    throw new Error(`Classic template not found at ${templateDir}`);
  }

  // Copy all files recursively
  copyRecursive(templateDir, targetPath);
}

/**
 * Copy shared components to target directory
 * This ensures the scaffolded template has access to shared components
 */
export function copySharedComponents(sourceRoot: string, targetPath: string): void {
  // Determine the source root (where components directory is)
  // Assuming templates are in ./templates relative to source root
  const componentsSource = join(sourceRoot, "components");
  const libSource = join(sourceRoot, "lib");
  const hooksSource = join(sourceRoot, "hooks");
  const typesSource = join(sourceRoot, "types");

  // Create directories if they don't exist
  const componentsTarget = join(targetPath, "components");
  const libTarget = join(targetPath, "lib");
  const hooksTarget = join(targetPath, "hooks");
  const typesTarget = join(targetPath, "types");

  // Copy shared components, variants, and layout directories
  if (existsSync(componentsSource)) {
    // Copy components/shared
    const sharedSource = join(componentsSource, "shared");
    const sharedTarget = join(componentsTarget, "shared");
    if (existsSync(sharedSource)) {
      copyRecursive(sharedSource, sharedTarget);
    }

    // Copy components/variants
    const variantsSource = join(componentsSource, "variants");
    const variantsTarget = join(componentsTarget, "variants");
    if (existsSync(variantsSource)) {
      copyRecursive(variantsSource, variantsTarget);
    }

    // Copy components/layout
    const layoutSource = join(componentsSource, "layout");
    const layoutTarget = join(componentsTarget, "layout");
    if (existsSync(layoutSource)) {
      copyRecursive(layoutSource, layoutTarget);
    }

    // Copy components/ui (for shared UI components like Marquee)
    const uiSource = join(componentsSource, "ui");
    const uiTarget = join(componentsTarget, "ui");
    if (existsSync(uiSource)) {
      copyRecursive(uiSource, uiTarget);
    }
  }

    // Copy lib/variants.ts
    if (existsSync(libSource)) {
      const variantsLibSource = join(libSource, "variants.ts");
      const variantsLibTarget = join(libTarget, "variants.ts");
      if (existsSync(variantsLibSource)) {
        mkdirSync(libTarget, { recursive: true });
        copyFileSync(variantsLibSource, variantsLibTarget);
      }

      // Copy lib/utils.ts (needed for normalizeImagePath, cn, etc.)
      const utilsSource = join(libSource, "utils.ts");
      const utilsTarget = join(libTarget, "utils.ts");
      if (existsSync(utilsSource)) {
        copyFileSync(utilsSource, utilsTarget);
      }

      // Copy lib/fonts.ts (needed for font selection)
      const fontsSource = join(libSource, "fonts.ts");
      const fontsTarget = join(libTarget, "fonts.ts");
      if (existsSync(fontsSource)) {
        mkdirSync(libTarget, { recursive: true });
        copyFileSync(fontsSource, fontsTarget);
      }
    }

  // Copy hooks (for useScrollAnimation)
  if (existsSync(hooksSource)) {
    copyRecursive(hooksSource, hooksTarget);
  }

  // Copy types (for SiteConfig, LayoutId, etc.)
  if (existsSync(typesSource)) {
    copyRecursive(typesSource, typesTarget);
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
 * Generate fresh pnpm-lock.yaml for the template
 */
export function generateLockfile(targetPath: string): void {
  const cwd = targetPath;

  // Remove any existing lockfile that might have been copied
  const lockfilePath = join(targetPath, "pnpm-lock.yaml");
  if (existsSync(lockfilePath)) {
    unlinkSync(lockfilePath);
  }

  // Generate fresh lockfile by running pnpm install
  try {
    execSync("pnpm install", { cwd, stdio: "inherit" });
  } catch (error: any) {
    console.warn("Warning: Failed to generate pnpm-lock.yaml:", error.message);
    // Continue anyway - Vercel can generate it
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

